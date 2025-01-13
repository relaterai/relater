'use server';

import { sendEmail } from '@repo/email';
import { ContactTemplate } from '@repo/email/templates/contact';
import { env } from '@repo/env';

export const contact = async (
  name: string,
  email: string,
  message: string
): Promise<{
  error?: string;
}> => {
  try {
    await sendEmail({
      from: env.EMAIL_FROM,
      email: env.EMAIL_FROM,
      subject: 'Contact form relater.ai',
      // replyTo: email,
      react: <ContactTemplate name={name} email={email} message={message} />,
    });

    return {};
  } catch (error) {
    // const errorMessage = parseError(error);

    return { error: 'sendEmail failed' };
  }
};
