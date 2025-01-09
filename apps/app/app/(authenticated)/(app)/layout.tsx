import { auth } from '@repo/auth/server';
import { SidebarProvider } from '@repo/design-system/components/ui/sidebar';
import { showBetaFeature } from '@repo/feature-flags';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { GlobalSidebar } from './components/sidebar';
import { SessionProvider } from 'next-auth/react';

type AppLayoutProperties = {
  readonly children: ReactNode;
};

const AppLayout = async ({ children }: AppLayoutProperties) => {
  const user = await auth();
  const betaFeature = await showBetaFeature();

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <SidebarProvider>
      <SessionProvider>
        <GlobalSidebar>
          {betaFeature && (
            <div className="m-4 rounded-full bg-success p-1.5 text-center text-sm text-success-foreground">
              Beta feature now available
            </div>
          )}
          {children}
        </GlobalSidebar>
        {/* <PostHogIdentifier /> */}
      </SessionProvider>
    </SidebarProvider>
  );
};

export default AppLayout;
