CREATE TYPE "ProjectImageKind" AS ENUM ('DESIGN', 'SITE');
CREATE TYPE "ProjectSiteStage" AS ENUM ('BEFORE_WORK', 'IN_PROGRESS', 'COMPLETED');
ALTER TABLE "project_images"
ADD COLUMN "kind" "ProjectImageKind" NOT NULL DEFAULT 'DESIGN',
ADD COLUMN "visitedAt" TIMESTAMP(3),
ADD COLUMN "siteStage" "ProjectSiteStage",
ADD COLUMN "areaSqFt" DECIMAL(12,2),
ADD COLUMN "notes" TEXT;
ALTER TABLE "project_images" ADD CONSTRAINT "project_images_area_positive" CHECK ("areaSqFt" IS NULL OR "areaSqFt" > 0);
