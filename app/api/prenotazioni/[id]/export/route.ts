import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { generaFileAlloggiati, generaFileRoss1000 } from '@/lib/export-alloggiati'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get('tipo')

    const pren = await prisma.prenotazione.findUnique({
      where: { id },
      include: {
        ospiti: { orderBy: { createdAt: 'asc' } },
        appartamentoObj: true,
      },
    })

    if (!pren) {
      return NextResponse.json({ error: 'Prenotazione non trovata' }, { status: 404 })
    }



    const ospitiCompleti = pren.ospiti.filter((o) => o.compilato)
    if (ospitiCompleti.length === 0) {
      return NextResponse.json({ error: 'Nessun ospite compilato' }, { status: 400 })
    }

    const dataCheckIn = pren.checkIn.toISOString().split('T')[0].replace(/-/g, '')
    const nomeRef = pren.nomeOspite.replace(/\s+/g, '_').slice(0, 20)

    if (tipo === 'alloggiati') {
      const contenuto = generaFileAlloggiati(pren, ospitiCompleti)

      // Aggiorna timestamp export
      await prisma.prenotazione.update({
        where: { id },
        data: { alloggiatiEsportato: new Date().toISOString() },
      })

      return new NextResponse(contenuto, {
        headers: {
          'Content-Type': 'text/plain; charset=windows-1252',
          'Content-Disposition': `attachment; filename="alloggiati_${dataCheckIn}_${nomeRef}.txt"`,
        },
      })
    }

    if (tipo === 'ross1000') {
      // Cerca appartamento per nome se la relazione non è collegata
      let appartamento = pren.appartamentoObj
      if (!appartamento && pren.appartamento) {
        appartamento = await prisma.appartamento.findFirst({
          where: { nome: pren.appartamento }
        })
      }

      const contenuto = generaFileRoss1000(pren, ospitiCompleti, appartamento)

      await prisma.prenotazione.update({
        where: { id },
        data: { ross1000Esportato: new Date().toISOString() },
      })

      return new NextResponse(contenuto, {
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Content-Disposition': `attachment; filename="ross1000_${dataCheckIn}_${nomeRef}.xml"`,
        },
      })
    }

    return NextResponse.json({ error: 'Tipo non valido. Usa ?tipo=alloggiati o ?tipo=ross1000' }, { status: 400 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Errore generazione file' }, { status: 500 })
  }
}