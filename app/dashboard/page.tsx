import { auth, signOut } from '@/auth'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import Link from 'next/link'

const prisma = new PrismaClient()

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const oggi = new Date()
  oggi.setHours(0, 0, 0, 0)
  const domani = new Date(oggi)
  domani.setDate(domani.getDate() + 1)

  const totale = await prisma.prenotazione.count()
  const checkInOggi = await prisma.prenotazione.count({
    where: { checkIn: { gte: oggi, lt: domani } },
  })
  const checkOutOggi = await prisma.prenotazione.count({
    where: { checkOut: { gte: oggi, lt: domani } },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">🏠 Gestione Ospiti</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Ciao, <strong>{session.user?.name || session.user?.email}</strong>
          </span>
          <form action={async () => {
            'use server'
            await signOut({ redirectTo: '/login' })
          }}>
            <button type="submit" className="text-sm text-red-600 hover:text-red-800 font-medium">
              Esci
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500">Prenotazioni totali</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{totale}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500">Check-in oggi</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{checkInOggi}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500">Check-out oggi</p>
            <p className="text-3xl font-bold text-orange-500 mt-1">{checkOutOggi}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/dashboard/prenotazioni" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
            <p className="text-2xl mb-2">📋</p>
            <h2 className="text-lg font-semibold text-gray-800">Prenotazioni</h2>
            <p className="text-gray-400 text-sm mt-1">Crea e gestisci le prenotazioni</p>
          </Link>

          <Link href="/dashboard/impostazioni" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
            <p className="text-2xl mb-2">⚙️</p>
            <h2 className="text-lg font-semibold text-gray-800">Impostazioni</h2>
            <p className="text-gray-400 text-sm mt-1">Configura appartamenti e codici export</p>
          </Link>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 opacity-40">
            <p className="text-2xl mb-2">👤</p>
            <h2 className="text-lg font-semibold text-gray-800">Ospiti</h2>
            <p className="text-gray-400 text-sm mt-1">Prossimamente...</p>
          </div>
        </div>
      </main>
    </div>
  )
}