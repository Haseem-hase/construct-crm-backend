-- CreateEnum
CREATE TYPE "LabourAssignmentStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "labour_assignments" (
    "id" TEXT NOT NULL,
    "labourId" TEXT NOT NULL,
    "contractorProjectAssignmentId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "LabourAssignmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "labour_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "labour_assignments_labourId_idx" ON "labour_assignments"("labourId");

-- CreateIndex
CREATE INDEX "labour_assignments_contractorProjectAssignmentId_idx" ON "labour_assignments"("contractorProjectAssignmentId");

-- CreateIndex
CREATE INDEX "labour_assignments_status_idx" ON "labour_assignments"("status");

-- CreateIndex
CREATE INDEX "labour_assignments_startDate_endDate_idx" ON "labour_assignments"("startDate", "endDate");

-- AddForeignKey
ALTER TABLE "labour_assignments" ADD CONSTRAINT "labour_assignments_labourId_fkey" FOREIGN KEY ("labourId") REFERENCES "labours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "labour_assignments" ADD CONSTRAINT "labour_assignments_contractorProjectAssignmentId_fkey" FOREIGN KEY ("contractorProjectAssignmentId") REFERENCES "contractor_project_assignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
