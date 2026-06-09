CREATE TYPE "public"."user_sex" AS ENUM('male', 'female', 'other');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "username" varchar(255) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "age" integer DEFAULT 18 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "sex" "user_sex" DEFAULT 'male' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "max_water_per_day" numeric DEFAULT '3' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "glass_volume" numeric DEFAULT '0.25' NOT NULL;