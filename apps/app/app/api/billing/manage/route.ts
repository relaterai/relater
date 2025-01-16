import { env } from "@/env";
import { withSession } from "@repo/auth/session";
import { LaterApiError } from "@repo/error";
import { stripe } from "@repo/payments";
import { NextResponse } from "next/server";

// POST /api/settings/billing/manage - create a Stripe billing portal session
export const POST = withSession(async ({ session }) => {
  if (!session.user.stripeId) {
    return new Response("No Stripe customer ID", { status: 400 });
  }
  try {
    const { url } = await stripe.billingPortal.sessions.create({
      customer: session.user.stripeId,
      return_url: `${env.NEXT_PUBLIC_APP_URL}/settings/billing`,
    });
    return NextResponse.json(url);
  } catch (error) {
    throw new LaterApiError({
      code: "bad_request",
      // @ts-ignore
      message: error.raw.message,
    });
  }
});