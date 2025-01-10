import z from '../index';

// Schema to validate the request body when updating a user
export const updateUserSchema = z.object({
  name: z.string().optional().describe('Name of the user'),
  email: z.string().optional().describe('Email of the user'),
  image: z.string().optional().describe('Avatar of the user'),
});

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  image: z.string(),
});

export const ResponseUserSchema = UserSchema.transform((user) => ({
  ...user,
}));

export const deleteTagSchema = UserSchema.pick({
  id: true,
});
