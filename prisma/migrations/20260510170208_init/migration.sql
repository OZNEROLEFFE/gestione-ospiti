-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Appartamento" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cin" TEXT,
    "cir" TEXT,
    "codiceStruttura" TEXT,
    "indirizzo" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Appartamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prenotazione" (
    "id" TEXT NOT NULL,
    "nomeOspite" TEXT NOT NULL,
    "checkIn" TIMESTAMP(3) NOT NULL,
    "checkOut" TIMESTAMP(3) NOT NULL,
    "appartamento" TEXT NOT NULL,
    "appartamentoId" TEXT,
    "note" TEXT,
    "token" TEXT NOT NULL,
    "numeroOspiti" INTEGER NOT NULL DEFAULT 1,
    "tipoGruppo" TEXT,
    "alloggiatiEsportato" TEXT,
    "ross1000Esportato" TEXT,
    "docsEliminati" TEXT,
    "confermata" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Prenotazione_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ospite" (
    "id" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,
    "prenotazioneId" TEXT NOT NULL,
    "compilato" BOOLEAN NOT NULL DEFAULT false,
    "isCapogruppo" BOOLEAN NOT NULL DEFAULT false,
    "cognome" TEXT,
    "nome" TEXT,
    "sesso" TEXT,
    "dataNascita" TIMESTAMP(3),
    "cittadinanzaTesto" TEXT,
    "comuneNascita" TEXT,
    "provinciaNascita" TEXT,
    "codiceComuneNascita" TEXT,
    "statoNascita" TEXT,
    "comuneResidenza" TEXT,
    "provinciaResidenza" TEXT,
    "codiceComuneResidenza" TEXT,
    "statoResidenza" TEXT,
    "indirizzoResidenza" TEXT,
    "capResidenza" TEXT,
    "tipoDocumento" TEXT,
    "numeroDocumento" TEXT,
    "luogoRilascio" TEXT,
    "provinciaRilascio" TEXT,
    "codiceComuneRilascio" TEXT,
    "statoRilascio" TEXT,
    "docFronte" TEXT,
    "docRetro" TEXT,
    "selfie" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ospite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Prenotazione_token_key" ON "Prenotazione"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Ospite_slotId_key" ON "Ospite"("slotId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prenotazione" ADD CONSTRAINT "Prenotazione_appartamentoId_fkey" FOREIGN KEY ("appartamentoId") REFERENCES "Appartamento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ospite" ADD CONSTRAINT "Ospite_prenotazioneId_fkey" FOREIGN KEY ("prenotazioneId") REFERENCES "Prenotazione"("id") ON DELETE CASCADE ON UPDATE CASCADE;
