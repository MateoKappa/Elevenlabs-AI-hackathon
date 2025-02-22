import { MediaListItemType } from "@/types";

import { Check, CheckCheck, CircleCheck } from "lucide-react";

export default function MediaListItem({ type }: MediaListItemType) {
  switch (type) {
    case "image":
      return <CircleCheck className="h-4 w-4 text-green-500" />;
    case "pdf_file":
      return <CheckCheck className="h-4 w-4 text-muted-foreground" />;
    case "text_file":
      return <Check className="h-4 w-4 text-muted-foreground" />;
    default:
      break;
  }
}
