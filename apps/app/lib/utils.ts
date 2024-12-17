import { LaterApiError } from '@repo/error';
import {
  type Config,
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from 'unique-names-generator';

export const parseRequestBody = async (req: Request) => {
  try {
    return await req.json();
  } catch (e) {
    throw new LaterApiError({
      code: 'bad_request',
      message:
        'Invalid JSON format in request body. Please ensure the request body is a valid JSON object.',
    });
  }
};

export const generateRandomName = () => {
  const config: Config = {
    dictionaries: [adjectives, colors, animals],
    separator: ' ',
    style: 'capital',
  };

  return uniqueNamesGenerator(config);
};
