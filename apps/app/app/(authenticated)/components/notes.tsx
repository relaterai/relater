'use client';

import { useEffect, useState } from "react";
import { useSnapshots } from "@/swr/use-snapshots";
import { useInView } from "react-intersection-observer";
import { Button } from "@repo/design-system/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { openDB } from 'idb';

const Notes = ({ tag }: { tag?: string[] }) => {
  const [page, setPage] = useState(1);
  const [allSnapshots, setAllSnapshots] = useState<any[]>([]);
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});
  const { snapshots = [], isLoading } = useSnapshots({
    pageSize: 10,
    page,
    tagName: tag?.join('/'),
  });

  const router = useRouter();
  const { ref, inView } = useInView();

  useEffect(() => {
    const initDB = async () => {
      const db = await openDB('images-db', 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('images')) {
            db.createObjectStore('images');
          }
        },
      });
      return db;
    };
    initDB();
  }, []);

  const saveImageToIndexedDB = async (url: string, id: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const db = await openDB('images-db', 1);
      await db.put('images', blob, id);
      const objectUrl = URL.createObjectURL(blob);
      setImageUrls(prev => ({ ...prev, [id]: objectUrl }));
    } catch (error) {
      console.error('Error saving image to IndexedDB:', error);
    }
  };

  const getImageFromIndexedDB = async (id: string) => {
    try {
      const db = await openDB('images-db', 1);
      const blob = await db.get('images', id);
      if (blob) {
        const objectUrl = URL.createObjectURL(blob);
        setImageUrls(prev => ({ ...prev, [id]: objectUrl }));
        return objectUrl;
      }
      return null;
    } catch (error) {
      console.error('Error getting image from IndexedDB:', error);
      return null;
    }
  };

  const loadImages = async (snapshots: any[]) => {
    for (const snapshot of snapshots) {
      const cachedImage = await getImageFromIndexedDB(snapshot.id);
      if (!cachedImage && snapshot.screenshotFileKey) {
        await saveImageToIndexedDB(snapshot.screenshotFileKey, snapshot.id);
      }
    }
  };

  useEffect(() => {
    if (snapshots.length > 0) {
      setAllSnapshots(prev => {
        const newSnapshots = snapshots.filter(
          snapshot => !prev.some(p => p.id === snapshot.id)
        );

        if (newSnapshots.length > 0) {
          loadImages(newSnapshots);
          return [...prev, ...newSnapshots];
        }
        return prev;
      });
    }
  }, [snapshots]);

  useEffect(() => {
    const shouldLoadMore = inView && !isLoading && snapshots.length > 0;
    if (shouldLoadMore) {
      setPage(prev => prev + 1);
    }
  }, [inView, isLoading, snapshots.length]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 grid-cols-1">
        {allSnapshots.map((snapshot, index) => (
          <div
            key={snapshot.id}
            ref={index === allSnapshots.length - 1 ? ref : undefined}
            className="rounded-xl bg-muted/50 overflow-hidden cursor-pointer hover:bg-muted/70 hover:shadow-sm transition-all duration-300"
            onClick={() => router.push(`/note/${snapshot.id}`)}
          >
            <div className="flex flex-col">
              <div className="relative w-full pt-[56.25%]">
                {imageUrls[snapshot.id] && <img
                  src={imageUrls[snapshot.id]}
                  alt={snapshot.title}
                  className="absolute top-0 left-0 w-full h-full object-cover object-top"
                />}
              </div>
              <div className="flex flex-col p-4 max-h-[160px] overflow-hidden">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium truncate max-w-[200px]">{snapshot.title}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(snapshot.pageUrl, '_blank')}
                    className="h-8 w-8"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-1 text-sm text-muted-foreground truncate">{snapshot.pageUrl}</p>
                <div className="mt-2 flex gap-1 flex-wrap max-h-[60px] overflow-y-auto">
                  {snapshot.tags.map((tag: any) => (
                    <span
                      key={tag.id}
                      className="rounded-sm bg-primary/5 px-2 py-0.5 text-xs text-primary whitespace-nowrap"
                    >
                      # {tag.name}
                    </span>
                  ))}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Updated at {snapshot.updatedAt.toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes;
