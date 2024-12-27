"use client";

import { Button } from "@repo/design-system/components/ui/button";

export function DownloadWidget({ compact = false }: { compact?: boolean }) {
  const handleDownload = () => {
    window.open("https://chrome.google.com/webstore", "_blank");
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      {!compact && (
        <Button
          onClick={handleDownload}
          variant="outline"
          className="p-8 flex gap-4 rounded-full group"
        >
          <img src="/chrome-icon.svg" alt="Chrome" className="w-10 h-10" />
          <span>Add to Chrome for free</span>
        </Button >
      )}

      <div className="flex gap-4 mt-2">
        {compact &&
          <Button variant="ghost" className="p-2 h-12 rounded-full">
            <img
              src="/chrome-icon.svg"
              alt="Chrome"
              className="w-8 h-8"
            />
          </Button>
        }
        <Button variant="ghost" className="p-2 h-12 rounded-full">
          <img
            src="/firefox-icon.svg"
            alt="Firefox"
            className="w-8 h-8"
          />
        </Button>
        <Button variant="ghost" className="p-2 h-12 rounded-full">
          <img
            src="/edge-icon.svg"
            alt="Edge"
            className="w-8 h-8"
          />
        </Button>
      </div>
    </div>
  );
}
