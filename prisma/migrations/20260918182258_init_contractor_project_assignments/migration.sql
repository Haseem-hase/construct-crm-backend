-- CreateEnum
CREATE TYPE "ContractorAssignmentStatus" AS ENUM ('PENDING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'TERMINATED', 'CANCELLED');

-- CreateTable
CREATE TABLE "responsibilities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "responsibilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contractor_project_assignments" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "contractorId" TEXT NOT NULL,
    "scopeDescription" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "status" "ContractorAssignmentStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contractor_project_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contractor_project_assignment_responsibilities" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "responsibilityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contractor_project_assignment_responsibilities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "responsibilities_name_key" ON "responsibilities"("name");

-- CreateIndex
CREATE INDEX "contractor_project_assignments_projectId_idx" ON "contractor_project_assignments"("projectId");

-- CreateIndex
CREATE INDEX "contractor_project_assignments_contractorId_idx" ON "contractor_project_assignments"("contractorId");

-- CreateIndex
CREATE INDEX "contractor_project_assignments_status_idx" ON "contractor_project_assignments"("status");

-- CreateIndex
CREATE UNIQUE INDEX "contractor_project_assignments_projectId_contractorId_key" ON "contractor_project_assignments"("projectId", "contractorId");

-- CreateIndex
CREATE INDEX "contractor_project_assignment_responsibilities_assignmentId_idx" ON "contractor_project_assignment_responsibilities"("assignmentId");

-- CreateIndex
CREATE INDEX "contractor_project_assignment_responsibilities_responsibili_idx" ON "contractor_project_assignment_responsibilities"("responsibilityId");

-- CreateIndex
CREATE UNIQUE INDEX "contractor_project_assignment_responsibilities_assignmentId_key" ON "contractor_project_assignment_responsibilities"("assignmentId", "responsibilityId");

-- AddForeignKey
ALTER TABLE "contractor_project_assignments" ADD CONSTRAINT "contractor_project_assignments_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contractor_project_assignments" ADD CONSTRAINT "contractor_project_assignments_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "contractors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contractor_project_assignment_responsibilities" ADD CONSTRAINT "contractor_project_assignment_responsibilities_assignmentI_fkey" FOREIGN KEY ("assignmentId") REFERENCES "contractor_project_assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contractor_project_assignment_responsibilities" ADD CONSTRAINT "contractor_project_assignment_responsibilities_responsibil_fkey" FOREIGN KEY ("responsibilityId") REFERENCES "responsibilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
