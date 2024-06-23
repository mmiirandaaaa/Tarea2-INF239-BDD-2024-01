-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "clave" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Correos" (
    "id" SERIAL NOT NULL,
    "remitente_id" INTEGER NOT NULL,
    "destinatario_id" INTEGER NOT NULL,
    "asunto" TEXT,
    "cuerpo" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Correos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favoritos" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "correo_id" INTEGER NOT NULL,

    CONSTRAINT "Favoritos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bloqueados" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "usuario_bloqueado_id" INTEGER NOT NULL,

    CONSTRAINT "Bloqueados_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_key" ON "Usuario"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Favoritos_usuario_id_correo_id_key" ON "Favoritos"("usuario_id", "correo_id");

-- CreateIndex
CREATE UNIQUE INDEX "Bloqueados_usuario_id_usuario_bloqueado_id_key" ON "Bloqueados"("usuario_id", "usuario_bloqueado_id");

-- AddForeignKey
ALTER TABLE "Correos" ADD CONSTRAINT "Correos_remitente_id_fkey" FOREIGN KEY ("remitente_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Correos" ADD CONSTRAINT "Correos_destinatario_id_fkey" FOREIGN KEY ("destinatario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favoritos" ADD CONSTRAINT "Favoritos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favoritos" ADD CONSTRAINT "Favoritos_correo_id_fkey" FOREIGN KEY ("correo_id") REFERENCES "Correos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bloqueados" ADD CONSTRAINT "Bloqueados_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bloqueados" ADD CONSTRAINT "Bloqueados_usuario_bloqueado_id_fkey" FOREIGN KEY ("usuario_bloqueado_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
