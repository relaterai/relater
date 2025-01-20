// biome-ignore lint/correctness/noNodejsModules: Generates sitemap on Node.js
import fs from 'node:fs';
import { env } from '@/env';
import type { MetadataRoute } from 'next';

const appFolders = fs.readdirSync('app', { withFileTypes: true });
const pages = appFolders
  .filter((file) => file.isDirectory())
  .filter((folder) => !folder.name.startsWith('_'))
  .filter((folder) => !folder.name.startsWith('('))
  .map((folder) => folder.name);

const blogs = fs
  .readdirSync('content/blog', { withFileTypes: true })
  .filter((file) => !file.isDirectory())
  .filter((file) => !file.name.startsWith('_'))
  .filter((file) => !file.name.startsWith('('))
  .map((file) => file.name.replace('.mdx', ''));

const legals = fs
  .readdirSync('content/legal', { withFileTypes: true })
  .filter((file) => !file.isDirectory())
  .filter((file) => !file.name.startsWith('_'))
  .filter((file) => !file.name.startsWith('('))
  .map((file) => file.name.replace('.mdx', ''));

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: env.VERCEL_PROJECT_PRODUCTION_URL,
      lastModified: new Date(),
    },
    ...pages.map((page) => ({
      url: new URL(page, env.VERCEL_PROJECT_PRODUCTION_URL).href,
      lastModified: new Date(),
    })),
    ...blogs.map((blog) => ({
      url: new URL(
        `blog/${blog}`,
        env.VERCEL_PROJECT_PRODUCTION_URL
      ).href,
      lastModified: new Date(),
    })),
    ...legals.map((legal) => ({
      url: new URL(
        `legal/${legal}`,
        env.VERCEL_PROJECT_PRODUCTION_URL
      ).href,
      lastModified: new Date(),
    })),
  ];
}
