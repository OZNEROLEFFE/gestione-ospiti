import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const appartamenti = await prisma.appartamento.findMany({
    orderBy: { nome: 'asc' },
  })
  return NextResponse.json(appartamenti)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nome, cin, cir, codiceStruttura, indirizzo, note } = body
    if (!nome?.trim()) return NextResponse.json({ error: 'Nome obbligatorio' }, { status: 400 })
    const app = await prisma.appartamento.create({
      data: { nome: nome.trim(), cin, cir, codiceStruttura, indirizzo, note },
    })
    return NextResponse.json(app)
  } catch (e) {
    return NextResponse.json({ error: 'Errore' }, { status: 500 })
  }
}