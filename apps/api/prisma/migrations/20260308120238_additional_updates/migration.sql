/*
  Warnings:

  - You are about to drop the column `avatarUrl` on the `Actor` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Actor` table. All the data in the column will be lost.
  - You are about to drop the column `movieId` on the `Episode` table. All the data in the column will be lost.
  - You are about to drop the column `serverName` on the `Episode` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Episode` table. All the data in the column will be lost.
  - The `type` column on the `Movie` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Movie` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `lang` column on the `Movie` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[tmdb_people_id]` on the table `Actor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serverId,slug]` on the table `Episode` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[externalId]` on the table `Movie` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[imdbId]` on the table `Movie` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `serverId` to the `Episode` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Episode" DROP CONSTRAINT "Episode_movieId_fkey";

-- DropIndex
DROP INDEX "Actor_slug_key";

-- DropIndex
DROP INDEX "Episode_movieId_idx";

-- DropIndex
DROP INDEX "Episode_movieId_slug_idx";

-- DropIndex
DROP INDEX "Episode_movieId_type_idx";

-- AlterTable
ALTER TABLE "Actor" DROP COLUMN "avatarUrl",
DROP COLUMN "slug",
ADD COLUMN     "also_known_as" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "gender" INTEGER NOT NULL DEFAULT 2,
ADD COLUMN     "originalName" TEXT,
ADD COLUMN     "profile_path" TEXT,
ADD COLUMN     "tmdb_people_id" INTEGER;

-- AlterTable
ALTER TABLE "Episode" DROP COLUMN "movieId",
DROP COLUMN "serverName",
DROP COLUMN "type",
ADD COLUMN     "fileName" TEXT,
ADD COLUMN     "serverId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "alternativeNames" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "chieurap" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "externalId" TEXT,
ADD COLUMN     "imdbId" TEXT,
ADD COLUMN     "imdb_vote_average" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "imdb_vote_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "is_copyrigh" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lang_key" TEXT[] DEFAULT ARRAY['vs']::TEXT[],
ADD COLUMN     "lastEpisodes" JSONB,
ADD COLUMN     "notify" TEXT DEFAULT '',
ADD COLUMN     "showtimes" TEXT DEFAULT '',
ADD COLUMN     "sub_docquyen" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tmdbSeason" INTEGER,
ADD COLUMN     "tmdbType" TEXT,
ADD COLUMN     "tmdb_vote_average" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tmdb_vote_count" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'single',
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Trailer',
ALTER COLUMN "episodeCurrent" SET DEFAULT 'Trailer',
DROP COLUMN "lang",
ADD COLUMN     "lang" TEXT DEFAULT 'Vietsub';

-- AlterTable
ALTER TABLE "MovieActor" ADD COLUMN     "character" TEXT,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'Acting';

-- DropEnum
DROP TYPE "LanguageType";

-- DropEnum
DROP TYPE "MovieStatus";

-- DropEnum
DROP TYPE "MovieType";

-- CreateTable
CREATE TABLE "Server" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "movieId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isAi" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Server_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Server_movieId_idx" ON "Server"("movieId");

-- CreateIndex
CREATE UNIQUE INDEX "Server_movieId_name_key" ON "Server"("movieId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Actor_tmdb_people_id_key" ON "Actor"("tmdb_people_id");

-- CreateIndex
CREATE INDEX "Episode_serverId_slug_idx" ON "Episode"("serverId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Episode_serverId_slug_key" ON "Episode"("serverId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Movie_externalId_key" ON "Movie"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Movie_imdbId_key" ON "Movie"("imdbId");

-- CreateIndex
CREATE INDEX "Movie_externalId_idx" ON "Movie"("externalId");

-- CreateIndex
CREATE INDEX "Movie_published_type_idx" ON "Movie"("published", "type");

-- CreateIndex
CREATE INDEX "Movie_type_year_idx" ON "Movie"("type", "year");

-- AddForeignKey
ALTER TABLE "Server" ADD CONSTRAINT "Server_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Episode" ADD CONSTRAINT "Episode_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE CASCADE ON UPDATE CASCADE;
