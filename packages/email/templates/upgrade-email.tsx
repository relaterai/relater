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
      <Preview>Thank you for upgrading to Relater {plan}!</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className='mx-auto my-10 max-w-[500px] rounded border border-gray-200 border-solid px-10 py-5'>
            <Section className="mt-8 flex justify-center">
              <Icons.logo width={40} height={40} className="mx-auto my-0" />
            </Section>
            <Heading className='mx-0 my-7 p-0 text-center font-semibold text-black text-xl'>
              Thank you for upgrading to Relater {plan}!
            </Heading>
            <Text className='text-black text-sm leading-6'>
              Hey{name && ` ${name}`}!
            </Text>
            <Text className='text-black text-sm leading-6'>
              My name is Tsui, and I'm the founder of Relater. I wanted to
              personally reach out to thank you for upgrading to Relater {plan}!
            </Text>
            <Text className='text-black text-sm leading-6'>
              As you might already know, we are a{' '}
              <Link
                href="https://relater.ai/mission"
                className="font-medium text-blue-600 no-underline"
              >
                100% bootstrapped
              </Link>{' '}
              and{' '}
              <Link
                href="https://relater.ai/github"
                className="font-medium text-blue-600 no-underline"
              >
                open-source
              </Link>{' '}
              business. Your support means the world to us and helps us continue
              to build and improve Relater.
            </Text>
            <Text className='text-black text-sm leading-6'>
              On the {plan} plan, you now have access to:
            </Text>
            <Text className='ml-1 text-black text-sm leading-4'>
              ◆ Unlimited tags
            </Text>
            <Text className='ml-1 text-black text-sm leading-4'>
              ◆ API access (coming soon)
            </Text>
            {plan === 'Enterprise' && (
              <Text className='ml-1 text-black text-sm leading-4'>
                ◆ Priority support
              </Text>
            )}
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
