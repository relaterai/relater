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
import { Separator } from '@repo/design-system/components/ui/separator';
import { SidebarTrigger } from '@repo/design-system/components/ui/sidebar';
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

  if (!session?.user) {
    notFound();
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Building Your Application
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          {users.map((user) => (
            <div key={user.id} className="aspect-video rounded-xl bg-muted/50">
              {user.name}
            </div>
          ))}
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </div>
    </>
  );
};

export default App;
