import { error } from '@sveltejs/kit';
import { z } from 'zod';
import data from './data.json';

// https://www.reddit.com/r/sveltejs/comments/116k1fw/filter_supabasesveltekit_page/
// Better to do with a GET form, the load data does it for both cases

const validationSchema = z.object({
  s: z.optional(z.string().trim().min(3)),
});

export const load = async ({ url }) => {
  const s = url.searchParams.get('s');
  const formData = { s };
  // console.log(`url: [${JSON.stringify(url.searchParams.get('s'), undefined, 2)}]`);
  // console.log(`url.searchParams: [${JSON.stringify(url.search, undefined, 2)}]`);

  if (data) {
    let filtered = data.products;
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
        return { products: [], errors };
      }
      // override filter data
      // console.log(`data: [${JSON.stringify(data, undefined, 2)}]`);
      filtered = data.products.filter((e) => e.title.toLowerCase().includes(s.toLowerCase()));
    }
    return { products: filtered };
  }
  throw error(404, 'Not found');
};