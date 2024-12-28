import z from '../index';

// Pagination
export const getPaginationQuerySchema = ({ pageSize }: { pageSize: number }) =>
  z.object({
    page: z.coerce
      .number({ invalid_type_error: 'Page must be a number.' })
      .positive({ message: 'Page must be greater than 0.' })
      .optional()
      .default(1)
      .describe('The page number for pagination.')
      .openapi({
        example: 1,
      }),
    pageSize: z.coerce
      .number({ invalid_type_error: 'Page size must be a number.' })
      .positive({ message: 'Page size must be greater than 0.' })
      .max(pageSize, {
        message: `Max page size is ${pageSize}.`,
      })
      .optional()
      .default(pageSize)
      .describe('The number of items per page.')
      .openapi({
        example: 50,
      }),
  });
