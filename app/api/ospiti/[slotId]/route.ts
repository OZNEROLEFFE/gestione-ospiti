import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slotId: string }> }
) {
  try {
    const { slotId } = await params
    const body = await request.json()
    const { dataNascita, ...rest } = body

    const aggiornato = await prisma.ospite.update({
      where: { slotId },
      data: {
        ...rest,
        ...(dataNascita ? { dataNascita: new Date(dataNascita) } : {}),
      },
    })
    return NextResponse.json(aggiornato)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Errore modifica ospite' }, { status: 500 })
  }
}