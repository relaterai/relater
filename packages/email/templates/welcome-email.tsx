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
      <Preview>Welcome to Later</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-[500px] rounded border border-solid border-gray-200 px-10 py-5">
            <Section className="mt-8 flex justify-center">
              <Icons.logo width={40} height={40} className="mx-auto my-0" />
            </Section>
            <Heading className="mx-0 my-7 p-0 text-center text-xl font-semibold text-black">
              Welcome to Later
            </Heading>
            <Text className="text-sm leading-6 text-black">
              Thanks for signing up{name && `, ${name}`}!
            </Text>
            <Text className="text-sm leading-6 text-black">
              My name is Tsui, and I'm the founder of Later - Where Creators
              Thrive Together! I'm excited to have you on board!
            </Text>
            <Text className="text-sm leading-6 text-black">
              Here are a few things you can do:
            </Text>
            <Text className="ml-1 text-sm leading-4 text-black">
              ◆
              <Link
                href="https://later.run/mission"
                className="font-medium text-blue-600 no-underline"
              >
                Where Creators Thrive Together!
              </Link>{' '}
            </Text>
            <Text className="ml-1 text-sm leading-4 text-black">
              ◆ Follow us on{' '}
              <Link
                href="https://twitter.com/tsui_nova"
                className="font-medium text-blue-600 no-underline"
              >
                Twitter
              </Link>
            </Text>
            <Text className="text-sm leading-6 text-black">
              Let me know if you have any questions or feedback. I'm always
              happy to help!
            </Text>
            <Text className="text-sm font-light leading-6 text-gray-400">
              Tsui from Later
            </Text>

            <Footer email={email} marketing />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
