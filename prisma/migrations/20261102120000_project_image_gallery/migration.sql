CREATE TABLE "project_images" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "alt" TEXT,
    "isCover" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_images_pkey" PRIMARY KEY ("id")
);

INSERT INTO "project_images" ("id", "projectId", "imageUrl", "alt", "isCover")
SELECT gen_random_uuid()::text, "id", "imageUrl", "name", true
FROM "projects"
WHERE "imageUrl" IS NOT NULL AND btrim("imageUrl") <> '';

CREATE INDEX "project_images_projectId_position_idx" ON "project_images"("projectId", "position");

ALTER TABLE "project_images"
ADD CONSTRAINT "project_images_projectId_fkey"
FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
