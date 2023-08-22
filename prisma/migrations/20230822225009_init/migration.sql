-- CreateTable
CREATE TABLE "WorldUser" (
    "id" BIGINT NOT NULL,
    "worldId" BIGINT NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "globalBalance" INTEGER NOT NULL DEFAULT 0,
    "lastKnownName" TEXT NOT NULL DEFAULT '?',

    CONSTRAINT "WorldUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocalUser" (
    "id" BIGINT NOT NULL,
    "discordServerId" BIGINT NOT NULL DEFAULT 0,
    "worldUserId" BIGINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "LocalUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Server" (
    "id" BIGINT NOT NULL,
    "worldId" BIGINT NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Server_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "World" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "World_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorldUser_id_key" ON "WorldUser"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Server_id_key" ON "Server"("id");

-- CreateIndex
CREATE UNIQUE INDEX "World_id_key" ON "World"("id");

-- AddForeignKey
ALTER TABLE "WorldUser" ADD CONSTRAINT "WorldUser_worldId_fkey" FOREIGN KEY ("worldId") REFERENCES "World"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocalUser" ADD CONSTRAINT "LocalUser_discordServerId_fkey" FOREIGN KEY ("discordServerId") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocalUser" ADD CONSTRAINT "LocalUser_worldUserId_fkey" FOREIGN KEY ("worldUserId") REFERENCES "WorldUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Server" ADD CONSTRAINT "Server_worldId_fkey" FOREIGN KEY ("worldId") REFERENCES "World"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
