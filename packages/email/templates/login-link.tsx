import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import { Icons } from '@repo/utils';
import Footer from '../components/footer';

export default function LoginLinkTemplate({
  email = 'no-reply@relater.ai',
  url = 'http://app.localhost:3000/api/auth/callback/email?callbackUrl=http%3A%2F%2Fapp.localhost%3A3000%2Flogin&token=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx&email=youremail@gmail.com',
  // logo = 'https://relater.ai/logo.png',
}: {
  email: string;
  url: string;
  // logo: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Your Login Link</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className='mx-auto my-10 max-w-[500px] rounded border border-gray-200 border-solid px-10 py-5'>
            <Section className="mt-8 flex justify-center">
              {/* <Img
                src={logo}
                width="40"
                height="40"
                alt="Relater"
                className="mx-auto my-0"
              /> */}
              <Icons.logo width={40} height={40} className="mx-auto my-0" />
            </Section>
            <Heading className='mx-0 my-7 p-0 text-center font-semibold text-black text-xl'>
              Your Login Link
            </Heading>
            <Text className='text-black text-sm leading-6'>
              Welcome to Relater!
            </Text>
            <Text className='text-black text-sm leading-6'>
              Please click the magic link below to sign in to your account.
            </Text>
            <Section className="my-8 text-center">
              <Link
                className='rounded-full bg-black px-6 py-3 text-center font-semibold text-[12px] text-white no-underline'
                href={url}
              >
                Sign in
              </Link>
            </Section>
            <Text className='text-black text-sm leading-6'>
              or copy and paste this URL into your browser:
            </Text>
            <Text className="max-w-sm flex-wrap break-words font-medium text-purple-600 no-underline">
              {url.replace(/^https?:\/\//, '')}
            </Text>
            <Footer email={email} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
