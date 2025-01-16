import type { PreStripedConfig } from '@usque/striped';
import { taxCodes } from '@usque/striped';

export const config = {
  features: {
    // Input
    aiTagSystem: {
      name: 'AI Tag System',
      free: true,
      pro: true,
    },
    heatMap: {
      name: 'Heat Map',
      free: true,
      pro: true,
    },
    allPlatformsSync: {
      name: 'All platforms sync',
      free: true,
      pro: true,
    },
    // Storage
    text: {
      name: 'Text',
      free: 'unlimited',
      pro: 'unlimited',
    },
    storage: {
      name: 'Storage',
      free: '500 MB',
      pro: '10 GB',
    },
    imageCompression: {
      name: 'Image Compression',
      free: 'Compressed',
      pro: 'Original',
    },
    export: {
      name: 'Export',
      free: true,
      pro: true,
    },
    // Advanced
    tagIcon: {
      name: 'Tag Icon',
      free: false,
      pro: true,
    },
    apiAccess: {
      name: 'API Access',
      free: false,
      pro: true,
    },
    vectorSearch: {
      name: 'Vector Search',
      free: false,
      pro: true,
    },
  },
  products: {
    free: {
      name: 'Free',
      id: 'free',
      taxCode: taxCodes.SOFTWARE_AS_A_SERVICE,
      prices: {
        monthly: {
          amount: 0,
          currency: 'usd',
          interval: 'month',
          type: 'recurring',
          lookupKey: 'free_monthly',
        },
        yearly: {
          amount: 0,
          currency: 'usd',
          interval: 'year',
          type: 'recurring',
          lookupKey: 'free_yearly',
        },
      },
      features: [
        'aiTagSystem',
        'heatMap',
        'allPlatformsSync',
        'text',
        'storage',
        'imageCompression',
        'export',
      ],
    },
    pro: {
      name: 'Pro',
      id: 'pro',
      taxCode: taxCodes.SOFTWARE_AS_A_SERVICE,
      features: [
        'aiTagSystem',
        'heatMap',
        'allPlatformsSync',
        'text',
        'storage',
        'imageCompression',
        'export',
        'tagIcon',
        'apiAccess',
        'vectorSearch',
      ],
      prices: {
        monthly: {
          amount: 1000,
          currency: 'usd',
          interval: 'month',
          type: 'recurring',
          trialPeriodDays: 3,
          lookupKey: 'pro_monthly',
        },
        yearly: {
          amount: 7188,
          currency: 'usd',
          interval: 'year',
          type: 'recurring',
          trialPeriodDays: 3,
          lookupKey: 'pro_yearly',
        },
      },
    },
    // ... other products
  },
} satisfies PreStripedConfig;
