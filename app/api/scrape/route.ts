import FireCrawl from "@mendable/firecrawl-js";
import OpenAI from "openai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { generateObject } from "ai";
import { mistral } from "@ai-sdk/mistral";
import * as htmlToText from "html-to-text";
import { load } from "cheerio";
import { ScrapeResponse } from "@mendable/firecrawl-js";

// Initialize FireCrawl
const firecrawl = new FireCrawl({
  apiKey: process.env.FIRECRAWL_API_KEY!,
});

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { userMessage } = await req.json();

    const {
      object: {
        actions: { action, url, message },
      },
    } = await generateObject({
      model: mistral("mistral-large-latest"),
      schema: z.object({
        actions: z.object({
          action: z.enum(["scrape", "crawl"]),
          url: z.string().url(),
          message: z.string(),
        }),
      }),
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
      system: `You are a web scraping assistant. Given a user's message, extract two pieces of information:
          1. The website URL they want to scrape
          2. The specific action they want to perform`,
    });

    const scrapeOptions = {
      limit: 20,
    };

    const result = (await firecrawl.scrapeUrl(url, {
      formats: ["html"],
    })) as ScrapeResponse;

    if (result.error || !result.html) {
      console.log(result);
      throw new Error("failed");
    }

    const loadableBody = result.html.replace(/>\s*</g, "> <");
    const $ = load(loadableBody);
    const body = cleanHtml($("body").prop("outerHTML") || "");

    const images = $("img")
      .map((_, element) => ({
        url: $(element).attr("src"),
        alt: $(element).attr("alt") || "",
        width: $(element).attr("width"),
        height: $(element).attr("height"),
      }))
      .get();

    // Analyze all images together with Mistral Vision
    const imageContent: { type: "image"; image: string }[] = images
      .filter((img) => img.url)
      .map((img) => ({
        type: "image_url",
        imageUrl: img.url || "",
      }));

    const textContent = htmlToText.convert(body, {
      selectors: [
        { selector: "img", format: "skip" },
        {
          selector: "a",
          options: { baseUrl: url },
        },
      ],
    });

    const response = await generateObject({
      model: mistral("pixtral-large-latest"),
      schema: z.object({
        relevant_image: z.string(),
      }),
      system:
        "You are a image detection assistant. Given a list of images, analyze the images and its relevance to the user's article. Return the most relevant image if there is one, otherwise return an empty string",
      messages: [
        {
          role: "user",
          content: `Here is the contect of the article: ${textContent}`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze these images in the context of: " + message,
            },
            {
              type: "image_url",
              imageUrl:
                "https://tripfixers.com/wp-content/uploads/2019/11/eiffel-tower-with-snow.jpeg",
            },
          ],
        },
      ],
    });

    return NextResponse.json({
      success: true,
      data: result,
      interpretedAction: action,
      message,
    });
  } catch (error) {
    console.error("Scraping error:", error);
    return NextResponse.json(
      { error: "Failed to process scraping request" },
      { status: 500 }
    );
  }
}

function cleanHtml(_htmlString: string) {
  const htmlString = _htmlString
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags and contents
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "") // Remove style tags and contents
    .replace(/<link\s+[^>]*>/gi, "") // Remove link tags
    .replace(/<meta\s+[^>]*>/gi, "") // Remove meta tags
    .replace(/<!--[\s\S]*?-->/g, "") // Remove comments
    .replace(/\s(class|onclick|style|rel|target|data-\w+)=["'].*?["']/gi, "") // Remove common non-data attributes
    .replace(/\s\w+=""/g, "") // Remove empty attributes
    .replace(/\s+/g, " ") // Remove extra whitespace
    .trim(); // Trim leading and trailing whitespace

  return htmlString;
}
