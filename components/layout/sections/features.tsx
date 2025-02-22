import { featureList } from "@/@data/features";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/extras/icon";
import { icons } from "lucide-react";
import SectionHeader from "../section-header";
import SectionContainer from "../section-container";

export const FeaturesSection = () => {
  return (
    <SectionContainer id="features">
      <SectionHeader
        subTitle="Features"
        title="What Makes Us Different"
        description="Unleash the power of our innovative features designed to streamline
          your workflow, enhance decision-making, and drive business growth."
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {featureList.map(({ icon, title, description }) => (
          <div key={title}>
            <Card className="h-full bg-background border-0 shadow-none text-center">
              <CardHeader className="flex justify-center items-center">
                <div className="bg-primary/20 p-2 rounded-full ring-8 ring-primary/10 mb-4">
                  <Icon
                    name={icon as keyof typeof icons}
                    size={24}
                    color="hsl(var(--primary))"
                    className="text-primary"
                  />
                </div>
                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground">
                {description}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
};
