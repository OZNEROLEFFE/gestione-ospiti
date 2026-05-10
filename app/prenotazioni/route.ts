import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const prenotazioni = await prisma.prenotazione.findMany({
    orderBy: { checkIn: 'asc' },
  })
  return NextResponse.json(prenotazioni)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nomeOspite, checkIn, checkOut, appartamento, note } = body

    const prenotazione = await prisma.prenotazione.create({
      data: {
        nomeOspite,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        appartamento,
        note: note || null,
      },
    })

    return NextResponse.json(prenotazione)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Errore nel salvataggio' }, { status: 500 })
  }
}