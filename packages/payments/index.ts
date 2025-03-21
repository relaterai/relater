import 'server-only';
import Stripe from 'stripe';
import { keys } from './keys';

const { STRIPE_SECRET_KEY } = keys();

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

export type { Stripe } from 'stripe';
