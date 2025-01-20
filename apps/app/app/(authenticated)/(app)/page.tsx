import { auth } from '@repo/auth/server';
import { SidebarTrigger } from '@repo/design-system/components/ui/sidebar';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Notes from './components/notes';
import Search from './components/search';

const title = 'Relater';
const description = 'Relater is a AI tool for managing your bookmarks and notes.';

export const metadata: Metadata = {
  title,
  description,
};

const App = async () => {
  const session = await auth();

  if (!session?.user) {
    notFound();
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between gap-2">
        <div className='flex w-full items-center justify-between gap-2 px-4'>
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
          </div>
          <Search />'w-full justify-between '
        </div >
      </header >
      <Notes />
    </>
  );
};

export default App;
