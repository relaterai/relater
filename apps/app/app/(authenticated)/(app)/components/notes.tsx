'use client';

import { useSnapshots } from "@/swr/use-snapshots";
import { Button } from "@repo/design-system/components/ui/button";
import { timeAgo } from "@repo/utils";
import { openDB } from 'idb';
import { ExternalLink, Loader2, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Empty } from "./empty";

const Notes = () => {
  const searchParams = useSearchParams();
  const tag = searchParams.get('tag');
  const search = searchParams.get('search');
  const date = searchParams.get('date');

  const [searchValue, setSearchValue] = useState({});

  const [page, setPage] = useState(1);
  const [allSnapshots, setAllSnapshots] = useState<any[]>([]);
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});

  const { snapshots = [], isLoading, error } = useSnapshots({
    pageSize: 10,
    page,
    ...searchValue,
  });

  // const { snapshots: newestSnapshots } = useSnapshots({
  //   pageSize: 1,
  //   page: 1,
  //   tagName: tag || undefined,
  // });

  const router = useRouter();
  const { ref, inView } = useInView();

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
    setPage(1)
    setSearchValue({
      tagName: tag || undefined,
      search: search || undefined,
      heatmapDate: date ? new Date(date).toISOString() : undefined,
    })
  }, [tag, search, date]);

  useEffect(() => {
    if (page === 1) {
      setAllSnapshots([])
    }
  }, [page])

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

  // useEffect(() => {
  //   if (newestSnapshots?.[0]?.id && allSnapshots.length > 0 && !allSnapshots.some(s => s.id === newestSnapshots[0].id)) {

  //     console.log(newestSnapshots, allSnapshots)
  //     setShowRefreshDialog(true)
  //   }
  // }, [newestSnapshots, allSnapshots])

  useEffect(() => {
    const shouldLoadMore = inView && allSnapshots.length > 0 && snapshots.length > 0 && !isLoading && !error;
    if (shouldLoadMore) {
      setPage(prev => prev + 1);
    }
  }, [inView, allSnapshots, isLoading]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/snapshots/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          isDeleted: true,
        }),
      });
      setAllSnapshots(prev => prev.filter(snapshot => snapshot.id !== id));
    } catch (error) {
      console.error('Error deleting snapshot:', error);
    }
  };

  if (isLoading && allSnapshots.length === 0) {
    return <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className='flex h-full items-center justify-center'>
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    </div>
  }

  if (allSnapshots.length === 0) {
    return <Empty />
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className='grid auto-rows-min grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
        {allSnapshots.map((snapshot, index) => (
          <div
            key={snapshot.id}
            ref={index === allSnapshots.length - 1 ? ref : undefined}
            className='cursor-pointer overflow-hidden rounded-xl bg-muted/70 transition-all duration-300 hover:bg-muted hover:shadow-sm'
            onClick={() => router.push(`/note/${snapshot.id}`)}
          >
            <div className="flex flex-col">
              <div className="relative w-full pt-[56.25%] group">
                {imageUrls[snapshot.id] && <img
                  src={imageUrls[snapshot.id]}
                  alt={snapshot.title}
                  className='absolute top-0 left-0 h-full w-full object-cover object-top'
                />}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute rounded-full top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200"
                  onClick={(e) => handleDelete(snapshot.id, e)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className='flex max-h-[160px] flex-col overflow-hidden p-4'>
                <div className="flex items-center justify-between gap-2">
                  <h3 className='max-w-[200px] truncate font-medium'>{snapshot.title}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(snapshot.pageUrl, '_blank');
                    }}
                    className="h-8 w-8"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                <p className='mt-1 truncate text-muted-foreground text-sm'>{snapshot.pageUrl}</p>
                <div className='mt-2 flex max-h-[60px] flex-wrap gap-1 overflow-y-auto'>
                  {snapshot.tags.map((tag: any) => (
                    <span
                      key={tag.id}
                      className='whitespace-nowrap rounded-sm bg-primary/5 px-2 py-0.5 text-primary text-xs'
                    >
                      {tag.emoji} {tag.name}
                    </span>
                  ))}
                </div>
                <div className='mt-2 text-muted-foreground text-xs'>
                  {timeAgo(snapshot.createdAt, { withAgo: true })}
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
