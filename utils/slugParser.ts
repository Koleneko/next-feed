import slugify from "@sindresorhus/slugify";

export const slugParser = (slug: string) => slugify(slug);
