import { useSnapshots } from '@/swr/use-snapshots';
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
import { Notes } from './notes';

const title = 'Recycle Bin';
const description = 'Deleted notes will be permanently removed after 30 days';

export const metadata: Metadata = {
  title,
  description,
};

const App = async () => {
  const session = await auth();

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
      <Notes />
    </>
  );
};

export default App;
