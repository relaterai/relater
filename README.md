# Later

## About Later

Articles, social media posts, images, videos - Capture faster, review later.

Later goes beyond traditional bookmarking, allowing you to save any content - web pages, articles, images, online videos, social media posts, and even selected text. Never miss valuable content again.

✔ One-Click Save: With the Later extension, instantly save any content including articles, posts, images, and videos.

✔ Full-Text Search: Later enables comprehensive search across all your saved content, including articles, metadata, and AI-generated tags. Our advanced image recognition technology lets you search based on image content.

✔ AI Summaries: Get instant insights with our AI summarization feature, quickly understanding the essence of any saved content.

Elevate your online experience with Later - your essential tool for capturing, organizing, and discovering anything on the web.

## Project Structure

This repository is organized as a monorepo using pnpm workspaces, containing the following packages:

- [web](apps/web) - The public website built with Next.js, containing landing pages, documentation and blog posts
- [extension](apps/extension) - Browser extension built with React, supporting Chrome, Firefox and Edge browsers
- [app](apps/app) - Main application built with Next.js, handling core user functionalities
- [api](apps/api) - Backend service built with Node.js, handling webhooks and scheduled tasks
- [studio](apps/studio) - Database management interface powered by Prisma Studio
- [email](apps/email) - Email template development environment using React Email

## Documentation

Visit [https://later.run/docs](https://later.run/docs) to view the documentation.

## Contributing

Please read the contributing guide.

## License

Licensed under the [AGPL-3.0 license](LICENSE).
