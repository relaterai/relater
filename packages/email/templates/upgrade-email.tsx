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

export default function UpgradeEmailTemplate({
  name = 'Tsui',
  email = 'no-reply@later.run',
  plan = 'Pro',
}: {
  name: string | null;
  email: string;
  plan: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Thank you for upgrading to Later {plan}!</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-[500px] rounded border border-solid border-gray-200 px-10 py-5">
            <Section className="mt-8 flex justify-center">
              <Icons.logo width={40} height={40} className="mx-auto my-0" />
            </Section>
            <Heading className="mx-0 my-7 p-0 text-center text-xl font-semibold text-black">
              Thank you for upgrading to Later {plan}!
            </Heading>
            <Text className="text-sm leading-6 text-black">
              Hey{name && ` ${name}`}!
            </Text>
            <Text className="text-sm leading-6 text-black">
              My name is Tsui, and I'm the founder of Later. I wanted to
              personally reach out to thank you for upgrading to Later {plan}!
            </Text>
            <Text className="text-sm leading-6 text-black">
              As you might already know, we are a{' '}
              <Link
                href="https://later.run/mission"
                className="font-medium text-blue-600 no-underline"
              >
                100% bootstrapped
              </Link>{' '}
              and{' '}
              <Link
                href="https://later.run/github"
                className="font-medium text-blue-600 no-underline"
              >
                open-source
              </Link>{' '}
              business. Your support means the world to us and helps us continue
              to build and improve Later.
            </Text>
            <Text className="text-sm leading-6 text-black">
              On the {plan} plan, you now have access to:
            </Text>
            <Text className="ml-1 text-sm leading-4 text-black">
              ◆ Unlimited tags
            </Text>
            <Text className="ml-1 text-sm leading-4 text-black">
              ◆ API access (coming soon)
            </Text>
            {plan === 'Enterprise' && (
              <Text className="ml-1 text-sm leading-4 text-black">
                ◆ Priority support
              </Text>
            )}
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
