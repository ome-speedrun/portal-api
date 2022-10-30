-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discord_connections" (
    "id" TEXT NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "discord_connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "user_id" UUID NOT NULL,
    "type" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "discord_roles" (
    "discord_role_id" TEXT NOT NULL,
    "type" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "discord_connections_user_id_key" ON "discord_connections"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_user_id_type_key" ON "user_roles"("user_id", "type");

-- CreateIndex
CREATE UNIQUE INDEX "discord_roles_discord_role_id_type_key" ON "discord_roles"("discord_role_id", "type");

-- AddForeignKey
ALTER TABLE "discord_connections" ADD CONSTRAINT "discord_connections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
