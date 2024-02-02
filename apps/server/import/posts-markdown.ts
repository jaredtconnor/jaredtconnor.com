import fetch from "node-fetch";
import payload from "payload";
import dotenv from "dotenv";
import path from "path";
import frontmatter from "frontmatter";
import fs from "fs";
import unified from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { remarkToSlate } from "remark-slate-transformer";
import slugify from "slugify";
import { Document } from "payload/types";

/**
 * Reads a directory of local Markdown files with frontmatter and creates Payload docs
 * in a “posts” collection, including new or fetched relationships to a “tags” collection.
 *
 * Run with `npx ts-node -T src/import/payload-import-example.ts`.
 */

// include trailing slash
const markdownDir = "../../web-astro/src/content/blog/";

process.env.PAYLOAD_CONFIG_PATH = path.resolve("src/payload.config.ts");

dotenv.config();

payload.init({
  secret: process.env.PAYLOAD_SECRET,
  mongoURL: process.env.MONGODB_URI,
  local: true,
  onInit: async () => {
    tryImport().then(() => {
      process.exit(0);
    });
  },
});

const tryImport = async (): Promise<void> => {
  const filenames = await fs.promises.readdir(path.resolve(markdownDir));

  for (let file of filenames) {
    const absolutePath = path.join(markdownDir, file);
    const fileData = await fs.promises.readFile(absolutePath);
    const parsed = frontmatter(fileData.toString());
    const slateContent = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkToSlate)
      .process(parsed.content);

    const tags = await collectTags(parsed.data.tags ?? []);

    const data = {
      title: parsed.data.title,
      slug: slugify(parsed.data.title),
      _status:
        parsed.data.hasOwnProperty("draft") && parsed.data.draft === true
          ? "draft"
          : "published",
      author: "65bb1b8879fd7ba202916a79", // cheating with Payload author ID
      publishedDate: parsed.data.pubDate,
      createdAt: parsed.data.pubDate,
      // Import Markdown content into a “blocks” field’s “text” block, which has a rich text (Slate) field
      blocks: [
        {
          blockType: "text",
          content: slateContent.result,
        },
      ],
      tags: tags,
    };

    await payload.create({
      collection: "posts",
      overrideAccess: true,
      data,
    });
  }
};

const collectTags = async (tagNames: string[]) => {
  if (tagNames.length == 0) {
    return [];
  }

  const promises = tagNames.map(async (tagName: string) => {
    let tagDoc = await getOrCreateTag(tagName);
    return tagDoc.id;
  });

  return Promise.all(promises).then(data => {
    return data;
  });
};

const getOrCreateTag = async (name: string): Promise<Document> => {
  const result = await payload.find({
    collection: "tags",
    where: {
      name: {
        equals: name,
      },
    },
  });

  if (result.totalDocs == 1) {
    return result.docs[0];
  }

  const data = {
    name,
  };

  return await payload.create({
    collection: "tags",
    overrideAccess: true,
    data,
  });
};
