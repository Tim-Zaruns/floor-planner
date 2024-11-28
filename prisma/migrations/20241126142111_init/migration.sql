-- CreateTable
CREATE TABLE "RoomPlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rooms" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "RoomPlan_pkey" PRIMARY KEY ("id")
);
