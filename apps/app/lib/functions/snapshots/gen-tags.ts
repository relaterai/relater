import { env } from '@/env';
import { type CoreMessage, generateObject } from '@repo/ai';
import { genSnapshotTagsDefaultPrompt } from '@repo/ai/prompts/gen-snapshot-tags';
import {
  model as googleModel,
  provider as googleProvider,
} from '@repo/ai/providers/google';
import {
  model as openaiModel,
  provider as openaiProvider,
} from '@repo/ai/providers/openai';
import z from '@repo/zod';

const PROVIDER_MAP = {
  OPENAI: {
    model: openaiModel,
    provider: openaiProvider,
  },
  GOOGLE: {
    model: googleModel,
    provider: googleProvider,
  },
} as const;

// Select provider based on environment variable
const { model } =
  PROVIDER_MAP[env.AI_PROVIDER as keyof typeof PROVIDER_MAP] ??
  PROVIDER_MAP.GOOGLE;

export const genSnapshotTags = async (input: {
  title?: string;
  snippet?: string;
  imageUrl?: string;
  imageBase64?: string;
  tags?: string[];
}) => {
  const defaultPrompt = genSnapshotTagsDefaultPrompt(
    input.title || '',
    input.snippet || '',
    input.tags,
    'en-US'
  );

  const messages: CoreMessage[] = [];

  // only add image description request if there is no snippet and image
  if (!input.snippet && (input.imageUrl || input.imageBase64)) {
    messages.push({
      role: 'user' as const,
      content: [
        {
          type: 'text',
          text: 'Describe this image in detail for tagging purposes.',
        },
        {
          type: 'image',
          image:
            input.imageUrl || `data:image/jpeg;base64,${input.imageBase64}`,
        },
      ],
    });
  }

  // add main tags generation prompt
  messages.push({
    role: 'user' as const,
    content: defaultPrompt,
  });
  const { object } = await generateObject({
    model,
    schema: z.object({
      tags: z.object({
        existingTags: z.array(z.string()),
        suggestedTags: z.object({
          primary: z.string(),
          technical: z.array(z.string()),
          additional: z.array(z.string()),
        }),
        allTags: z.array(z.string()),
      }),
    }),
    messages,
  });

  return object;
};
