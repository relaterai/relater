import { env } from '@repo/env';
import { Logger } from 'next-axiom';

let logger: Console = console;
if (env.NEXT_PUBLIC_AXIOM_TOKEN && env.NEXT_PUBLIC_AXIOM_DATASET) {
  logger = new Logger() as unknown as Console;
}

export const log = process.env.NODE_ENV === 'production' ? logger : console;
