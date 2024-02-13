
import { buildConfig } from 'payload/config';
import { cloudStorage } from "@payloadcms/plugin-cloud-storage";
import { s3Adapter } from "@payloadcms/plugin-cloud-storage/s3";
import seo from "@payloadcms/plugin-seo";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { webpackBundler } from "@payloadcms/bundler-webpack";
import { slateEditor } from "@payloadcms/richtext-slate"
import { GenerateTitle } from "@payloadcms/plugin-seo/dist/types";

import path from "path";
import Categories from "./collections/Categories";
import Contents from "./collections/Contents";
import Layouts from "./collections/Layouts";
import Media from "./collections/Media";
import Pages from "./collections/Pages";
import Posts from './collections/Posts';
import Projects from './collections/Projects'
import Tags from "./collections/Tags";
import Users from "./collections/Users";

const generateTitle: GenerateTitle = ({ slug, doc }) => {
  let title = "TurboPress";
  if (slug == "pages") {
    const page = doc as any;
    return (title = `TurboPress - ${page?.title?.value}`);
  }
  return title;
};

const adapter = s3Adapter({
  config: {
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
    region: process.env.S3_REGION,
    endpoint: process.env.S3_ENDPOINT,
  },
  bucket: process.env.S3_BUCKET,
});

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL ?? "http://localhost:3000",
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
  editor: slateEditor({}),
  collections: [Categories, Contents, Layouts, Media, Pages, Projects, Posts, Tags, Users],
  typescript: {
    outputFile: path.join(__dirname, "../types", "payload.ts"),
  },
  plugins: [
    seo({
      collections: ["pages"],
      uploadsCollection: "media",
      generateTitle: generateTitle,
    }),
    cloudStorage({
      collections: {
        media: {
          adapter: adapter,
        },
      },
    }),
  ],
  //  cors: "*",
});
