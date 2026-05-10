import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const app = await prisma.appartamento.update({
      where: { id },
      data: body,
    })
    return NextResponse.json(app)
  } catch (e) {
    return NextResponse.json({ error: 'Errore' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.appartamento.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Errore' }, { status: 500 })
  }
}