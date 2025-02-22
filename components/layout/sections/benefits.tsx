import { benefitList } from "@/@data/benefits";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/extras/icon";
import { cn } from "@/lib/utils";
import { icons } from "lucide-react";
import SectionContainer from "../section-container";
import SectionHeader from "../section-header";

export const BenefitsSection = () => {
  return (
    <SectionContainer id="benefits">
      <div className="grid lg:grid-cols-2 lg:gap-24">
        <div>
          <SectionHeader
            className="sticky lg:top-[22rem] text-center lg:text-start max-w-full"
            subTitle="Benefits"
            title="What Do We Bring to You?"
            description="All the innovative solutions you need to grow your business are
              here! We add value to your business with our features that
              simplify your workflow, increase efficiency and strengthen your
              decisions."
          />
        </div>

        <div className="flex flex-col gap-6 lg:gap-[14rem] w-full ">
          {benefitList.map(({ icon, title, description }, index) => (
            <Card
              key={title}
              className={cn(
                "group/number lg:sticky shadow-none border bg-muted"
              )}
              style={{ top: `${20 + index + 2}rem` }}
            >
              <CardHeader>
                <div className="flex justify-between">
                  <Icon
                    name={icon as keyof typeof icons}
                    size={40}
                    color="hsl(var(--primary))"
                    className="mb-6 text-primary bg-primary/20 p-2 rounded-full ring-8 ring-primary/10"
                  />
                  <span className="text-5xl text-muted-foreground/15 font-medium transition-all delay-75 group-hover/number:text-muted-foreground/30">
                    0{index + 1}
                  </span>
                </div>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                {description}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};
