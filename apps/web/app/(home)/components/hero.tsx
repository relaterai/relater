import { DownloadWidget } from '@repo/design-system/components/download-widget';
import { Button } from '@repo/design-system/components/ui/button';
import { allPosts } from 'content-collections';
import { MoveRight, } from 'lucide-react';
import Link from 'next/link';

export const Hero = () => (
  <div className="w-full">
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center gap-8 py-20 lg:py-40">
        <div>
          <Button variant="secondary" size="sm" className="gap-4" asChild>
            <Link href={`/blog/${allPosts[0]._meta.path}`}>
              Read our latest article <MoveRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="max-w-2xl text-center font-regular text-5xl tracking-tighter md:text-7xl">
            Capture faster, review later.
          </h1>
          <p className="max-w-2xl text-center text-lg text-muted-foreground leading-relaxed tracking-tight md:text-xl">
            Relater is an open-source AI tool that helps shape your way of
            thinking by capturing and reviewing content from anywhere.
          </p>
        </div>
        <div className="flex flex-row gap-3">
          {/* <Button size="lg" className="gap-4" variant="outline" asChild>
            <Link href="/contact">
              Get in touch <PhoneCall className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" className="gap-4" asChild>
            <Link href={env.NEXT_PUBLIC_APP_URL}>
              Sign up <MoveRight className="h-4 w-4" />
            </Link>
          </Button> */}
          <DownloadWidget />
        </div>
      </div>
    </div>
  </div>
);
