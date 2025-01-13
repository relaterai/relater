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

export default function WelcomeEmailTemplate({
  name = 'Tsui',
  email = 'no-reply@later.run',
}: {
  name: string | null;
  email: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Relater</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className='mx-auto my-10 max-w-[500px] rounded border border-gray-200 border-solid px-10 py-5'>
            <Section className="mt-8 flex justify-center">
              <Icons.logo width={40} height={40} className="mx-auto my-0" />
            </Section>
            <Heading className='mx-0 my-7 p-0 text-center font-semibold text-black text-xl'>
              Welcome to Relater
            </Heading>
            <Text className='text-black text-sm leading-6'>
              Thanks for signing up{name && `, ${name}`}!
            </Text>
            <Text className='text-black text-sm leading-6'>
              My name is Tsui, and I'm the founder of Relater - Your AI pair
              creator! I'm excited to have you on board!
            </Text>
            <Text className='text-black text-sm leading-6'>
              Here are a few things you can do:
            </Text>
            <Text className='ml-1 text-black text-sm leading-4'>
              ◆
              <Link
                href="https://relater.ai/mission"
                className="font-medium text-blue-600 no-underline"
              >
                Where Creators Thrive Together!
              </Link>{' '}
            </Text>
            <Text className='ml-1 text-black text-sm leading-4'>
              ◆ Follow us on{' '}
              <Link
                href="https://twitter.com/tsui_nova"
                className="font-medium text-blue-600 no-underline"
              >
                Twitter
              </Link>
            </Text>
            <Text className='text-black text-sm leading-6'>
              Let me know if you have any questions or feedback. I'm always
              happy to help!
            </Text>
            <Text className='font-light text-gray-400 text-sm leading-6'>
              Tsui from Relater
            </Text>

            <Footer email={email} marketing />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
