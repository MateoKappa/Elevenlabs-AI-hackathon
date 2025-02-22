export enum PopularPlan {
  NO = 0,
  YES = 1,
}

interface PlanProps {
  title: string;
  popular: PopularPlan;
  price: number;
  description: string;
  buttonText: string;
  benefitList: string[];
}

export const plans: PlanProps[] = [
  {
    title: "Free",
    popular: 0,
    price: 0,
    description:
      "Lorem ipsum dolor sit, amet ipsum consectetur adipisicing elit.",
    buttonText: "Start Free Trial",
    benefitList: [
      "1 team member",
      "1 GB storage",
      "Upto 2 pages",
      "Community support",
      "AI assistance",
    ],
  },
  {
    title: "Premium",
    popular: 1,
    price: 49,
    description:
      "Lorem ipsum dolor sit, amet ipsum consectetur adipisicing elit.",
    buttonText: "Get starterd",
    benefitList: [
      "4 team member",
      "8 GB storage",
      "Upto 6 pages",
      "Priority support",
      "AI assistance",
    ],
  },
  {
    title: "Enterprise",
    popular: 0,
    price: 139,
    description:
      "Lorem ipsum dolor sit, amet ipsum consectetur adipisicing elit.",
    buttonText: "Contact US",
    benefitList: [
      "10 team member",
      "20 GB storage",
      "Upto 10 pages",
      "Phone & email support",
      "AI assistance",
    ],
  },
];
