import { sponsors } from "@/@data/sponsors";
import { Icon } from "@/components/ui/extras/icon";
import { Marquee } from "@devnomic/marquee";
import { icons } from "lucide-react";

export const SponsorsSection = () => {
  return (
    <section className="pb-12 lg:pb-20">
      <div className="container">
        <Marquee
          className="gap-[3rem] lg:gap-[5rem]"
          fade
          innerClassName="gap-[3rem] lg:gap-[5rem]"
          pauseOnHover
        >
          {sponsors.map(({ icon, name }) => (
            <div
              key={name}
              className="flex items-center text-xl md:text-2xl font-medium"
            >
              <Icon
                name={icon as keyof typeof icons}
                size={28}
                className="mr-3 text-foreground"
              />
              {name}
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};
