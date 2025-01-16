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
      <BillingPicker />
    </>
  );
}
