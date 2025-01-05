import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@repo/design-system/components/ui/accordion';
import { GITHUB_URL } from '@repo/utils';

const faqItems = [
  {
    question: 'Is my saved content accessible across different browsers and devices?',
    answer: 'Absolutely! Our service is designed for seamless cross-device access with full platform sync. Once you log into your account, all your saved content will be available whether you\'re using Chrome, Safari, Firefox or any other browser. You can easily switch between your laptop, desktop or other devices without losing access to your saves - everything stays perfectly in sync. Additionally, we\'re developing mobile apps for both Android and iOS platforms to provide an even better cross-device experience with real-time synchronization.',
  },
  {
    question: 'What platforms does Later support?',
    answer: 'Later is available across all major platforms including iOS, Android, web, and provides a public API for integrations.'
  },
  {
    question: 'What content formats does Later support?',
    answer: 'Later is your all-in-one content saving solution. You can collect and organize a comprehensive range of digital content including webpages, articles, images, PDFs, videos, music, podcasts, and more. Whether you\'re researching, learning, or simply storing content for later, Later handles it all seamlessly.',
  },
  {
    question: 'What are the different ways to save content to Later?',
    answer: (
      <ul className="list-disc pl-6 space-y-2">
        <li>Browser Extension: Save anything with one click using our browser extension</li>
        <li>Mobile Sharing: Share directly from your mobile device to Later</li>
        <li>Copy and Paste: Simply paste any content directly into Later</li>
        <li>Email Integration: Forward emails or newsletters to your Later account</li>
        <li>API: Save content from any integrations using our public API</li>
      </ul>
    ),
  },
  {
    question: 'How does Later handle privacy and security?',
    answer: 'We take your privacy and security seriously. Later is built with the highest standards of security and privacy. We do not track your activity, and we do not sell your data. We are a privacy-first service that is built with the highest standards of security and privacy.',
  },
  {
    question: 'Is Later open source? Can I self-host it?',
    answer: (
      <>
        Yes! Later is open source and we encourage contributions from the community. You can find the source code on our GitHub repository at{' '}
        <a
          href={GITHUB_URL}
          className="text-primary hover:underline font-medium"
          target="_blank"
          rel="noopener noreferrer"
        >
          {GITHUB_URL}
        </a>
      </>
    )
  }
];

export const FAQ = () => (
  <div className="w-full py-20 lg:py-40">
    <div className="container mx-auto">
      <div className="flex flex-col gap-2">
        <h2 className="max-w-xl font-regular text-3xl tracking-tighter md:text-5xl">
          FAQ
        </h2>
      </div>
      <div className="grid gap-10 mt-10">
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`index-${index}`}>
              <AccordionTrigger className="text-2xl">
                {item.question}
              </AccordionTrigger>
              <AccordionContent>
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  </div>
);
