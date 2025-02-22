import FireCrawl from "@mendable/firecrawl-js";
import OpenAI from "openai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { generateObject } from "ai";
import { mistral } from "@ai-sdk/mistral";
import { openai } from "@ai-sdk/openai";

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
      prompt:
        "Extract the content of the news article from the page along with the title and the urls from the images.",
      schema: schema,
    });

    if (!scrapeResult.success) {
      throw new Error(`Failed to scrape: ${scrapeResult.error}`);
    }

    const validImageFormats = ["png", "jpeg", "jpg", "gif", "webp"];
    const imageContent: { type: "image"; image: string }[] =
      scrapeResult.data.images
        .filter((img) => {
          return (
            img &&
            img.startsWith("http") &&
            validImageFormats.some((format) =>
              img.toLowerCase().endsWith(format)
            )
          );
        })
        .map((img) => ({
          type: "image",
          image: img,
        }));

    try {
      const response = await generateObject({
        model: openai("gpt-4o-mini"),
        schema: z.object({
          success: z.boolean(),
          relevant_image: z.string(),
        }),
        system: `You are an image detection assistant. You will receive a list of images with their URLs.
Your task is to:
1. ONLY select from the exact image URLs provided to you
2. Return success: false and relevant_image: "" if no relevant images are found
3. DO NOT generate or modify any URLs - use them exactly as provided`,
        messages: [
          {
            role: "user",
            content: `Here is the article content and context: "${message}"`,
          },
          {
            role: "user",
            content:
              imageContent.length > 0
                ? [
                    {
                      type: "text",
                      text: `Analyze these ${imageContent.length} images and select the most relevant one:`,
                    },
                    ...imageContent,
                  ]
                : [
                    {
                      type: "text",
                      text: "No valid images found.",
                    },
                  ],
          },
        ],
      });

      console.log(response.object);

      // Strict validation
      if (
        !imageContent.some(
          (img) => img.image === response.object.relevant_image
        )
      ) {
        console.log("Invalid image URL returned, forcing false response");
        return NextResponse.json({
          success: false,
          interpretedAction: action,
          message,
        });
      }
    } catch (e) {
      console.log(e);
    }

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
