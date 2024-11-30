import { PreStripedConfig } from "@usque/striped";
import { taxCodes } from "@usque/striped";

export const config = {
  features: {
    basicAnalytics: 'Basic Analytics',
    aiReporting: 'AI Reporting',
  },
  products: {
    hobby: {
      name: 'Hobby Plan',
      id: 'hobby',
      taxCode: taxCodes.SOFTWARE_AS_A_SERVICE,
      prices: {
        monthly: {
          amount: 1000,
          currency: 'usd',
          interval: 'month',
          type: 'recurring',
        },
        lifetime: {
          amount: 20000,
          currency: 'usd',
          interval: null,
          type: 'one_time',
        },
      },
      features: ['basicAnalytics'],
    },
    // ... other products
  },
} satisfies PreStripedConfig;