
import { Suspense } from 'react';
import { UserAuthForm } from './user-auth-form';

export const metadata = {
  title: 'Login',
  description: 'Login to your account',
};

// https://nextjs.org/docs/messages/deopted-into-client-rendering
function SearchBarFallback() {
  return <>placeholder</>;
}

export default function SignIn() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-24 sm:w-[350px]">
        <Suspense fallback={<SearchBarFallback />}>
          <UserAuthForm />
        </Suspense>
      </div>
    </div>
  );
}
