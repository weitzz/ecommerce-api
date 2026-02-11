
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- 1. adicionar coluna como NULLABLE
ALTER TABLE "RefreshToken"
ADD COLUMN "jti" TEXT;

-- 2. gerar jti para registros existentes
UPDATE "RefreshToken"
SET "jti" = encode(gen_random_bytes(16), 'hex')
WHERE "jti" IS NULL;

-- 3. garantir que agora não há NULL
ALTER TABLE "RefreshToken"
ALTER COLUMN "jti" SET NOT NULL;

-- 4. criar índice UNIQUE
CREATE UNIQUE INDEX "RefreshToken_jti_key"
ON "RefreshToken"("jti");

-- 5. remover índice antigo do tokenHash (se existir)
DROP INDEX IF EXISTS "RefreshToken_tokenHash_idx";
