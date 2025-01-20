'use client';

import { Button } from "@repo/design-system/components/ui/button";
import { FolderPlus } from "lucide-react";

export const Empty = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <FolderPlus className="h-10 w-10 text-muted-foreground" />
      </div>
      <div className="flex flex-col items-center gap-2 text-center">
        <h3 className="text-lg">Nothing here yet</h3>
      </div>
    </div>
  );
};
