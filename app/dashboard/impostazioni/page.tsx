'use client'

import { useState, useEffect } from 'react'

interface Appartamento {
  id: string
  nome: string
  cin?: string
  cir?: string
  codiceStruttura?: string
  indirizzo?: string
  note?: string
}

const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
const labelClass = "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1"

function FormAppartamento({
  iniziale,
  onSalva,
  onAnnulla,
}: {
  iniziale?: Appartamento
  onSalva: (dati: Partial<Appartamento>) => Promise<void>
  onAnnulla: () => void
}) {
  const [form, setForm] = useState({
    nome: iniziale?.nome || '',
    cin: iniziale?.cin || '',
    cir: iniziale?.cir || '',
    codiceStruttura: iniziale?.codiceStruttura || '',
    indirizzo: iniziale?.indirizzo || '',
    note: iniziale?.note || '',
  })
  const [saving, setSaving] = useState(false)
  const up = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSalva = async () => {
    if (!form.nome.trim()) { alert('Il nome è obbligatorio'); return }
    setSaving(true)
    await onSalva(form)
    setSaving(false)
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
      <div>
        <label className={labelClass}>Nome appartamento *</label>
        <input value={form.nome} onChange={e => up('nome', e.target.value)}
          className={inputClass} placeholder="Es. Appartamento A, Casa Rivalta..." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>CIN</label>
          <input value={form.cin} onChange={e => up('cin', e.target.value)}
            className={inputClass} placeholder="Es. IT020051C24VVZ5P7H" />
          <p className="text-xs text-gray-400 mt-1">Codice Identificativo Nazionale</p>
        </div>
        <div>
          <label className={labelClass}>Codice struttura Alloggiati Web</label>
          <input value={form.codiceStruttura} onChange={e => up('codiceStruttura', e.target.value)}
            className={inputClass} placeholder="Fornito dalla Questura" />
        </div>
      </div>

      <div>
        <label className={labelClass}>CIR Lombardia (Ross1000)</label>
        <input value={form.cir} onChange={e => up('cir', e.target.value)}
          className={inputClass} placeholder="Es. 020051-LNI-00003" />
        <p className="text-xs text-gray-400 mt-1">Solo se sei in Lombardia e usi il portale Ross1000</p>
      </div>

      <div>
        <label className={labelClass}>Indirizzo</label>
        <input value={form.indirizzo} onChange={e => up('indirizzo', e.target.value)}
          className={inputClass} placeholder="Es. Via Roma 1, Milano" />
      </div>

      <div>
        <label className={labelClass}>Note</label>
        <input value={form.note} onChange={e => up('note', e.target.value)}
          className={inputClass} placeholder="Note interne" />
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={onAnnulla}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100">
          Annulla
        </button>
        <button onClick={handleSalva} disabled={saving}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
          {saving ? 'Salvataggio...' : '✓ Salva'}
        </button>
      </div>
    </div>
  )
}

export default function ImpostazioniPage() {
  const [appartamenti, setAppartamenti] = useState<Appartamento[]>([])
  const [showForm, setShowForm] = useState(false)
  const [inModifica, setInModifica] = useState<Appartamento | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg); setTimeout(() => setToast(null), 3000)
  }

  async function carica() {
    const res = await fetch('/api/appartamenti')
    const data = await res.json()
    if (Array.isArray(data)) setAppartamenti(data)
  }

  useEffect(() => { carica() }, [])

  async function creaAppartamento(dati: Partial<Appartamento>) {
    const res = await fetch('/api/appartamenti', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dati),
    })
    if (res.ok) { await carica(); setShowForm(false); showToast('Appartamento creato ✓') }
    else showToast('Errore nel salvataggio')
  }

  async function aggiornaAppartamento(id: string, dati: Partial<Appartamento>) {
    const res = await fetch(`/api/appartamenti/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dati),
    })
    if (res.ok) { await carica(); setInModifica(null); showToast('Appartamento aggiornato ✓') }
    else showToast('Errore nel salvataggio')
  }

  async function eliminaAppartamento(id: string) {
    if (!confirm('Eliminare questo appartamento? Le prenotazioni esistenti non saranno eliminate.')) return
    const res = await fetch(`/api/appartamenti/${id}`, { method: 'DELETE' })
    if (res.ok) { await carica(); showToast('Appartamento eliminato') }
    else showToast('Errore: potrebbero esserci prenotazioni collegate')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: '#1c1917', color: 'white', padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 500, zIndex: 100, whiteSpace: 'nowrap' }}>
          {toast}
        </div>
      )}

      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">🏠 Gestione Ospiti</h1>
        <a href="/dashboard" className="text-sm text-blue-600 hover:text-blue-800">← Dashboard</a>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Impostazioni</h2>
            <p className="text-sm text-gray-500 mt-1">Configura i tuoi appartamenti con i dati per l'export</p>
          </div>
          {!showForm && !inModifica && (
            <button onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition text-sm">
              + Nuovo appartamento
            </button>
          )}
        </div>

        {/* Form nuovo appartamento */}
        {showForm && (
          <div className="mb-6">
            <h3 className="text-base font-semibold text-gray-700 mb-3">Nuovo appartamento</h3>
            <FormAppartamento
              onSalva={creaAppartamento}
              onAnnulla={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Lista appartamenti */}
        {appartamenti.length === 0 && !showForm ? (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-10 text-center">
            <p className="text-4xl mb-3">🏡</p>
            <h3 className="font-semibold text-gray-700 mb-1">Nessun appartamento configurato</h3>
            <p className="text-sm text-gray-400 mb-4">
              Aggiungi i tuoi appartamenti con i dati CIN e codice struttura per abilitare l'export automatico.
            </p>
            <button onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
              + Aggiungi il primo appartamento
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {appartamenti.map(app => (
              <div key={app.id}>
                {inModifica?.id === app.id ? (
                  <div>
                    <h3 className="text-base font-semibold text-gray-700 mb-3">Modifica appartamento</h3>
                    <FormAppartamento
                      iniziale={app}
                      onSalva={dati => aggiornaAppartamento(app.id, dati)}
                      onAnnulla={() => setInModifica(null)}
                    />
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800 text-base">{app.nome}</h3>
                        {app.indirizzo && <p className="text-sm text-gray-400 mt-0.5">{app.indirizzo}</p>}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setInModifica(app); setShowForm(false) }}
                          className="text-xs bg-white border border-gray-300 text-gray-600 px-2 py-1 rounded hover:border-blue-400 hover:text-blue-600 transition">
                          ✏️ Modifica
                        </button>
                        <button onClick={() => eliminaAppartamento(app.id)}
                          className="text-xs bg-white border border-red-200 text-red-500 px-2 py-1 rounded hover:bg-red-50 transition">
                          🗑 Elimina
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        { label: 'CIN', value: app.cin },
                        { label: 'Cod. struttura', value: app.codiceStruttura },
                        { label: 'CIR', value: app.cir },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-gray-50 rounded-lg px-3 py-2">
                          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{label}</p>
                          <p className="text-sm font-mono text-gray-700 mt-0.5 truncate">
                            {value || <span className="text-gray-300 font-sans">non impostato</span>}
                          </p>
                        </div>
                      ))}
                    </div>

                    {app.note && (
                      <p className="text-xs text-gray-400 mt-3">📝 {app.note}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-5">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">ℹ️ Come funziona</h4>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li>Aggiungi qui ogni appartamento con i relativi codici</li>
            <li>In fase di creazione prenotazione seleziona l'appartamento dal menu a tendina</li>
            <li>All'export, i dati CIN e codice struttura verranno presi automaticamente dall'appartamento</li>
            <li>Il <strong>CIR</strong> serve solo per il portale Ross1000 della Regione Lombardia</li>
          </ul>
        </div>
      </main>
    </div>
  )
}