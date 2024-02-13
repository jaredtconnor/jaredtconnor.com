import type { CollectionConfig } from "payload/types";

const Media: CollectionConfig = {
  slug: "media",
  admin: {},
  access: {
    read: (): boolean => true,
    create: () => true,
    update: () => true,
  },
  upload: {
    staticURL: "/media",
    staticDir: "media",
    mimeTypes: [
      "image/*",
      "text/html",
      "application/pdf"
    ],
    disableLocalStorage: true,
    adminThumbnail: "thumbnail",
    imageSizes: [
      {
        height: 400,
        width: 400,
        crop: "center",
        name: "thumbnail",
      },
      {
        width: 900,
        height: 450,
        crop: "center",
        name: "sixteenByNineMedium",
      },
    ],
  },
  fields: [
    {
      name: "alt",
      type: "text",
    }
  ],
};

export default Media;
