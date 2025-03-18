import { env } from '@/env';
import { Icons } from '@repo/utils';
import Link from 'next/link';

export const Footer = () => {
  const navigationItems = [
    {
      title: 'Home',
      href: '/',
      description: 'Relater is an open-source, read-it-later tool that helps you capture and review content from anywhere.',
    },
    {
      title: 'Pages',
      description: '',
      items: [
        {
          title: 'Blog',
          href: '/blog',
        },
      ],
    },
    {
      title: 'Community',
      description: '',
      items: [
        {
          title: 'X/Twitter',
          href: 'https://x.com/relaterai',
        },
      ],
    },
    {
      title: 'Legal',
      description: 'We stay on top of the latest legal requirements.',
      items: [
        {
          title: 'Terms of Service',
          href: '/legal/terms',
        },
        {
          title: 'Privacy Policy',
          href: '/legal/privacy',
        },
        // {
        //   title: 'Acceptable Use',
        //   href: '/legal/acceptable-use',
        // },
      ],
    },
  ];

  if (env.NEXT_PUBLIC_DOCS_URL) {
    navigationItems.at(1)?.items?.push({
      title: 'Docs',
      href: env.NEXT_PUBLIC_DOCS_URL,
    });
  }

  return (
    <section className="dark border-foreground/10 border-t">
      <div className="w-full bg-background py-20 text-foreground lg:py-40">
        <div className="container mx-auto">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="flex flex-col items-start gap-8">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Icons.logoClip className="h-10 w-10" />
                  <h2 className="max-w-xl text-left font-regular text-3xl tracking-tighter md:text-4xl">
                    Relater
                  </h2>
                </div>
                <p className="max-w-lg text-left text-foreground/75 text-lg leading-relaxed tracking-tight">
                  Your AI pair creator.
                </p>
                <p className='text-foreground/75 text-muted-foreground text-sm leading-relaxed tracking-tight'>
                  © {new Date().getFullYear()} Relater AI, Inc.
                </p>
              </div>
              {/* <Status /> */}
            </div>
            <div className="grid items-start gap-10 lg:grid-cols-4">
              {navigationItems.map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col items-start gap-1 text-base"
                >
                  <div className="flex flex-col gap-2">
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="flex items-center justify-between"
                        target={
                          item.href.includes('http') ? '_blank' : undefined
                        }
                        rel={
                          item.href.includes('http')
                            ? 'noopener noreferrer'
                            : undefined
                        }
                      >
                        <span className="text-xl">{item.title}</span>
                      </Link>
                    ) : (
                      <p className="text-xl">{item.title}</p>
                    )}
                    {item.items?.map((subItem) => (
                      <Link
                        key={subItem.title}
                        href={subItem.href}
                        className="flex items-center justify-between"
                        target={
                          subItem.href.includes('http') ? '_blank' : undefined
                        }
                        rel={
                          subItem.href.includes('http')
                            ? 'noopener noreferrer'
                            : undefined
                        }
                      >
                        <span className="text-foreground/75">
                          {subItem.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
