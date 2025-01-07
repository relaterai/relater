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
import Notes from '../../components/notes';

const title = 'Later';
const description = 'My application.';

export const metadata: Metadata = {
  title,
  description,
};

const App = async ({ params }: { params: { tag: string[] } }) => {
  const users = await prisma.user.findMany({});
  const session = await auth();

  if (!session?.user) {
    notFound();
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between gap-2">
        <div className="flex items-center gap-2 px-4 justify-between w-full">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
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
        </div >
      </header >
      <Notes tag={params.tag} />
    </>
  );
};

export default App;
