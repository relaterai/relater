import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';
import { Cases } from './components/cases';
import { CTA } from './components/cta';
import { FAQ } from './components/faq';
import { Features } from './components/features';
import { Hero } from './components/hero';
// import { Stats } from './components/stats';
// import { Testimonials } from './components/testimonials';

const meta = {
  title: 'Your AI pair creator.',
  description:
    'Relater is an open-source, read-it-later tool that helps you capture and review content from anywhere.',
};

export const metadata: Metadata = createMetadata(meta);

const Home = async () => {
  return (
    <>
      <Hero />
      <Cases />
      <Features />
      {/* <Stats /> */}
      {/* <Testimonials /> */}
      <FAQ />
      <CTA />
    </>
  );
};

export default Home;
