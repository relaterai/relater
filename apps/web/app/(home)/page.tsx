import { showBetaFeature } from '@repo/feature-flags';
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
  title: 'Capture faster, review later.',
  description:
    'Later is a tool that helps you capture and review content from anywhere.',
};

export const metadata: Metadata = createMetadata(meta);

const Home = async () => {
  const betaFeature = await showBetaFeature();

  return (
    <>
      {betaFeature && (
        <div className="w-full bg-black py-2 text-center text-white">
          Beta feature now available
        </div>
      )}
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
