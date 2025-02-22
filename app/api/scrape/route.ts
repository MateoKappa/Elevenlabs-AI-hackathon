import FireCrawl from "@mendable/firecrawl-js";
import OpenAI from "openai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { generateObject } from "ai";
import { mistral } from "@ai-sdk/mistral";
import * as htmlToText from "html-to-text";
import { load } from "cheerio";
import type { ScrapeResponse } from "@mendable/firecrawl-js";

// Initialize FireCrawl
const firecrawl = new FireCrawl({
  apiKey: process.env.FIRECRAWL_API_KEY,
});

const schema = z.object({
  content: z.string(),
  title: z.string(),
  images: z.array(z.string()),
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

    const scrapeResult = await firecrawl.extract([url], {
      prompt: "Extract the content of the news article from the page along with the title and the urls from the images.",
      schema: schema
    });
    
    if (!scrapeResult.success) {
      throw new Error(`Failed to scrape: ${scrapeResult.error}`)
    }
    
    console.log(scrapeResult.data);

    // const result = (await firecrawl.scrapeUrl(url, {
    //   formats: ["html"],
    // })) as ScrapeResponse;

    // if (result.error || !result.html) {
    //   console.log(result);
    //   throw new Error("failed");
    // }

    // const loadableBody = result.html.replace(/>\s*</g, "> <");
    // const $ = load(loadableBody);
    // const body = cleanHtml($("body").prop("outerHTML") || "");

    // const textContent = htmlToText.convert(body, {
    //   selectors: [
    //     { selector: "img", format: "skip" },
    //     {
    //       selector: "a",
    //       options: { baseUrl: url },
    //     },
    //   ],
    // });

    return NextResponse.json({
      success: true,
      data: scrapeResult.data,
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
