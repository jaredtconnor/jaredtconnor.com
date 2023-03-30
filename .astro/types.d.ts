declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	export { z } from 'astro/zod';
	export type CollectionEntry<C extends keyof typeof entryMap> =
		(typeof entryMap)[C][keyof (typeof entryMap)[C]];

	// This needs to be in sync with ImageMetadata
	export const image: () => import('astro/zod').ZodObject<{
		src: import('astro/zod').ZodString;
		width: import('astro/zod').ZodNumber;
		height: import('astro/zod').ZodNumber;
		format: import('astro/zod').ZodUnion<
			[
				import('astro/zod').ZodLiteral<'png'>,
				import('astro/zod').ZodLiteral<'jpg'>,
				import('astro/zod').ZodLiteral<'jpeg'>,
				import('astro/zod').ZodLiteral<'tiff'>,
				import('astro/zod').ZodLiteral<'webp'>,
				import('astro/zod').ZodLiteral<'gif'>,
				import('astro/zod').ZodLiteral<'svg'>
			]
		>;
	}>;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<
				import('astro/zod').AnyZodObject,
				import('astro/zod').AnyZodObject
		  >;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	type BaseCollectionConfig<S extends BaseSchema> = {
		schema?: S;
		slug?: (entry: {
			id: CollectionEntry<keyof typeof entryMap>['id'];
			defaultSlug: string;
			collection: string;
			body: string;
			data: import('astro/zod').infer<S>;
		}) => string | Promise<string>;
	};
	export function defineCollection<S extends BaseSchema>(
		input: BaseCollectionConfig<S>
	): BaseCollectionConfig<S>;

	type EntryMapKeys = keyof typeof entryMap;
	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidEntrySlug<C extends EntryMapKeys> = AllValuesOf<(typeof entryMap)[C]>['slug'];

	export function getEntryBySlug<
		C extends keyof typeof entryMap,
		E extends ValidEntrySlug<C> | (string & {})
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getCollection<C extends keyof typeof entryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof typeof entryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	type InferEntrySchema<C extends keyof typeof entryMap> = import('astro/zod').infer<
		Required<ContentConfig['collections'][C]>['schema']
	>;

	const entryMap: {
		"blog": {
"Conversations with Tyler Robin Wiblin from 80000 Hours.md": {
  id: "Conversations with Tyler Robin Wiblin from 80000 Hours.md",
  slug: "conversations-with-tyler-robin-wiblin-from-80000-hours",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] },
"First-of-many.md": {
  id: "First-of-many.md",
  slug: "first-of-many",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] },
"Heads or Tails Experiment.md": {
  id: "Heads or Tails Experiment.md",
  slug: "heads-or-tails-experiment",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] },
"Housing-Price-Analysis.md": {
  id: "Housing-Price-Analysis.md",
  slug: "housing-price-analysis",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] },
"Increasing_Student_Debt_Loads.md": {
  id: "Increasing_Student_Debt_Loads.md",
  slug: "increasing_student_debt_loads",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] },
"Interactive Exploration of Dead End Careers.md": {
  id: "Interactive Exploration of Dead End Careers.md",
  slug: "interactive-exploration-of-dead-end-careers",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] },
"Kierkegaard on busyness.md": {
  id: "Kierkegaard on busyness.md",
  slug: "kierkegaard-on-busyness",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] },
"Predict Economic Indicators with OpenStreetMap.md": {
  id: "Predict Economic Indicators with OpenStreetMap.md",
  slug: "predict-economic-indicators-with-openstreetmap",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] },
"Questions_about_economics.md": {
  id: "Questions_about_economics.md",
  slug: "questions_about_economics",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] },
"Reed students validate college ranking.md": {
  id: "Reed students validate college ranking.md",
  slug: "reed-students-validate-college-ranking",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] },
"Student_Loans_Are_Making_it_harder.md": {
  id: "Student_Loans_Are_Making_it_harder.md",
  slug: "student_loans_are_making_it_harder",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] },
"The Marvel of the Human Dad.md": {
  id: "The Marvel of the Human Dad.md",
  slug: "the-marvel-of-the-human-dad",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] },
"The United States is Risking Their Position in the Global Financial System.md": {
  id: "The United States is Risking Their Position in the Global Financial System.md",
  slug: "the-united-states-is-risking-their-position-in-the-global-financial-system",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] },
"Thoughts_On_MMT.md": {
  id: "Thoughts_On_MMT.md",
  slug: "thoughts_on_mmt",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] },
"Visa Buyout of Plaid.md": {
  id: "Visa Buyout of Plaid.md",
  slug: "visa-buyout-of-plaid",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] },
"first-post.md": {
  id: "first-post.md",
  slug: "first-post",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] },
"installing-node-on-linux-via-wsl.md": {
  id: "installing-node-on-linux-via-wsl.md",
  slug: "installing-node-on-linux-via-wsl",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] },
"markdown-style-guide.md": {
  id: "markdown-style-guide.md",
  slug: "markdown-style-guide",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] },
"object_oriented_programming.md": {
  id: "object_oriented_programming.md",
  slug: "object_oriented_programming",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] },
"second-post.md": {
  id: "second-post.md",
  slug: "second-post",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] },
"third-post.md": {
  id: "third-post.md",
  slug: "third-post",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] },
},

	};

	type ContentConfig = typeof import("../src/content/config");
}
