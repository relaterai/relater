import { User } from 'lucide-react';

export const Features = () => (
  <div className="w-full py-20 lg:py-40">
    <div className="container mx-auto">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col items-start gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="max-w-xl text-left font-regular text-3xl tracking-tighter md:text-5xl">
              Something new!
            </h2>
            <p className="max-w-xl text-left text-lg text-muted-foreground leading-relaxed tracking-tight lg:max-w-lg">
              Your creative journey starts here.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex aspect-square h-full flex-col justify-between rounded-md bg-muted p-6 lg:col-span-2 lg:aspect-auto">
            <User className="h-8 w-8 stroke-1" />
            <div className="flex flex-col">
              <h3 className="text-xl tracking-tight">Collect everything in one place, naturally.</h3>
              <p className="max-w-xs text-base text-muted-foreground">
                While you browse webpages, watch YouTube videos, listen to podcasts, or upload PDFs and images,
                Later helps you understand the content and save what matters most to you.
              </p>
            </div>
          </div>
          <div className="flex aspect-square flex-col justify-between rounded-md bg-muted p-6">
            <User className="h-8 w-8 stroke-1" />
            <div className="flex flex-col">
              <h3 className="text-xl tracking-tight">AI-powered multi-level tags</h3>
              <p className="max-w-xs text-base text-muted-foreground">
                Later supports an intuitive #tag/subtag syntax,
                making it effortless to organize and navigate through your content with a hierarchical tagging system.
              </p>
            </div>
          </div>

          <div className="flex aspect-square flex-col justify-between rounded-md bg-muted p-6">
            <User className="h-8 w-8 stroke-1" />
            <div className="flex flex-col">
              <h3 className="text-xl tracking-tight">Privacy-first, always.</h3>
              <p className="max-w-xs text-base text-muted-foreground">
                Later is your private ideas hub. We put privacy first. We will never sell your private info
                to any third party for profit. Your subscription will encourage us to do better.
              </p>
            </div>
          </div>
          <div className="flex aspect-square h-full flex-col justify-between rounded-md bg-muted p-6 lg:col-span-2 lg:aspect-auto">
            <User className="h-8 w-8 stroke-1" />
            <div className="flex flex-col">
              <h3 className="text-xl tracking-tight">AI-powered vector search and smart tagging</h3>
              <p className="max-w-xs text-base text-muted-foreground">
                Quickly find what you need with smart search that understands your content,
                plus easy tag filtering to keep everything organized
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
