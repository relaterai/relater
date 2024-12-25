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
import { SearchIcon } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

const title = 'Later';
const description = 'My application.';

export const metadata: Metadata = {
  title,
  description,
};

const App = async () => {
  const users = await prisma.user.findMany({});
  const session = await auth();

  const notes = [
    {
      id: '1',
      title: 'Note 1',
      tags: ['#Tag 0/Tag 1', '#todo'],
      content: 'This is the content of note 1.',
      cover: 'https://picsum.photos/1280/720',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: 'Note 2',
      tags: ['#Tag 0/Tag 4', '#todo'],
      content: 'This is the content of note 2.',
      cover: 'https://picsum.photos/1333/768',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  if (!session?.user) {
    notFound();
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between gap-2">
        <div className="flex items-center gap-2 px-4 justify-between w-full">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbPage>
                    Dashboard
                  </BreadcrumbPage>
                </BreadcrumbItem>
                {/* <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem> */}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="search"
              placeholder="Search notes..."
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
        <div className="grid auto-rows-min gap-4 md:grid-cols-4">
          {notes.map((note) => (
            <div key={note.id} className="aspect-auto rounded-xl bg-muted/50 overflow-hidden cursor-pointer hover:bg-muted/70 hover:shadow-sm transition-all duration-300">
              <div className="flex flex-col h-full">
                <div className="h-2/3">
                  <img
                    src={note.cover}
                    alt={note.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="h-1/3 flex flex-col p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{note.title}</h3>
                    <div className="flex gap-1">
                      {note.tags.map((tag) => (
                        <span key={tag} className="rounded-sm bg-primary/5 px-2 py-0.5 text-xs text-primary">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{note.content}</p>
                  <div className="mt-auto text-xs text-muted-foreground">
                    Updated at {note.updatedAt.toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" /> */}
      </div>
    </>
  );
};

export default App;
