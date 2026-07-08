/*
  Warnings:

  - Added the required column `provider` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `method` on the `payments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('STRIPE', 'SSLCOMMERZ');

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "provider" "PaymentProvider" NOT NULL,
DROP COLUMN "method",
ADD COLUMN     "method" TEXT NOT NULL;

-- DropEnum
DROP TYPE "PaymentMethod";
