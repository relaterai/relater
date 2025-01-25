"use client";

import { Button } from "@repo/design-system/components/ui/button";

export function DownloadWidget({ compact = false }: { compact?: boolean }) {
  const handleDownload = () => {
    window.open("https://chromewebstore.google.com/detail/relater-your-ai-pair-crea/lgigglbhjlfanedbldgepjcdfghkaenj", "_blank");
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      {!compact && (
        <Button
          onClick={handleDownload}
          variant="outline"
          className='group flex gap-4 rounded-full p-8'
        >
          <img src="/chrome-icon.svg" alt="Chrome" className='h-10 w-10' />
          <span>Add to Chrome for free</span>
        </Button >
      )}

      {/* <div className='mt-2 flex gap-4'>
        {compact &&
          <Button variant="ghost" className='h-12 rounded-full p-2'>
            <img
              src="/chrome-icon.svg"
              alt="Chrome"
              className='h-8 w-8'
            />
          </Button>
        }
        <Button variant="ghost" className='h-12 rounded-full p-2'>
          <img
            src="/firefox-icon.svg"
            alt="Firefox"
            className='h-8 w-8'
          />
        </Button>
        <Button variant="ghost" className='h-12 rounded-full p-2'>
          <img
            src="/edge-icon.svg"
            alt="Edge"
            className='h-8 w-8'
          />
        </Button>
      </div> */}
    </div>
  );
}
