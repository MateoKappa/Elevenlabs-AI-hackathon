interface RouteProps {
  href: string;
  label: string;
}

interface ProductProps {
  title: string;
  icon: string;
  description: string;
}

export const routeList: RouteProps[] = [
  {
    href: "/chats",
    label: "Chats",
  },
  {
    href: "#team",
    label: "Team",
  },
];

export const productList: ProductProps[] = [
  {
    title: "LaunchPad",
    icon: "Frame",
    description: "Launch high-impact pages effortlessly.",
  },
  {
    title: "Orbit Analytics",
    icon: "ChartScatter",
    description: "Powerful insights for smarter decisions.",
  },
  {
    title: "Nova Integrator",
    icon: "Blocks",
    description: "Seamless connections with your favorite tools.",
  },
];
