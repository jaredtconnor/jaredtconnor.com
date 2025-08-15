import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "payload"."enum_users_role" AS ENUM('admin', 'editor', 'author', 'viewer');
  CREATE TYPE "payload"."enum_users_preferences_theme" AS ENUM('auto', 'light', 'dark');
  CREATE TYPE "payload"."enum_posts_status" AS ENUM('draft', 'published', 'archived');
  CREATE TYPE "payload"."enum_pages_status" AS ENUM('draft', 'published', 'archived');
  CREATE TYPE "payload"."enum_pages_template" AS ENUM('default', 'about', 'contact', 'landing');
  CREATE TYPE "payload"."enum_projects_status" AS ENUM('draft', 'published', 'archived');
  CREATE TYPE "payload"."enum_projects_project_status" AS ENUM('in-progress', 'completed', 'ongoing', 'archived');
  CREATE TYPE "payload"."enum_bookmarks_category" AS ENUM('development', 'design', 'technology', 'business', 'personal', 'tutorial', 'article', 'tool', 'resource', 'other');
  CREATE TYPE "payload"."enum_bookmarks_status" AS ENUM('draft', 'published', 'archived');
  CREATE TYPE "payload"."enum_bookmarks_sync_status" AS ENUM('synced', 'pending', 'error', 'manual');
  CREATE TYPE "payload"."enum_nav_type" AS ENUM('page', 'url', 'path');
  CREATE TYPE "payload"."enum_social_platform" AS ENUM('github', 'linkedin', 'twitter', 'instagram', 'youtube', 'discord', 'other');
  CREATE TYPE "payload"."enum_settings_font_family" AS ENUM('inter', 'roboto', 'open-sans', 'lato', 'poppins');
  CREATE TYPE "payload"."enum_settings_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__nav_v_type" AS ENUM('page', 'url', 'path');
  CREATE TYPE "payload"."enum__social_v_platform" AS ENUM('github', 'linkedin', 'twitter', 'instagram', 'youtube', 'discord', 'other');
  CREATE TYPE "payload"."enum__settings_v_version_font_family" AS ENUM('inter', 'roboto', 'open-sans', 'lato', 'poppins');
  CREATE TYPE "payload"."enum__settings_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE IF NOT EXISTS "payload"."users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"bio" varchar,
  	"avatar_id" integer,
  	"role" "payload"."enum_users_role" DEFAULT 'author' NOT NULL,
  	"social_links_website" varchar,
  	"social_links_twitter" varchar,
  	"social_links_github" varchar,
  	"social_links_linkedin" varchar,
  	"preferences_theme" "payload"."enum_users_preferences_theme" DEFAULT 'auto',
  	"preferences_email_notifications" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"_verified" boolean,
  	"_verificationtoken" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "payload"."posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"content" jsonb NOT NULL,
  	"excerpt" varchar,
  	"featured_image_id" integer,
  	"status" "payload"."enum_posts_status" DEFAULT 'draft' NOT NULL,
  	"published_at" timestamp(3) with time zone,
  	"featured" boolean DEFAULT false,
  	"reading_time" numeric,
  	"author_id" integer NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_keywords" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload"."posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload"."pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"content" jsonb NOT NULL,
  	"excerpt" varchar,
  	"featured_image_id" integer,
  	"status" "payload"."enum_pages_status" DEFAULT 'draft' NOT NULL,
  	"template" "payload"."enum_pages_template" DEFAULT 'default',
  	"show_in_navigation" boolean DEFAULT false,
  	"navigation_order" numeric,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_keywords" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload"."projects_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"caption" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "payload"."projects_technologies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"icon" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "payload"."projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"content" jsonb,
  	"featured_image_id" integer NOT NULL,
  	"status" "payload"."enum_projects_status" DEFAULT 'draft' NOT NULL,
  	"featured" boolean DEFAULT false,
  	"project_status" "payload"."enum_projects_project_status" DEFAULT 'completed',
  	"start_date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"links_live" varchar,
  	"links_github" varchar,
  	"links_demo" varchar,
  	"links_documentation" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_keywords" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload"."projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload"."tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"color" varchar,
  	"icon" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload"."bookmarks" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"instapaper_i_d" varchar,
  	"url" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"instapaper_data_starred" boolean DEFAULT false,
  	"instapaper_data_reading_progress" numeric,
  	"instapaper_data_added_at" timestamp(3) with time zone,
  	"featured" boolean DEFAULT false,
  	"public_note" jsonb,
  	"private_note" jsonb,
  	"category" "payload"."enum_bookmarks_category",
  	"status" "payload"."enum_bookmarks_status" DEFAULT 'draft' NOT NULL,
  	"published_at" timestamp(3) with time zone,
  	"metadata_host" varchar,
  	"metadata_favicon_url" varchar,
  	"metadata_image" varchar,
  	"metadata_author" varchar,
  	"metadata_publish_date" timestamp(3) with time zone,
  	"metadata_reading_time" numeric,
  	"metadata_language" varchar,
  	"metadata_keywords" varchar,
  	"sync_status" "payload"."enum_bookmarks_sync_status" DEFAULT 'pending' NOT NULL,
  	"last_synced_at" timestamp(3) with time zone,
  	"sync_error" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_keywords" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload"."bookmarks_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload"."media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"description" varchar,
  	"credit" varchar,
  	"focal" geometry(Point),
  	"prefix" varchar DEFAULT 'development',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_tablet_url" varchar,
  	"sizes_tablet_width" numeric,
  	"sizes_tablet_height" numeric,
  	"sizes_tablet_mime_type" varchar,
  	"sizes_tablet_filesize" numeric,
  	"sizes_tablet_filename" varchar,
  	"sizes_desktop_url" varchar,
  	"sizes_desktop_width" numeric,
  	"sizes_desktop_height" numeric,
  	"sizes_desktop_mime_type" varchar,
  	"sizes_desktop_filesize" numeric,
  	"sizes_desktop_filename" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "payload"."media_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload"."payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload"."payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"posts_id" integer,
  	"pages_id" integer,
  	"projects_id" integer,
  	"tags_id" integer,
  	"bookmarks_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload"."payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload"."payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload"."payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload"."nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"type" "payload"."enum_nav_type" DEFAULT 'page',
  	"page_id" integer,
  	"url" varchar,
  	"path" varchar,
  	"new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE IF NOT EXISTS "payload"."social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "payload"."enum_social_platform",
  	"url" varchar,
  	"label" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "payload"."footer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE IF NOT EXISTS "payload"."settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'Jared Connor',
  	"site_description" varchar DEFAULT 'Personal website and digital garden of Jared Connor',
  	"site_url" varchar DEFAULT 'https://jaredtconnor.com',
  	"logo_id" integer,
  	"favicon_id" integer,
  	"email" varchar,
  	"phone" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_keywords" varchar,
  	"seo_image_id" integer,
  	"twitter_handle" varchar,
  	"copyright_text" varchar DEFAULT '© 2024 Jared Connor. All rights reserved.',
  	"footer_content" jsonb,
  	"primary_color" varchar,
  	"secondary_color" varchar,
  	"font_family" "payload"."enum_settings_font_family" DEFAULT 'inter',
  	"google_analytics_id" varchar,
  	"google_tag_manager_id" varchar,
  	"facebook_pixel_id" varchar,
  	"_status" "payload"."enum_settings_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "payload"."_nav_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"type" "payload"."enum__nav_v_type" DEFAULT 'page',
  	"page_id" integer,
  	"url" varchar,
  	"path" varchar,
  	"new_tab" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "payload"."_social_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"platform" "payload"."enum__social_v_platform",
  	"url" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "payload"."_footer_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"new_tab" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "payload"."_settings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_site_name" varchar DEFAULT 'Jared Connor',
  	"version_site_description" varchar DEFAULT 'Personal website and digital garden of Jared Connor',
  	"version_site_url" varchar DEFAULT 'https://jaredtconnor.com',
  	"version_logo_id" integer,
  	"version_favicon_id" integer,
  	"version_email" varchar,
  	"version_phone" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_keywords" varchar,
  	"version_seo_image_id" integer,
  	"version_twitter_handle" varchar,
  	"version_copyright_text" varchar DEFAULT '© 2024 Jared Connor. All rights reserved.',
  	"version_footer_content" jsonb,
  	"version_primary_color" varchar,
  	"version_secondary_color" varchar,
  	"version_font_family" "payload"."enum__settings_v_version_font_family" DEFAULT 'inter',
  	"version_google_analytics_id" varchar,
  	"version_google_tag_manager_id" varchar,
  	"version_facebook_pixel_id" varchar,
  	"version__status" "payload"."enum__settings_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  DO $$ BEGIN
   ALTER TABLE "payload"."users" ADD CONSTRAINT "users_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."posts" ADD CONSTRAINT "posts_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."posts" ADD CONSTRAINT "posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "payload"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."posts" ADD CONSTRAINT "posts_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."posts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."posts_rels" ADD CONSTRAINT "posts_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "payload"."tags"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."pages" ADD CONSTRAINT "pages_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."pages" ADD CONSTRAINT "pages_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."projects_gallery" ADD CONSTRAINT "projects_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."projects_gallery" ADD CONSTRAINT "projects_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."projects"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."projects_technologies" ADD CONSTRAINT "projects_technologies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."projects"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."projects" ADD CONSTRAINT "projects_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."projects" ADD CONSTRAINT "projects_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."projects_rels" ADD CONSTRAINT "projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."projects"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."projects_rels" ADD CONSTRAINT "projects_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "payload"."tags"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."bookmarks_rels" ADD CONSTRAINT "bookmarks_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."bookmarks"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."bookmarks_rels" ADD CONSTRAINT "bookmarks_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "payload"."tags"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."media_rels" ADD CONSTRAINT "media_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."media_rels" ADD CONSTRAINT "media_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "payload"."tags"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "payload"."posts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "payload"."projects"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "payload"."tags"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_bookmarks_fk" FOREIGN KEY ("bookmarks_id") REFERENCES "payload"."bookmarks"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "payload"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."nav" ADD CONSTRAINT "nav_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "payload"."pages"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."nav" ADD CONSTRAINT "nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."settings"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."social" ADD CONSTRAINT "social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."settings"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."footer" ADD CONSTRAINT "footer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."settings"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."settings" ADD CONSTRAINT "settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."settings" ADD CONSTRAINT "settings_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."settings" ADD CONSTRAINT "settings_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."_nav_v" ADD CONSTRAINT "_nav_v_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "payload"."pages"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."_nav_v" ADD CONSTRAINT "_nav_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."_social_v" ADD CONSTRAINT "_social_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."_footer_v" ADD CONSTRAINT "_footer_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."_settings_v" ADD CONSTRAINT "_settings_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."_settings_v" ADD CONSTRAINT "_settings_v_version_favicon_id_media_id_fk" FOREIGN KEY ("version_favicon_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload"."_settings_v" ADD CONSTRAINT "_settings_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "users_avatar_idx" ON "payload"."users" USING btree ("avatar_id");
  CREATE INDEX IF NOT EXISTS "users_updated_at_idx" ON "payload"."users" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "payload"."users" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "payload"."users" USING btree ("email");
  CREATE UNIQUE INDEX IF NOT EXISTS "posts_slug_idx" ON "payload"."posts" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "posts_featured_image_idx" ON "payload"."posts" USING btree ("featured_image_id");
  CREATE INDEX IF NOT EXISTS "posts_author_idx" ON "payload"."posts" USING btree ("author_id");
  CREATE INDEX IF NOT EXISTS "posts_seo_seo_og_image_idx" ON "payload"."posts" USING btree ("seo_og_image_id");
  CREATE INDEX IF NOT EXISTS "posts_updated_at_idx" ON "payload"."posts" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "posts_created_at_idx" ON "payload"."posts" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "posts_rels_order_idx" ON "payload"."posts_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "posts_rels_parent_idx" ON "payload"."posts_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "posts_rels_path_idx" ON "payload"."posts_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "posts_rels_tags_id_idx" ON "payload"."posts_rels" USING btree ("tags_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "pages_slug_idx" ON "payload"."pages" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "pages_featured_image_idx" ON "payload"."pages" USING btree ("featured_image_id");
  CREATE INDEX IF NOT EXISTS "pages_seo_seo_og_image_idx" ON "payload"."pages" USING btree ("seo_og_image_id");
  CREATE INDEX IF NOT EXISTS "pages_updated_at_idx" ON "payload"."pages" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "pages_created_at_idx" ON "payload"."pages" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "projects_gallery_order_idx" ON "payload"."projects_gallery" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "projects_gallery_parent_id_idx" ON "payload"."projects_gallery" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "projects_gallery_image_idx" ON "payload"."projects_gallery" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "projects_technologies_order_idx" ON "payload"."projects_technologies" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "projects_technologies_parent_id_idx" ON "payload"."projects_technologies" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "projects_slug_idx" ON "payload"."projects" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "projects_featured_image_idx" ON "payload"."projects" USING btree ("featured_image_id");
  CREATE INDEX IF NOT EXISTS "projects_seo_seo_og_image_idx" ON "payload"."projects" USING btree ("seo_og_image_id");
  CREATE INDEX IF NOT EXISTS "projects_updated_at_idx" ON "payload"."projects" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "projects_created_at_idx" ON "payload"."projects" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "projects_rels_order_idx" ON "payload"."projects_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "projects_rels_parent_idx" ON "payload"."projects_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "projects_rels_path_idx" ON "payload"."projects_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "projects_rels_tags_id_idx" ON "payload"."projects_rels" USING btree ("tags_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "tags_name_idx" ON "payload"."tags" USING btree ("name");
  CREATE UNIQUE INDEX IF NOT EXISTS "tags_slug_idx" ON "payload"."tags" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "tags_updated_at_idx" ON "payload"."tags" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "tags_created_at_idx" ON "payload"."tags" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "bookmarks_instapaper_i_d_idx" ON "payload"."bookmarks" USING btree ("instapaper_i_d");
  CREATE UNIQUE INDEX IF NOT EXISTS "bookmarks_url_idx" ON "payload"."bookmarks" USING btree ("url");
  CREATE INDEX IF NOT EXISTS "bookmarks_updated_at_idx" ON "payload"."bookmarks" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "bookmarks_created_at_idx" ON "payload"."bookmarks" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "bookmarks_rels_order_idx" ON "payload"."bookmarks_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "bookmarks_rels_parent_idx" ON "payload"."bookmarks_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "bookmarks_rels_path_idx" ON "payload"."bookmarks_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "bookmarks_rels_tags_id_idx" ON "payload"."bookmarks_rels" USING btree ("tags_id");
  CREATE INDEX IF NOT EXISTS "media_updated_at_idx" ON "payload"."media" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "media_created_at_idx" ON "payload"."media" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "media_filename_idx" ON "payload"."media" USING btree ("filename");
  CREATE INDEX IF NOT EXISTS "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "payload"."media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX IF NOT EXISTS "media_sizes_card_sizes_card_filename_idx" ON "payload"."media" USING btree ("sizes_card_filename");
  CREATE INDEX IF NOT EXISTS "media_sizes_tablet_sizes_tablet_filename_idx" ON "payload"."media" USING btree ("sizes_tablet_filename");
  CREATE INDEX IF NOT EXISTS "media_sizes_desktop_sizes_desktop_filename_idx" ON "payload"."media" USING btree ("sizes_desktop_filename");
  CREATE INDEX IF NOT EXISTS "media_rels_order_idx" ON "payload"."media_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "media_rels_parent_idx" ON "payload"."media_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "media_rels_path_idx" ON "payload"."media_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "media_rels_tags_id_idx" ON "payload"."media_rels" USING btree ("tags_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_global_slug_idx" ON "payload"."payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_updated_at_idx" ON "payload"."payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_created_at_idx" ON "payload"."payload_locked_documents" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_order_idx" ON "payload"."payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_parent_idx" ON "payload"."payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_path_idx" ON "payload"."payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_users_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_posts_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_pages_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_projects_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_tags_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("tags_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_bookmarks_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("bookmarks_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_media_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_key_idx" ON "payload"."payload_preferences" USING btree ("key");
  CREATE INDEX IF NOT EXISTS "payload_preferences_updated_at_idx" ON "payload"."payload_preferences" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_created_at_idx" ON "payload"."payload_preferences" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_order_idx" ON "payload"."payload_preferences_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_parent_idx" ON "payload"."payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_path_idx" ON "payload"."payload_preferences_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_users_id_idx" ON "payload"."payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_migrations_updated_at_idx" ON "payload"."payload_migrations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_migrations_created_at_idx" ON "payload"."payload_migrations" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "nav_order_idx" ON "payload"."nav" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "nav_parent_id_idx" ON "payload"."nav" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "nav_page_idx" ON "payload"."nav" USING btree ("page_id");
  CREATE INDEX IF NOT EXISTS "social_order_idx" ON "payload"."social" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "social_parent_id_idx" ON "payload"."social" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "footer_order_idx" ON "payload"."footer" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "footer_parent_id_idx" ON "payload"."footer" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "settings_logo_idx" ON "payload"."settings" USING btree ("logo_id");
  CREATE INDEX IF NOT EXISTS "settings_favicon_idx" ON "payload"."settings" USING btree ("favicon_id");
  CREATE INDEX IF NOT EXISTS "settings_seo_image_idx" ON "payload"."settings" USING btree ("seo_image_id");
  CREATE INDEX IF NOT EXISTS "settings__status_idx" ON "payload"."settings" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "_nav_v_order_idx" ON "payload"."_nav_v" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_nav_v_parent_id_idx" ON "payload"."_nav_v" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_nav_v_page_idx" ON "payload"."_nav_v" USING btree ("page_id");
  CREATE INDEX IF NOT EXISTS "_social_v_order_idx" ON "payload"."_social_v" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_social_v_parent_id_idx" ON "payload"."_social_v" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_footer_v_order_idx" ON "payload"."_footer_v" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_footer_v_parent_id_idx" ON "payload"."_footer_v" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_settings_v_version_version_logo_idx" ON "payload"."_settings_v" USING btree ("version_logo_id");
  CREATE INDEX IF NOT EXISTS "_settings_v_version_version_favicon_idx" ON "payload"."_settings_v" USING btree ("version_favicon_id");
  CREATE INDEX IF NOT EXISTS "_settings_v_version_version_seo_image_idx" ON "payload"."_settings_v" USING btree ("version_seo_image_id");
  CREATE INDEX IF NOT EXISTS "_settings_v_version_version__status_idx" ON "payload"."_settings_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_settings_v_created_at_idx" ON "payload"."_settings_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_settings_v_updated_at_idx" ON "payload"."_settings_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_settings_v_latest_idx" ON "payload"."_settings_v" USING btree ("latest");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "payload"."users" CASCADE;
  DROP TABLE "payload"."posts" CASCADE;
  DROP TABLE "payload"."posts_rels" CASCADE;
  DROP TABLE "payload"."pages" CASCADE;
  DROP TABLE "payload"."projects_gallery" CASCADE;
  DROP TABLE "payload"."projects_technologies" CASCADE;
  DROP TABLE "payload"."projects" CASCADE;
  DROP TABLE "payload"."projects_rels" CASCADE;
  DROP TABLE "payload"."tags" CASCADE;
  DROP TABLE "payload"."bookmarks" CASCADE;
  DROP TABLE "payload"."bookmarks_rels" CASCADE;
  DROP TABLE "payload"."media" CASCADE;
  DROP TABLE "payload"."media_rels" CASCADE;
  DROP TABLE "payload"."payload_locked_documents" CASCADE;
  DROP TABLE "payload"."payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload"."payload_preferences" CASCADE;
  DROP TABLE "payload"."payload_preferences_rels" CASCADE;
  DROP TABLE "payload"."payload_migrations" CASCADE;
  DROP TABLE "payload"."nav" CASCADE;
  DROP TABLE "payload"."social" CASCADE;
  DROP TABLE "payload"."footer" CASCADE;
  DROP TABLE "payload"."settings" CASCADE;
  DROP TABLE "payload"."_nav_v" CASCADE;
  DROP TABLE "payload"."_social_v" CASCADE;
  DROP TABLE "payload"."_footer_v" CASCADE;
  DROP TABLE "payload"."_settings_v" CASCADE;
  DROP TYPE "payload"."enum_users_role";
  DROP TYPE "payload"."enum_users_preferences_theme";
  DROP TYPE "payload"."enum_posts_status";
  DROP TYPE "payload"."enum_pages_status";
  DROP TYPE "payload"."enum_pages_template";
  DROP TYPE "payload"."enum_projects_status";
  DROP TYPE "payload"."enum_projects_project_status";
  DROP TYPE "payload"."enum_bookmarks_category";
  DROP TYPE "payload"."enum_bookmarks_status";
  DROP TYPE "payload"."enum_bookmarks_sync_status";
  DROP TYPE "payload"."enum_nav_type";
  DROP TYPE "payload"."enum_social_platform";
  DROP TYPE "payload"."enum_settings_font_family";
  DROP TYPE "payload"."enum_settings_status";
  DROP TYPE "payload"."enum__nav_v_type";
  DROP TYPE "payload"."enum__social_v_platform";
  DROP TYPE "payload"."enum__settings_v_version_font_family";
  DROP TYPE "payload"."enum__settings_v_version_status";`)
}
