"use client"

import { useEffect, useState } from "react";
import { useSnapshots } from "@/swr/use-snapshots";
import { Button } from "@repo/design-system/components/ui/button";
import { SearchIcon, Trash2Icon, UndoIcon, Loader2 } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { openDB } from 'idb';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/design-system/components/ui/alert-dialog";
import { Empty } from "../components/empty";

export const Notes = () => {
  const [page, setPage] = useState(1);
  const [allSnapshots, setAllSnapshots] = useState<any[]>([]);
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});
  const { snapshots = [], isLoading, error } = useSnapshots({
    isDeleted: true,
    pageSize: 10,
    page
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { ref, inView } = useInView();

  const handleRestore = async (id: string) => {
    await fetch(`/api/snapshots/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        isDeleted: false,
      }),
    });
  };

  const handleDelete = async (id: string) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
    setAllSnapshots(prev => prev.filter(snapshot => snapshot.id !== id));
  };

  const confirmDelete = async () => {
    await fetch(`/api/snapshots/${deleteId}`, {
      method: 'DELETE',
    });
    setDeleteDialogOpen(false);
  };

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
    if (page === 1) {
      setAllSnapshots([])
    }
  }, [page])

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
    const shouldLoadMore = inView && allSnapshots.length > 0 && snapshots.length > 0 && !isLoading && !error;
    if (shouldLoadMore) {
      setPage(prev => prev + 1);
    }
  }, [inView, allSnapshots, isLoading]);

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

  // Calculate remaining days
  const calculateRemainingDays = (deletedAt: Date) => {
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    const deleteDeadline = new Date(deletedAt.getTime() + thirtyDaysInMs);
    const remainingMs = deleteDeadline.getTime() - new Date().getTime();
    return Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
  };

  if (isLoading && allSnapshots.length === 0) {
    return <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    </div>
  }

  if (allSnapshots.length === 0) {
    return <Empty />
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="grid auto-rows-min grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {allSnapshots.map((note, index) => (
          <div
            key={note.id}
            ref={index === allSnapshots.length - 1 ? ref : undefined}
            className='overflow-hidden rounded-xl bg-muted/70 transition-all duration-300 hover:bg-muted hover:shadow-sm'
          >
            <div className="flex flex-col">
              <div className="relative w-full pt-[56.25%] group">
                {imageUrls[note.id] && <img
                  src={imageUrls[note.id]}
                  alt={note.title}
                  className='absolute top-0 left-0 h-full w-full object-cover object-top opacity-60'
                />}
                <div className="absolute top-2 right-2 bg-destructive/90 text-destructive-foreground px-2 py-1 rounded-md text-xs">
                  {calculateRemainingDays(note.updatedAt)} days left
                </div>
              </div>
              <div className='flex max-h-[160px] flex-col overflow-hidden p-4'>
                <div className="flex items-center justify-between gap-2">
                  <h3 className='max-w-[200px] truncate font-medium'>{note.title}</h3>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleRestore(note.id)}>
                      <UndoIcon className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(note.id)}>
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className='mt-1 truncate text-muted-foreground text-sm'>{note.pageUrl}</p>
                <div className='mt-2 flex max-h-[60px] flex-wrap gap-1 overflow-y-auto'>
                  {note.tags.map((tag: any) => (
                    <span
                      key={tag.id}
                      className='whitespace-nowrap rounded-sm bg-primary/5 px-2 py-0.5 text-primary text-xs'
                    >
                      {tag.emoji} {tag.name}
                    </span>
                  ))}
                </div>
                <div className='mt-2 text-muted-foreground text-xs'>
                  Deleted on {note.updatedAt.toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};