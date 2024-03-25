import type Post from '../interfaces/post';

export async function getPosts(): Promise<Post[]> {

  const url = new URL(`${import.meta.env.STRAPI_URL}/api/${endpoint}`);


}
