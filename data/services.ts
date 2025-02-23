export enum ProService {
  YES = 1,
  NO = 0,
}

interface ServiceProps {
  title: string;
  pro: ProService;
  description: string;
}

export const serviceList: ServiceProps[] = [
  {
    title: "Content Analysis",
    description:
      "Smart analysis of your articles to identify key themes and narrative structures.",
    pro: 0,
  },
  {
    title: "Custom Voice Selection",
    description:
      "Choose from a variety of AI voices to match your content's tone and style.",
    pro: 0,
  },
  {
    title: "Multi-Platform Export",
    description:
      "Export your podcasts in multiple formats for different platforms and uses.",
    pro: 0,
  },
  {
    title: "Advanced Video Customization",
    description:
      "Customize video styles and themes to match your brand identity.",
    pro: 1,
  },
  {
    title: "Batch Processing",
    description:
      "Convert multiple articles into podcasts simultaneously for efficient content creation.",
    pro: 1,
  },
  {
    title: "Priority Generation",
    description:
      "Get faster processing times and priority access to new AI features.",
    pro: 1,
  },
];
