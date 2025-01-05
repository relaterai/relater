'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { Switch } from '@repo/design-system/components/ui/switch';
import { env } from '@repo/env';
import { config } from '@repo/payments/striped.config';
import { Check, Minus, MoveRight, } from 'lucide-react';
import Link from 'next/link';
import { Fragment, useState } from 'react';

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex flex-col gap-2">
            <h2 className="max-w-xl text-center font-regular text-3xl tracking-tighter md:text-5xl">
              Prices that make sense!
            </h2>
            <p className="max-w-xl text-center text-lg text-muted-foreground leading-relaxed tracking-tight">
              Just a cup of coffee ☕️ per month.
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Switch
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
              />
              Annual discount
            </div>
          </div>
          <div className="grid w-full grid-cols-3 divide-x pt-20 text-left lg:grid-cols-3">
            <div className="col-span-3 lg:col-span-1" />
            <div className="flex flex-col gap-2 px-3 py-1 md:px-6 md:py-4">
              <p className="text-2xl">{config.products.free.name}</p>
              <p className="text-muted-foreground text-sm">
                Our goal is to streamline SMB trade, making it easier and faster
                than ever for everyone and everywhere.
              </p>
              <p className="mt-8 flex flex-col gap-2 text-xl lg:flex-row lg:items-center">
                <span className="text-4xl">
                  {(config.products.free.prices.monthly.amount / 100).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </span>
                <span className="text-muted-foreground text-sm"> / month</span>
              </p>
              <Button variant="outline" className="mt-8 gap-4" asChild>
                <Link href={env.NEXT_PUBLIC_APP_URL}>
                  Try it <MoveRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="flex flex-col gap-2 px-3 py-1 md:px-6 md:py-4">
              <p className="text-2xl">{config.products.pro.name}</p>
              <p className="text-muted-foreground text-sm">
                Our goal is to streamline SMB trade, making it easier and faster
                than ever for everyone and everywhere.
              </p>
              <p className="mt-8 flex flex-col gap-2 text-xl lg:flex-row lg:items-center">
                <span className="text-4xl">
                  {(isAnnual ? config.products.pro.prices.yearly.amount / (12 * 100)
                    : config.products.pro.prices.monthly.amount / 100).toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })}
                </span>
                <span className="text-muted-foreground text-sm"> / month</span>
              </p>
              <Button className="mt-8 gap-4" asChild>
                <Link href={env.NEXT_PUBLIC_APP_URL}>
                  Try it <MoveRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="col-span-3 px-3 py-4 lg:col-span-1 lg:px-6">
              <b>Features</b>
            </div>
            <div />
            <div />
            {Object.entries(config.features).map(([key, feature]) => (
              <Fragment key={key}>
                <div className="col-span-3 px-3 py-4 lg:col-span-1 lg:px-6">
                  {feature.name}
                </div>
                {Object.entries(config.products).map(([productKey, product]) => (
                  <div key={productKey} className="flex justify-center px-3 py-1 md:px-6 md:py-4">
                    {typeof feature[productKey as keyof typeof feature] === 'boolean' ? feature[productKey as keyof typeof feature] ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <Minus className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <div className="flex justify-center text-muted-foreground">
                        {feature[productKey as keyof typeof feature]}
                      </div>
                    )}
                  </div>
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
