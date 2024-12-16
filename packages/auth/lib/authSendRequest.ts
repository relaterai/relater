import { sendEmail } from "@repo/email";
import LoginLink from "@repo/email/templates/login-link";

export async function sendVerificationRequest({
  identifier,
  url,
}: {
  identifier: string;
  url: string;
}) {
  if (process.env.NODE_ENV === 'development') {
    // @ts-ignore
    console.log(`\x1b[32mLogin link\x1b[0m: \x1b[33m${url}\x1b[0m`);
    return;
  } else {
    await sendEmail({
      email: identifier,
      subject: 'Your Later Login Link',
      react: LoginLink({
        url,
        email: identifier,
      }),
    });
  }
}
