import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'Token mancante' }, { status: 400 })

  const pren = await prisma.prenotazione.findUnique({
    where: { token },
    include: { ospiti: { orderBy: { createdAt: 'asc' } } },
  })
  if (!pren) return NextResponse.json({ error: 'Link non valido' }, { status: 404 })
  return NextResponse.json(pren)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { token, slotId, dataNascita, ...rest } = body

    const pren = await prisma.prenotazione.findUnique({
      where: { token },
      include: { ospiti: true },
    })
    if (!pren) return NextResponse.json({ error: 'Link non valido' }, { status: 404 })

    const slot = pren.ospiti.find(o => o.slotId === slotId)
    if (!slot) return NextResponse.json({ error: 'Slot non trovato' }, { status: 404 })

    const esisteCapo = pren.ospiti.some(o => o.isCapogruppo)
    const altriCompilati = pren.ospiti.filter(o => o.compilato && o.slotId !== slotId)
    const saraCapo = !esisteCapo && altriCompilati.length === 0

    const aggiornato = await prisma.ospite.update({
      where: { slotId },
      data: {
        compilato: true,
        isCapogruppo: saraCapo,
        dataNascita: dataNascita ? new Date(dataNascita) : null,
        ...rest,
      },
    })
    return NextResponse.json(aggiornato)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Errore nel salvataggio' }, { status: 500 })
  }
}