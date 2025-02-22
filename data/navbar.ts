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
    href: "#solutions",
    label: "Solutions",
  },
  {
    href: "#pricing",
    label: "Pricing",
  },
  {
    href: "#team",
    label: "Team",
  },
  {
    href: "#contact",
    label: "Contact",
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
