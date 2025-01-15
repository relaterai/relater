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
import { Icons, formatDate } from '@repo/utils';
import Footer from '../components/footer';

export default function ApiKeyCreatedTemplate({
  email = 'no-reply@relater.ai',
  token = {
    name: 'Relater API Key',
    type: 'All access',
    permissions: 'full access to all resources',
  },
}: {
  email: string;
  token: {
    name: string;
    type: string;
    permissions: string;
  };
}) {
  return (
    <Html>
      <Head />
      <Preview>New API Key Created</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className='mx-auto my-10 max-w-[500px] rounded border border-gray-200 border-solid px-10 py-5'>
            <Section className="mt-8 flex justify-center">
              <Icons.logo width={40} height={40} className="mx-auto my-0" />
            </Section>
            <Heading className='mx-0 my-7 p-0 text-center font-semibold text-black text-xl'>
              New API Key Created
            </Heading>
            <Text className='text-black text-sm leading-6'>
              You've created a new API key for your Later account with the name{' '}
              <strong>"{token.name}"</strong> on{' '}
              {formatDate(new Date().toString())}.
            </Text>
            <Text className='text-black text-sm leading-6'>
              Since this is a <strong>{token.type}</strong> token, it has{' '}
              {token.permissions}.
            </Text>
            <Section className='mt-4 mb-8 text-center'>
              <Link
                className='rounded-full bg-black px-6 py-3 text-center font-semibold text-[12px] text-white no-underline'
                href={`https://app.later.run/settings/tokens`}
              >
                View API Keys
              </Link>
            </Section>
            <Text className='text-black text-sm leading-6'>
              If you did not create this API key, you can{' '}
              <Link
                href={`https://app.later.run/settings/tokens`}
                className="text-black underline"
              >
                <strong>delete this key</strong>
              </Link>{' '}
              from your account.
            </Text>
            <Footer email={email} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
