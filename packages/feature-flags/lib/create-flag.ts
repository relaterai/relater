import { analytics } from '@repo/analytics/posthog/server';
import { auth } from '@repo/auth/server';
import { unstable_flag as flag } from '@vercel/flags/next';

export const createFlag = (key: string) =>
  flag({
    key,
    defaultValue: false,
    async decide() {
      const session = await auth();

      if (!session?.user?.id) {
        return this.defaultValue as boolean;
      }

      const isEnabled = await analytics.isFeatureEnabled(key, session.user.id);

      return isEnabled ?? (this.defaultValue as boolean);
    },
  });
