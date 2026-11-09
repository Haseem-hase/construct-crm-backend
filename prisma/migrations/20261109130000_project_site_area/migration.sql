ALTER TABLE "projects" ADD COLUMN "areaSqFt" DECIMAL(12,2);
ALTER TABLE "projects" ADD CONSTRAINT "projects_area_positive" CHECK ("areaSqFt" IS NULL OR "areaSqFt" > 0);
