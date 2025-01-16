"use client";

import { Button, type ButtonProps } from "@repo/design-system/components/ui/button";
import { cn } from "@repo/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ManageSubscriptionButton(props: ButtonProps) {
  const [clicked, setClicked] = useState(false);
  const router = useRouter();

  return (
    <Button
      {...props}
      variant={props.variant || "secondary"}
      className={cn(props.className, "h-9")}
      onClick={() => {
        setClicked(true);
        fetch(`/api/billing/manage`, {
          method: "POST",
        }).then(async (res) => {
          if (res.ok) {
            const url = await res.json();
            // console.log({ url });
            router.push(url);
          } else {
            const { error } = await res.json();
            toast.error(error.message);
            setClicked(false);
          }
        });
      }}
    >
      Manage Subscription
    </Button>
  );
}