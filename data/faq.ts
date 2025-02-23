interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

export const FAQList: FAQProps[] = [
  {
    question: "How does the article-to-podcast conversion work?",
    answer:
      "Simply paste any article link, and our AI will automatically extract the content, transform it into an engaging narrative, generate audio narration, and create a matching video - all in one seamless process.",
    value: "item-1",
  },
  {
    question: "What types of content can I convert?",
    answer:
      "Our platform works with most web articles, blog posts, and text content. The AI adapts different writing styles into engaging podcast narratives while maintaining the original message.",
    value: "item-2",
  },
  {
    question: "How long does the conversion process take?",
    answer:
      "Most articles are transformed into complete podcast packages (including audio and video) within a few minutes, depending on the content length and current system load.",
    value: "item-3",
  },
  {
    question: "What's the quality of the AI voice narration?",
    answer:
      "We use advanced text-to-speech technology that produces natural-sounding voices. The narration is optimized for clarity and engagement, making it perfect for podcast listening.",
    value: "item-4",
  },
  {
    question: "Can I customize the video output?",
    answer:
      "Currently, videos are automatically generated to match your content's theme. Advanced customization features for video style and branding are coming soon.",
    value: "item-5",
  },
  {
    question: "What formats can I export my podcast in?",
    answer:
      "You receive your podcast as an MP3 audio file, accompanied by a short video perfect for social media sharing. The text is also available for reference and SEO purposes.",
    value: "item-6",
  },
];
