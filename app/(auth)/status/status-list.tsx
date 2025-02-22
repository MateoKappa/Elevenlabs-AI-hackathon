"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import StatusListItem from "./status-list-item";
import { SelectedStatusContextType, StatusItemProps } from "@/types";
import { useContext } from "react";
import { SelectedStatusContext } from "@/components/contexts";

export default function StatusList({
  updates,
}: {
  updates: StatusItemProps[];
}) {
  const { selectedStatus } = useContext(
    SelectedStatusContext
  ) as SelectedStatusContextType;

  return (
    <>
      <div className="h-[calc(100vh_-_9rem)] lg:h-[calc(100vh_-_15.8rem)] flex lg:pt-4">
        <ScrollArea className="w-full">
          <div className="divide-y">
            {updates.map((status: StatusItemProps) => (
              <StatusListItem
                status={status}
                key={status.id}
                active={selectedStatus && selectedStatus.id === status.id}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
