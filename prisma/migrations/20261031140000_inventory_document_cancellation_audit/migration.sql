ALTER TABLE "stock_documents"
ADD COLUMN "cancelledById" TEXT,
ADD COLUMN "cancelledAt" TIMESTAMP(3);

ALTER TABLE "stock_documents"
ADD CONSTRAINT "stock_documents_cancelledById_fkey"
FOREIGN KEY ("cancelledById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "stock_documents"
DROP CONSTRAINT "stock_documents_lifecycle_actor_timestamp_check";
ALTER TABLE "stock_documents"
ADD CONSTRAINT "stock_documents_lifecycle_actor_timestamp_check"
CHECK (
  ("status" <> 'POSTED' OR ("postedById" IS NOT NULL AND "postedAt" IS NOT NULL)) AND
  ("status" <> 'REJECTED' OR ("rejectedById" IS NOT NULL AND "rejectedAt" IS NOT NULL)) AND
  ("status" <> 'CANCELLED' OR ("cancelledById" IS NOT NULL AND "cancelledAt" IS NOT NULL)) AND
  (("approvedById" IS NULL) = ("approvedAt" IS NULL))
);
