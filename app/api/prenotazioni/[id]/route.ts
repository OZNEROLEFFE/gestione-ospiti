import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Campi validi del model Prenotazione
const CAMPI_VALIDI = new Set([
  'nomeOspite', 'checkIn', 'checkOut', 'appartamento', 'appartamentoId',
  'note', 'numeroOspiti', 'tipoGruppo', 'alloggiatiEsportato',
  'ross1000Esportato', 'docsEliminati', 'confermata',
])

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Rimuovi campi non aggiornabili e relazioni
    const { ospiti, token, id: _id, appartamentoObj, ...tutto } = body

    // Filtra solo i campi validi del modello
    const dati: Record<string, any> = {}
    for (const [k, v] of Object.entries(tutto)) {
      if (CAMPI_VALIDI.has(k)) dati[k] = v
    }

    if (dati.checkIn) dati.checkIn = new Date(dati.checkIn)
    if (dati.checkOut) dati.checkOut = new Date(dati.checkOut)
    if (dati.numeroOspiti) dati.numeroOspiti = parseInt(dati.numeroOspiti)

    // Se viene modificato il numero ospiti, aggiungi o rimuovi slot
    if (dati.numeroOspiti) {
      const prenotazioneAttuale = await prisma.prenotazione.findUnique({
        where: { id },
        include: { ospiti: { orderBy: { createdAt: 'asc' } } },
      })

      if (prenotazioneAttuale) {
        const attuali = prenotazioneAttuale.ospiti.length
        const nuovi = dati.numeroOspiti

        if (nuovi > attuali) {
          const daAggiungere = nuovi - attuali
          await prisma.ospite.createMany({
            data: Array.from({ length: daAggiungere }, () => ({
              prenotazioneId: id,
              compilato: false,
              isCapogruppo: false,
            })),
          })
        } else if (nuovi < attuali) {
          const nonCompilati = prenotazioneAttuale.ospiti
            .filter(o => !o.compilato)
            .slice(0, attuali - nuovi)

          if (nonCompilati.length > 0) {
            await prisma.ospite.deleteMany({
              where: { slotId: { in: nonCompilati.map(o => o.slotId) } },
            })
          }

          const rimasti = attuali - nonCompilati.length
          if (rimasti > nuovi) {
            const compilatiDaRimuovere = prenotazioneAttuale.ospiti
              .filter(o => o.compilato)
              .slice(0, rimasti - nuovi)
            if (compilatiDaRimuovere.length > 0) {
              await prisma.ospite.deleteMany({
                where: { slotId: { in: compilatiDaRimuovere.map(o => o.slotId) } },
              })
            }
          }
        }
      }
    }

    const aggiornata = await prisma.prenotazione.update({
      where: { id },
      data: dati,
      include: {
        ospiti: { orderBy: { createdAt: 'asc' } },
        appartamentoObj: true,
      },
    })
    return NextResponse.json(aggiornata)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Errore aggiornamento' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.prenotazione.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Errore eliminazione' }, { status: 500 })
  }
}