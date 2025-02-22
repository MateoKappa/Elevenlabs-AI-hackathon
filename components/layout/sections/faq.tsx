import { FAQList } from "@/@data/faq";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SectionHeader from "../section-header";
import SectionContainer from "../section-container";

export const FAQSection = () => {
  return (
    <SectionContainer>
      <SectionHeader subTitle="FAQS" title="Common Questions" />
      <div className="max-w-screen-md mx-auto">
        <Accordion type="single" collapsible className="AccordionRoot">
          {FAQList.map(({ question, answer, value }) => (
            <AccordionItem key={value} value={value}>
              <AccordionTrigger className="text-left">
                {question}
              </AccordionTrigger>
              <AccordionContent>{answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </SectionContainer>
  );
};
