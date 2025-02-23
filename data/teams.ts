interface TeamProps {
  imageUrl: string;
  firstName: string;
  lastName: string;
  positions: string[];
  socialNetworks: SocialNetworkProps[];
}

interface SocialNetworkProps {
  name: string;
  url: string;
}

export const teamList: TeamProps[] = [
  {
    imageUrl: "/mateo.png",
    firstName: "Mateo",
    lastName: "Kapllani",
    positions: ["Full Stack Engineer"],
    socialNetworks: [
      {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/mateo-kapllani-284036228/",
      },
      {
        name: "Github",
        url: "  https://github.com/MateoKappa",
      },
    ],
  },
  {
    imageUrl:
      "/panagiotis.webp",
    firstName: "Panagiotis",
    lastName: "Apostolidis",
    positions: ["Full Stack Engineer"],
    socialNetworks: [
      {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/apostolidispanagiotis/",
      },
      {
        name: "Github",
        url: "https://github.com/apostgit",
      },
    ],
  },
];
