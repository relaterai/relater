# Relater

## About Relater

Your AI pair creator.

🚀 Transform how you interact with web content using the Relater browser extension. Save, organize, and create with the content that matters most to you.

📥 Capture everything instantly - from articles and social posts to images and videos - and review when you're ready.

🏷 Multi-level tags & full-text search: Relater allows you to search across all saved content, including articles, metadata, and multi-level tags.

🔍 AI Summaries: Get instant insights with our AI summarization feature, quickly understanding the essence of any saved content.

🔗 API Integrations: Seamlessly connect Relater to your workflows and AI agents through our powerful API - access all your saved content and metadata with ease.

🔒 Privacy-first & Open Source
Your privacy is our priority. All your data stays under your control. As an open-source project, our commitment to privacy is transparent and verifiable.

## Project Structure

This repository is organized as a monorepo using pnpm workspaces, containing the following packages:

- [web](apps/web) - The public website built with Next.js, containing landing pages, documentation and blog posts
- [extension](apps/extension) - Browser extension built with React, supporting Chrome, Firefox and Edge browsers
- [app](apps/app) - Main application built with Next.js, handling core user functionalities
- [api](apps/api) - Backend service built with Node.js, handling webhooks and scheduled tasks
- [studio](apps/studio) - Database management interface powered by Prisma Studio
- [email](apps/email) - Email template development environment using React Email

## Documentation

Visit [https://relater.ai/docs](https://relater.ai/docs) to view the documentation.

## Contributing

Please read the contributing guide.

## License

Licensed under the [AGPL-3.0 license](LICENSE).
