import { Separator } from "@repo/design-system/components/ui/separator";
import { BillingPicker } from "../components/billing-picker";
import ManageSubscriptionButton from "../components/manage-subscription-button";
export const metadata = {
  title: 'Billing - Relater',
  description: 'Your AI pair creator.',
}

export default function BillingPage() {
  return (
    <>
      <ManageSubscriptionButton />
      <Separator className="my-4" />
      <BillingPicker />
    </>
  );
}
