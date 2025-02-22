"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Building2, Clock, Mail, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import SectionHeader from "../section-header";
import SectionContainer from "../section-container";

const formSchema = z.object({
  firstName: z.string().min(2).max(255),
  lastName: z.string().min(2).max(255),
  email: z.string().email(),
  subject: z.string().min(2).max(255),
  message: z.string(),
});

export const ContactSection = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      subject: "Web Development",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { firstName, lastName, email, subject, message } = values;
    console.log(values);

    const mailToLink = `mailto:leomirandadev@gmail.com?subject=${subject}&body=Hello I am ${firstName} ${lastName}, my Email is ${email}. %0D%0A${message}`;

    window.location.href = mailToLink;
  }

  return (
    <SectionContainer id="contact">
      <SectionHeader
        subTitle="Contact"
        title="Get Connect With Us access"
        description=" Stay in touch with us for updates, support, and valuable insights.
          We’re here to help you every step of the way!"
      />
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex flex-col gap-6 *:rounded-lg *:p-6 *:border">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Building2 className="size-5" />
                <div className="font-bold">Location:</div>
              </div>
              <div className="text-muted-foreground">
                123 Maple Lane, Springfield, IL 62704
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3">
                <Phone className="size-5" />
                <div className="font-bold">Call us:</div>
              </div>
              <div className="text-muted-foreground">+1 (555) 987-6543</div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3">
                <Mail className="size-5" />
                <div className="font-bold">Email us:</div>
              </div>
              <div className="text-muted-foreground">
                contact@ourcompany.com
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3">
                <Clock className="size-5" />
                <div className="font-bold">Business Hours:</div>
              </div>
              <div className="text-muted-foreground">
                Tuesday to Saturday, 9 AM - 5 PM
              </div>
            </div>
          </div>
        </div>

        <Card className="bg-muted">
          <CardContent className="pt-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid w-full gap-4"
              >
                <div className="flex flex-col md:!flex-row gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Leopoldo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Miranda" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="contact@bundui.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Web Development">
                              Web Development
                            </SelectItem>
                            <SelectItem value="Mobile Development">
                              Mobile Development
                            </SelectItem>
                            <SelectItem value="Figma Design">
                              Figma Design
                            </SelectItem>
                            <SelectItem value="REST API">REST API</SelectItem>
                            <SelectItem value="FullStack Project">
                              FullStack Project
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={5}
                            placeholder="Your message..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button className="mt-4">Send message</Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter></CardFooter>
        </Card>
      </section>
    </SectionContainer>
  );
};
