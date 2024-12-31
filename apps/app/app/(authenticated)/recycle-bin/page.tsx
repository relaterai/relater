import { auth } from '@repo/auth/server';
import prisma from '@repo/database/edge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@repo/design-system/components/ui/breadcrumb';
import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import { Separator } from '@repo/design-system/components/ui/separator';
import { SidebarTrigger } from '@repo/design-system/components/ui/sidebar';
import { SearchIcon, Trash2Icon, UndoIcon } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

const title = 'Recycle Bin';
const description = 'Deleted notes will be permanently removed after 30 days';

export const metadata: Metadata = {
  title,
  description,
};

const App = async () => {
  const session = await auth();

  // Mock deleted notes data
  const deletedNotes = [
    {
      id: '1',
      title: 'Note 1',
      tags: ['#Tag 0/Tag 1', '#todo'],
      content: 'This is the content of note 1.',
      cover: 'https://picsum.photos/1280/720',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date('2024-12-20'), // Mock deletion date
    },
    {
      id: '2',
      title: 'Note 2',
      tags: ['#Tag 0/Tag 4', '#todo'],
      content: 'This is the content of note 2.',
      cover: 'https://picsum.photos/1333/768',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date('2024-12-25'), // Mock deletion date
    },
  ];

  if (!session?.user) {
    notFound();
  }

  // Calculate remaining days
  const calculateRemainingDays = (deletedAt: Date) => {
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    const deleteDeadline = new Date(deletedAt.getTime() + thirtyDaysInMs);
    const remainingMs = deleteDeadline.getTime() - new Date().getTime();
    return Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
  };

  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between gap-2">
        <div className="flex items-center gap-2 px-4 justify-between w-full">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Recycle Bin</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="search"
              placeholder="Search deleted notes..."
              className="h-9"
            />
            <Button type="submit" size="sm" variant="ghost">
              <SearchIcon className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </div>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 grid-cols-1">
          {deletedNotes.map((note) => (
            <div key={note.id} className="aspect-auto rounded-xl bg-muted/50 overflow-hidden hover:bg-muted/70 hover:shadow-sm transition-all duration-300">
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
      </div>
    </>
  );
};

export default App;
