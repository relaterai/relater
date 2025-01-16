import { env } from '@/env';
import { withSession } from '@repo/auth/session';
import { stripe } from '@repo/payments';
import { NextResponse } from 'next/server';

export const POST = withSession(async ({ req, session }) => {
  let { plan, period, baseUrl, onboarding } = await req.json();
  console.log('plan', plan, period);
  if (!plan || !period) {
    return new Response("Invalid plan or period", { status: 400 });
  }

  plan = plan.replace(" ", "");

  const prices = await stripe.prices.list({
    lookup_keys: [`${plan}_${period}`],
  });

  console.log('prices', prices);

  const activeSubscription = session.user.stripeId
    ? await stripe.subscriptions
      .list({
        customer: session.user.stripeId,
        status: "active",
      })
      .then((res) => res.data[0])
    : null;

  // if the user has an active subscription, create billing portal to upgrade
  if (session.user?.stripeId && activeSubscription) {
    const { url } = await stripe.billingPortal.sessions.create({
      customer: session.user?.stripeId,
      return_url: baseUrl,
      flow_data: {
        type: "subscription_update_confirm",
        subscription_update_confirm: {
          subscription: activeSubscription.id,
          items: [
            {
              id: activeSubscription.items.data[0].id,
              quantity: 1,
              price: prices.data[0].id,
            },
          ],
        },
      },
    });
    return NextResponse.json({ url });
  } else {
    // const customer = await createCustomer(session.user?.id);
    const customer = await stripe.customers.create({
      email: session.user?.email!,
    });
    // For both new users and users with canceled subscriptions
    const stripeSession = await stripe.checkout.sessions.create({
      ...(session.user?.stripeId
        ? {
          customer: session.user?.stripeId,
          // need to pass this or Stripe will throw an error: https://git.new/kX4fi6B
          customer_update: {
            name: "auto",
            address: "auto",
          },
        }
        : {
          customer_email: session.user?.email!,
        }),
      billing_address_collection: "required",
      success_url: `${env.NEXT_PUBLIC_API_URL}/settings/profile/${session.user?.id}?${onboarding ? "onboarded" : "upgraded"}=true&plan=${plan}&period=${period}`,
      cancel_url: baseUrl,
      line_items: [{ price: prices.data[0].id, quantity: 1 }],
      // automatic_tax: {
      //   enabled: true,
      // },
      tax_id_collection: {
        enabled: true,
      },
      mode: "subscription",
      client_reference_id: session.user?.id,
      metadata: {
        relaterCustomerId: session.user?.id,
      },
    });

    return NextResponse.json(stripeSession);
  }
});