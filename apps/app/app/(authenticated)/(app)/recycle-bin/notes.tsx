"use client"

import { useEffect, useState } from "react";
import { useSnapshots } from "@/swr/use-snapshots";
import { Button } from "@repo/design-system/components/ui/button";
import { SearchIcon, Trash2Icon, UndoIcon, Loader2 } from "lucide-react";
import { useInView } from "react-intersection-observer";

export const Notes = () => {
  const [page, setPage] = useState(1);
  const [allSnapshots, setAllSnapshots] = useState<any[]>([]);
  const { snapshots = [], isLoading, error } = useSnapshots({
    isDeleted: true,
    pageSize: 10,
    page
  });

  const { ref, inView } = useInView();

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

  return (
    <div className="grid auto-rows-min gap-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 grid-cols-1">
      {allSnapshots.map((note, index) => (
        <div
          key={note.id}
          ref={index === allSnapshots.length - 1 ? ref : undefined}
          className="aspect-auto rounded-xl bg-muted/50 overflow-hidden hover:bg-muted/70 hover:shadow-sm transition-all duration-300"
        >
          <div className="flex flex-col h-full">
            <div className="h-[62%] relative">
              <img
                src={note.cover}
                alt={note.title}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute top-2 right-2 bg-destructive/90 text-destructive-foreground px-2 py-1 rounded-md text-xs">
                {calculateRemainingDays(note.deletedAt)} days left
              </div>
            </div>
            <div className="h-[38%] flex flex-col p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{note.title}</h3>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" className="h-6 w-6">
                    <UndoIcon className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive hover:text-destructive">
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{note.content}</p>
              <div className="mt-auto text-xs text-muted-foreground">
                Deleted on {note.deletedAt.toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};