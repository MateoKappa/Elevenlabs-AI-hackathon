import React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "./ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { PlusIcon } from "lucide-react";
import { Input } from "./ui/input";

export function SettingsDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl">Settings</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="space-y-4 py-5">
            {[
              {
                label: "Allow connected contacts",
                defaultChecked: true,
              },
              {
                label: "Confirm message requests",
                defaultChecked: true,
              },
              {
                label: "Profile privacy",
                defaultChecked: false,
              },
              {
                label: "Two-step security verification",
                defaultChecked: true,
              },
            ].map((item, key) => (
              <div className="flex items-center space-x-2" key={key}>
                <Checkbox
                  id={`account_check${key}`}
                  defaultChecked={item.defaultChecked}
                />
                <label
                  htmlFor={`account_check${key}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none"
                >
                  {item.label}
                </label>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="notifications" className="space-y-4 py-5">
            {[
              {
                label: "Allow mobile notifications",
                defaultChecked: true,
              },
              {
                label: "Notifications from your contact",
                defaultChecked: true,
              },
              {
                label: "Send notifications by email",
                defaultChecked: false,
              },
            ].map((item, key) => (
              <div className="flex items-center space-x-2" key={key}>
                <Checkbox
                  id={`account_check${key}`}
                  defaultChecked={item.defaultChecked}
                />
                <label
                  htmlFor={`account_check${key}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none"
                >
                  {item.label}
                </label>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="security" className="space-y-4 py-5">
            {[
              {
                label: "Suggest changing passwords every month.",
                defaultChecked: false,
              },
              {
                label: "Let me know about suspicious entries to your account",
                defaultChecked: true,
              },
            ].map((item, key) => (
              <div className="flex items-center space-x-2" key={key}>
                <Checkbox
                  id={`account_check${key}`}
                  defaultChecked={item.defaultChecked}
                />
                <label
                  htmlFor={`account_check${key}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none"
                >
                  {item.label}
                </label>
              </div>
            ))}
            <div className="pt-2">
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button className="gap-2 w-full" variant="outline">
                    <PlusIcon className="w-4 h-4" /> Security Questions
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="flex flex-col gap-4 mt-4">
                  <Input placeholder="Question 1" />
                  <Input placeholder="Question 2" />
                </CollapsibleContent>
              </Collapsible>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
