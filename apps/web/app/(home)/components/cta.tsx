import { env } from '@/env';
import { Button } from '@repo/design-system/components/ui/button';
import { GITHUB_URL } from '@repo/utils';
import { Icons } from '@repo/utils/constants/icon';
import { MoveRight } from 'lucide-react';
import Link from 'next/link';

export const CTA = () => (
  <div className="w-full py-20 lg:py-40">
    <div className="container mx-auto">
      <div className="flex flex-col items-center gap-8 rounded-md bg-muted p-4 text-center lg:p-14">
        <div className="flex flex-col gap-2">
          <h3 className="max-w-xl font-regular text-3xl tracking-tighter md:text-5xl">
            Get started with Relater
          </h3>
          <p className="max-w-xl text-lg text-muted-foreground leading-relaxed tracking-tight">
            Relater is an open-source AI tool that helps shape your way of thinking by capturing and reviewing content from anywhere.
          </p>
        </div>
        <div className="flex flex-row gap-4">
          <Button className="gap-4" variant="outline" asChild>
            <Link href={GITHUB_URL}>
              Self-host <Icons.gitHub className="h-8 w-8" />
            </Link>
          </Button>
          <Button className="gap-4" asChild>
            <Link href={env.NEXT_PUBLIC_APP_URL}>
              Try for free <MoveRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  </div>
);
