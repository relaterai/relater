import { config, } from '@repo/next-config';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = { ...config };

// if (env.VERCEL) {
//   nextConfig = withSentry(nextConfig);
// }

// if (env.ANALYZE === 'true') {
//   nextConfig = withAnalyzer(nextConfig);
// }

export default nextConfig;
