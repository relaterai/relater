'use client';

import { env } from "@/env";
import { Button } from "@repo/design-system/components/ui/button";
import { Card } from "@repo/design-system/components/ui/card";
import { Switch } from "@repo/design-system/components/ui/switch";
import { cn } from "@repo/design-system/lib/utils";
import { getStripe } from "@repo/payments/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { config as stripeConfig } from "@repo/payments/striped.config";

interface BillingPickerProps {
  currentPlan?: string;
}

export function BillingPicker({ currentPlan }: BillingPickerProps) {
  const router = useRouter();
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end space-x-2">
        <span className='text-muted-foreground text-sm'>Annual discount</span>
        <Switch
          checked={isAnnual}
          onCheckedChange={setIsAnnual}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <div className='flex h-full flex-col'>
            <div>
              <h3 className='font-medium text-lg'>Starter</h3>
              <div className='mt-2 font-bold text-3xl'>Free</div>
              <p className='text-muted-foreground text-sm'>Forever</p>
            </div>

            <div className="mt-6">
              <p className='font-medium text-sm'>Features:</p>
              <ul className='mt-2 space-y-2 text-muted-foreground text-sm'>
                {Object.entries(stripeConfig.features)
                  .filter(([_, feature]) => feature.free)
                  .map(([key, feature]) => (
                    <li key={key}>• {feature.name}{feature.free !== true ? ` (${feature.free})` : ''}</li>
                  ))}
              </ul>
            </div>

            <div className="mt-auto pt-6">
              {currentPlan === 'pro' ? (
                <Button
                  variant="outline"
                  className="w-full"
                >
                  Cancel subscription
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={currentPlan !== "pro"}
                >
                  Current plan
                </Button>
              )}
            </div>
          </div>
        </Card>

        <Card className='bg-primary/5 p-6'>
          <div className='flex h-full flex-col'>
            <div>
              <div className="flex items-center">
                <h3 className='font-medium text-lg'>Pro</h3>
                <span className={cn("ml-2 rounded-full bg-green-500/10 px-2 py-1 text-xs", isAnnual ? "bg-green-500/10 text-green-500" : "bg-primary/10 text-muted-foreground")}>50% off</span>
              </div>
              <div className="mt-2 flex items-baseline">
                <span className='font-bold text-3xl'>${isAnnual ? (stripeConfig.products.pro.prices.yearly.amount / 100 / 12).toFixed(2) : stripeConfig.products.pro.prices.monthly.amount / 100}</span>
                <span className='text-muted-foreground text-sm'>/month</span>
              </div>
              <p className='text-muted-foreground text-sm'>
                {isAnnual ? `Billed annually at $${stripeConfig.products.pro.prices.yearly.amount / 100}` : 'Annual discount available'}
              </p>
            </div>

            <div className="mt-6">
              <p className='font-medium text-sm'>Everything in Free, plus:</p>
              <ul className='mt-2 space-y-2 text-muted-foreground text-sm'>
                {Object.entries(stripeConfig.features)
                  .filter(([_, feature]) => feature.pro && !feature.free)
                  .map(([key, feature]) => (
                    <li key={key}>• {feature.name}{feature.pro !== true ? ` (${feature.pro})` : ''}</li>
                  ))}
              </ul>
            </div>

            <div className="mt-auto pt-6">
              <Button
                className={cn(
                  "w-full",
                  currentPlan === 'pro' && "bg-muted text-muted-foreground hover:bg-muted hover:text-muted-foreground"
                )}
                disabled={currentPlan === 'pro'}
                onClick={() => {
                  // setClicked(true);
                  fetch(`/api/billing/upgrade`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      plan: 'pro',
                      period: isAnnual ? "yearly" : "monthly",
                      baseUrl: `${env.NEXT_PUBLIC_API_URL}/settings/billing`,
                      onboarding: false,
                    }),
                  })
                    .then(async (res) => {
                      if (currentPlan === "free") {
                        const data = await res.json();
                        const { id: sessionId } = data;
                        const stripe = await getStripe();
                        stripe?.redirectToCheckout({ sessionId });
                      } else {
                        const { url } = await res.json();
                        router.push(url);
                      }
                    })
                    .catch((err) => {
                      alert(err);
                    })
                    .finally(() => {
                      // setClicked(false);
                    });
                }}
              >
                {currentPlan === 'pro' ? 'Current plan' : 'Upgrade →'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
