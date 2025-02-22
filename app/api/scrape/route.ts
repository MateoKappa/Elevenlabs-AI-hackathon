import FireCrawl from "@mendable/firecrawl-js";
import OpenAI from "openai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { generateObject } from "ai";
import { mistral } from "@ai-sdk/mistral";
import * as htmlToText from "html-to-text";
import { load } from "cheerio";
import { ScrapeResponse } from "@mendable/firecrawl-js";
import { openai } from "@ai-sdk/openai";

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
        extension:
          $(element).attr("src")?.split(".").pop()?.toLowerCase() || "",
      }))
      .get();

    const validImageFormats = ["png", "jpeg", "jpg", "gif", "webp"];
    const imageContent: { type: "image"; image: string }[] = images
      .filter(
        (
          img
        ): img is {
          url: string;
          alt: string;
          width: string | undefined;
          height: string | undefined;
          extension: string;
        } => {
          console.log(img.extension, "extension22");
          if (typeof img.url !== "string" || img.url.trim() === "")
            return false;
          const extension = img.url.split(".").pop()?.toLowerCase() || "";
          return validImageFormats.some((format) => extension.includes(format));
        }
      )
      .map((img) => ({
        type: "image",
        image: img.url,
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
      model: openai("gpt-4o-mini"),
      schema: z.object({
        success: z.boolean(),
        relevant_image: z.string(),
        description: z.string(),
      }),
      system: `You are an image detection assistant. You will receive a list of images with their URLs.
Your task is to:
1. ONLY select from the exact image URLs provided to you
2. Return success: false and relevant_image: "" if no relevant images are found
3. DO NOT generate or modify any URLs - use them exactly as provided
4. Return one big description that talks about the images that you saw`,
      messages: [
        {
          role: "user",
          content: `Here is the content of the article: ${textContent}`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze these ${imageContent.length} images in the context of: ${message}`,
            },
            ...imageContent,
          ],
        },
      ],
    });

    console.log("Model response:", response.object); // Debug log

    // Strict validation
    if (
      !imageContent.some((img) => img.image === response.object.relevant_image)
    ) {
      console.log("Invalid image URL returned, forcing false response");
      return NextResponse.json({
        success: false,
        data: {
          ...result,
          relevant_image: "",
        },
        interpretedAction: action,
        message,
      });
    }

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
