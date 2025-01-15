import { StripeAgentToolkit } from '@stripe/agent-toolkit/ai-sdk';
import { keys } from './keys';

const { STRIPE_SECRET_KEY } = keys();

export const paymentsAgentToolkit = new StripeAgentToolkit({
  secretKey: STRIPE_SECRET_KEY,
  configuration: {
    actions: {
      paymentLinks: {
        create: true,
      },
      products: {
        create: true,
      },
      prices: {
        create: true,
      },
    },
  },
});
