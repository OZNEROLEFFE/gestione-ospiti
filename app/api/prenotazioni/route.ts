import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const prenotazioni = await prisma.prenotazione.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      ospiti: { orderBy: { createdAt: 'asc' } },
      appartamentoObj: true,
    },
  })
  return NextResponse.json(prenotazioni)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nomeOspite, checkIn, checkOut, appartamento, note, numeroOspiti } = body
    const n = Math.max(1, Math.min(20, parseInt(numeroOspiti) || 1))

    const prenotazione = await prisma.prenotazione.create({
      data: {
        nomeOspite,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        appartamento,
        note: note || null,
        numeroOspiti: n,
        ospiti: {
          create: Array.from({ length: n }, () => ({
            compilato: false,
            isCapogruppo: false,
          })),
        },
      },
      include: { ospiti: true },
    })
    return NextResponse.json(prenotazione)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Errore nel salvataggio' }, { status: 500 })
  }
}