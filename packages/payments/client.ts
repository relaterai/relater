// Stripe Client SDK
import { type Stripe as StripeProps, loadStripe } from "@stripe/stripe-js";
import { keys } from "./keys";

const { NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE } = keys();

let stripePromise: Promise<StripeProps | null>;

console.log('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE', NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE);
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE ??
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ??
      "",
    );
  }

  return stripePromise;
};