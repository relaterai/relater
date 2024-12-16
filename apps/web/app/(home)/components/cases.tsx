'use client';

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@repo/design-system/components/ui/carousel';
import AuthjsLogo from '@repo/design-system/logos/authjs.webp';
import NextLogo from '@repo/design-system/logos/nextjs.svg';
import PostgresLogo from '@repo/design-system/logos/postgres.svg';
import PrismaLogo from '@repo/design-system/logos/prisma.svg';
import ReactEmailLogo from '@repo/design-system/logos/react-email.webp';
import ShadcnLogo from '@repo/design-system/logos/shadcn.png';
import StripeLogo from '@repo/design-system/logos/stripe.svg';
import VercelLogo from '@repo/design-system/logos/vercel.svg';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const OpenSourceCarouselItems = [
  {
    title: 'Next.js',
    logo: NextLogo,
    href: 'https://nextjs.org/',
  },
  {
    title: 'Prisma',
    logo: PrismaLogo,
    href: 'https://prisma.io/',
  },
  {
    title: 'React Email',
    logo: ReactEmailLogo,
    href: 'https://react.email/',
  },
  {
    title: 'Postgres',
    logo: PostgresLogo,
    href: 'https://www.postgresql.org/',
  },
  {
    title: 'Vercel',
    logo: VercelLogo,
    href: 'https://vercel.com/',
  },
  {
    title: 'Auth.js',
    logo: AuthjsLogo,
    href: 'https://authjs.dev/',
  },
  {
    title: 'Shadcn',
    logo: ShadcnLogo,
    href: 'https://ui.shadcn.com/',
  },
  {
    title: 'Stripe',
    logo: StripeLogo,
    href: 'https://stripe.com/',
  },
];

export const Cases = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setTimeout(() => {
      if (api.selectedScrollSnap() + 1 === api.scrollSnapList().length) {
        setCurrent(0);
        api.scrollTo(0);
      } else {
        api.scrollNext();
        setCurrent(current + 1);
      }
    }, 2000);
  }, [api, current]);

  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex flex-col gap-10">
          <h2 className="text-left font-regular text-xl tracking-tighter md:text-5xl lg:max-w-xl">
            Open-source built, open-source given, and free.
          </h2>
          <Carousel setApi={setApi} className="w-full">
            <CarouselContent>
              {OpenSourceCarouselItems.map((item, index) => (
                <CarouselItem className="basis-1/6 lg:basis-1/6" key={index}>
                  <div className="flex aspect-square items-center justify-center rounded-md bg-muted p-6">
                    <Image
                      src={item.logo}
                      alt={item.title}
                      width={24}
                      height={24}
                    />
                    <span className="text-sm font-medium ml-2">
                      {item.title}
                    </span>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
};
