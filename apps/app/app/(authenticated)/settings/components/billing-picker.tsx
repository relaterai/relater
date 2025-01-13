'use client';

import { Button } from "@repo/design-system/components/ui/button";
import { Card } from "@repo/design-system/components/ui/card";
import { cn } from "@repo/design-system/lib/utils";
import { Switch } from "@repo/design-system/components/ui/switch";
import { useState } from "react";

interface BillingPickerProps {
  currentPlan?: string;
}

export function BillingPicker({ currentPlan }: BillingPickerProps) {
  const [isAnnual, setIsAnnual] = useState(true);
  const monthlyPrice = 9.99;
  const annualPrice = monthlyPrice * 12 * 0.5;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end space-x-2">
        <span className="text-sm text-muted-foreground">Annual discount</span>
        <Switch
          checked={isAnnual}
          onCheckedChange={setIsAnnual}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex flex-col h-full">
            <div>
              <h3 className="text-lg font-medium">Starter</h3>
              <div className="mt-2 text-3xl font-bold">Free</div>
              <p className="text-sm text-muted-foreground">Forever</p>
            </div>

            <div className="mt-6">
              <p className="text-sm font-medium">Features:</p>
              <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                <li>• AI Tag System</li>
                <li>• Heat Map</li>
                <li>• All platforms sync</li>
                <li>• Unlimited Text</li>
                <li>• 500MB Storage</li>
                <li>• Export</li>
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

        <Card className="p-6 bg-primary/5">
          <div className="flex flex-col h-full">
            <div>
              <div className="flex items-center">
                <h3 className="text-lg font-medium">Pro</h3>
                <span className={cn("ml-2 rounded-full bg-green-500/10 px-2 py-1 text-xs", isAnnual ? "bg-green-500/10 text-green-500" : "bg-primary/10 text-muted-foreground")}>50% off</span>
              </div>
              <div className="mt-2 flex items-baseline">
                <span className="text-3xl font-bold">${isAnnual ? 4.99 : 9.99}</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {isAnnual ? `Billed annually at $${annualPrice.toFixed(2)}` : 'Annual discount available'}
              </p>
            </div>

            <div className="mt-6">
              <p className="text-sm font-medium">Everything in Free, plus:</p>
              <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                <li>• 10GB Storage</li>
                <li>• Uncompressed Image</li>
                <li>• Tag Icon</li>
                <li>• API Access</li>
                <li>• Vector Search</li>
              </ul>
            </div>

            <div className="mt-auto pt-6">
              <Button
                className={cn(
                  "w-full",
                  currentPlan === 'pro' && "bg-muted text-muted-foreground hover:bg-muted hover:text-muted-foreground"
                )}
                disabled={currentPlan === 'pro'}
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
