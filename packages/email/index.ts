import { SES } from '@aws-sdk/client-ses';
import { render } from '@react-email/render';
import type { JSXElementConstructor, ReactElement } from 'react';
import { Resend } from 'resend';
import { keys } from './keys';

const {
  EMAIL_PROVIDER,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  RESEND_TOKEN,
  AWS_SES_REGION,
} = keys();

export const sendEmail = async ({
  email,
  subject,
  react,
  // marketing, // TODO: add marketing email support
  test,
  from = 'CEO from Relater <tsui@relater.ai>',
}: {
  email: string;
  subject: string;
  react: ReactElement<any, string | JSXElementConstructor<any>>;
  // marketing?: boolean;
  test?: boolean;
  from?: string;
}) => {
  const params = {
    Source: from,
    Destination: {
      ToAddresses: [test ? 'no-reply@relater.ai' : email],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: await render(react),
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
      },
    },
  };

  if (test) {
    console.log('Rendered email content:', params.Message.Body.Html.Data);
  }

  if (EMAIL_PROVIDER === 'SES') {
    const ses = new SES({
      region: AWS_SES_REGION!,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID!,
        secretAccessKey: AWS_SECRET_ACCESS_KEY!,
      },
    });
    await ses.sendEmail(params);
  } else {
    const resend = new Resend(RESEND_TOKEN);
    await resend.emails.send({
      from,
      to: email,
      subject,
      replyTo: email,
      react,
    });
  }
};

export * from './templates';
