-- CreateTable
CREATE TABLE "project_labour" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "labourId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "removedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_labour_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "project_labour_projectId_idx" ON "project_labour"("projectId");

-- CreateIndex
CREATE INDEX "project_labour_labourId_idx" ON "project_labour"("labourId");

-- CreateIndex
CREATE UNIQUE INDEX "project_labour_projectId_labourId_key" ON "project_labour"("projectId", "labourId");

-- AddForeignKey
ALTER TABLE "project_labour" ADD CONSTRAINT "project_labour_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_labour" ADD CONSTRAINT "project_labour_labourId_fkey" FOREIGN KEY ("labourId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
