-- DropIndex
DROP INDEX "public"."RefreshToken_userId_idx";

-- CreateIndex
CREATE INDEX "RefreshToken_userId_revoked_idx" ON "public"."RefreshToken"("userId", "revoked");
