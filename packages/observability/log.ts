import { Logger } from 'next-axiom';
import { keys } from './keys';

const { NEXT_PUBLIC_AXIOM_TOKEN, NEXT_PUBLIC_AXIOM_DATASET } = keys();

let logger: Console = console;
if (NEXT_PUBLIC_AXIOM_TOKEN && NEXT_PUBLIC_AXIOM_DATASET) {
  logger = new Logger() as unknown as Console;
}

export const log = process.env.NODE_ENV === 'production' ? logger : console;
