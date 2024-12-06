import { AnalyticsProvider } from '@repo/analytics';
import { env } from '@repo/env';
// @ts-expect-error
import { VercelToolbar } from '@vercel/toolbar/next';
import type { ThemeProviderProps } from 'next-themes';
import { Toaster } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';
import { ThemeProvider } from './providers/theme';

type DesignSystemProviderProperties = ThemeProviderProps;

export const DesignSystemProvider = ({
  children,
  ...properties
}: DesignSystemProviderProperties) => (
  <ThemeProvider {...properties}>
    <AnalyticsProvider>
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster />
      {env.NODE_ENV === 'development' && <VercelToolbar />}
    </AnalyticsProvider>
  </ThemeProvider>
);
