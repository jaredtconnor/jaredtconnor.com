import { error } from '@sveltejs/kit';
import { z } from 'zod';
import { client } from '$lib/trpc';
import type { Media } from '@apps/server/src/main';

const validationSchema = z.object({
  s: z.optional(z.string().trim().min(3)),
});

export const load = async ({ url }) => {
  const s = url.searchParams.get('s');
  // const x = url.searchParams.get('s');
  const formData = { s/*, x*/ };
  const data = await client().media.query({ s });
  // console.log(`url: [${JSON.stringify(url.searchParams.get('s'), undefined, 2)}]`);
  // console.log(`url.searchParams: [${JSON.stringify(url.search, undefined, 2)}]`);

  if (data) {
    let filtered = data.docs;
    if (s) {
      // validation
      const validationData = validationSchema.safeParse(formData);
      if (!validationData.success) {
        // Loop through the errors array and create a custom errors array
        const errors = validationData.error.errors.map((error) => {
          return {
            field: error.path[0],
            message: error.message
          };
        });
        // console.log(`errors: [${JSON.stringify(errors, undefined, 2)}]`);
        return { docs: [], errors };
      }
      // override filter data
      filtered = data.docs.filter((e: Media) => e.name?.toLowerCase().includes(s.toLowerCase()));
    }
    return { docs: filtered };
  }
  throw error(404, 'Not found');
};
