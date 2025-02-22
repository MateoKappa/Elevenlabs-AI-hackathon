import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SectionHeader from "../section-header";
import SectionContainer from "../section-container";

export function NewsletterSection() {
  return (
    <SectionContainer>
      <SectionHeader
        title={
          <>
            Join Our Daily{" "}
            <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
              Newsletter
            </span>
          </>
        }
        description="Subscribe to receive the latest updates, insights, and exclusive
            offers directly to your inbox."
      />
      <form className="flex flex-col w-full md:flex-row md:w-6/12 lg:w-4/12 mx-auto gap-4 md:gap-2">
        <Input
          placeholder="contact@bundui.com"
          className="bg-muted/50 dark:bg-muted/80 "
          aria-label="email"
        />
        <Button>Subscribe</Button>
      </form>
    </SectionContainer>
  );
}
