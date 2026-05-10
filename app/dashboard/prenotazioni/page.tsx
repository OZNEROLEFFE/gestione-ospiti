'use client'

import { useState, useEffect, useRef } from 'react'
import { STATI } from '@/lib/stati-data'

interface Comune { nome: string; codice: string; prov: string }
interface Appartamento { id: string; nome: string }

interface Ospite {
  slotId: string
  compilato: boolean
  isCapogruppo: boolean
  cognome?: string
  nome?: string
  sesso?: string
  dataNascita?: string
  cittadinanzaTesto?: string
  comuneNascita?: string
  provinciaNascita?: string
  codiceComuneNascita?: string
  statoNascita?: string
  comuneResidenza?: string
  provinciaResidenza?: string
  codiceComuneResidenza?: string
  statoResidenza?: string
  tipoDocumento?: string
  numeroDocumento?: string
  luogoRilascio?: string
  provinciaRilascio?: string
  codiceComuneRilascio?: string
  statoRilascio?: string
  docFronte?: string | null
  docRetro?: string | null
  selfie?: string | null
}

interface Prenotazione {
  id: string
  nomeOspite: string
  checkIn: string
  checkOut: string
  appartamento: string
  note?: string
  token: string
  numeroOspiti: number
  tipoGruppo?: string | null
  confermata?: boolean
  alloggiatiEsportato?: string | null
  ospiti: Ospite[]
}

const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
const labelClass = "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1"

const PER_PAGINA = 10

// ── SelectStato ───────────────────────────────────────────
function SelectStato({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select value={value || ''} onChange={e => onChange(e.target.value)} className={inputClass}>
      <option value="">-- Seleziona stato --</option>
      {STATI.map(s => <option key={s.codice} value={s.nome}>{s.nome}</option>)}
    </select>
  )
}

// ── ComboboxComune ────────────────────────────────────────
function ComboboxComune({ value, onChange }: { value: string; onChange: (c: Comune | null) => void }) {
  const [query, setQuery] = useState(value || '')
  const [open, setOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<Comune[]>([])
  const [highlighted, setHighlighted] = useState(0)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setQuery(value || '') }, [value])
  useEffect(() => {
    const fn = (e: MouseEvent) => { if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', fn); return () => document.removeEventListener('mousedown', fn)
  }, [])
  useEffect(() => {
    if (!query || query.length < 2) { setSuggestions([]); return }
    const t = setTimeout(async () => {
      try { const r = await fetch(`/api/comuni?q=${encodeURIComponent(query)}`); setSuggestions(await r.json()) }
      catch { setSuggestions([]) }
    }, 200)
    return () => clearTimeout(t)
  }, [query])

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <input type="text" value={query} placeholder="Inizia a scrivere il comune..."
        onChange={e => { setQuery(e.target.value); setOpen(true); setHighlighted(0); if (!e.target.value) onChange(null) }}
        onFocus={() => { if (query.length >= 2) setOpen(true) }}
        onKeyDown={e => {
          if (!open || !suggestions.length) return
          if (e.key === 'ArrowDown') { e.preventDefault(); setHighlighted(h => Math.min(h + 1, suggestions.length - 1)) }
          else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlighted(h => Math.max(h - 1, 0)) }
          else if (e.key === 'Enter') { e.preventDefault(); const s = suggestions[highlighted]; if (s) { setQuery(s.nome); onChange(s); setOpen(false) } }
          else if (e.key === 'Escape') setOpen(false)
        }}
        autoComplete="off" className={inputClass} />
      {open && suggestions.length > 0 && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: 'white', border: '1px solid #d1d5db', borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', zIndex: 200, maxHeight: 220, overflowY: 'auto' }}>
          {suggestions.map((s, i) => (
            <button key={s.codice} onMouseDown={e => { e.preventDefault(); setQuery(s.nome); onChange(s); setOpen(false) }} onMouseEnter={() => setHighlighted(i)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '9px 14px', background: i === highlighted ? '#f3f4f6' : 'white', border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', textAlign: 'left' }}>
              <span style={{ fontWeight: 500, color: '#111827' }}>{s.nome}</span>
              <span style={{ fontSize: 11, color: '#9ca3af', background: '#f3f4f6', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>{s.prov}</span>
            </button>
          ))}
        </div>
      )}
      {open && query.length >= 2 && suggestions.length === 0 && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: 'white', border: '1px solid #d1d5db', borderRadius: 8, zIndex: 200 }}>
          <div style={{ padding: 12, color: '#9ca3af', fontSize: 13, textAlign: 'center' }}>Nessun comune trovato</div>
        </div>
      )}
    </div>
  )
}

// ── Modale RIEPILOGO ospite ───────────────────────────────
function ModaleRiepilogo({ ospite, numero, onChiudi }: { ospite: Ospite; numero: number; onChiudi: () => void }) {
  const [foto, setFoto] = useState<string | null>(null)

  function tipoDocLabel(t?: string) {
    return { IDENT: "Carta d'identità", IDELE: 'C.I. elettronica', PASOR: 'Passaporto' }[t || ''] || t || '—'
  }

  const Row = ({ label, value }: { label: string; value?: string | null }) => (
    <div className="flex gap-3 py-2 border-b border-gray-50 last:border-0">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-36 flex-shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-gray-800 font-medium">{value || '—'}</span>
    </div>
  )

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 50, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '20px 16px', overflowY: 'auto' }}>
      <div style={{ background: 'white', borderRadius: 16, width: '100%', maxWidth: 600, marginTop: 20, marginBottom: 20, overflow: 'hidden' }}>
        <div style={{ background: '#1c1917', color: 'white', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 11, color: '#c89b4a', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 2px' }}>Ospite {numero}</p>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 20, margin: 0, fontWeight: 500 }}>
              {ospite.cognome} {ospite.nome} {ospite.isCapogruppo ? '👑' : ''}
            </h3>
          </div>
          <button onClick={onChiudi} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>
        <div style={{ padding: 24 }}>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 pb-1 border-b border-gray-200">Dati anagrafici</p>
          <div className="mb-4">
            <Row label="Cognome" value={ospite.cognome} />
            <Row label="Nome" value={ospite.nome} />
            <Row label="Sesso" value={ospite.sesso === 'M' ? 'Maschio' : ospite.sesso === 'F' ? 'Femmina' : ospite.sesso} />
            <Row label="Data di nascita" value={ospite.dataNascita ? new Date(ospite.dataNascita).toLocaleDateString('it-IT') : undefined} />
            <Row label="Cittadinanza" value={ospite.cittadinanzaTesto} />
            <Row label="Comune nascita" value={ospite.comuneNascita ? `${ospite.comuneNascita}${ospite.provinciaNascita ? ` (${ospite.provinciaNascita})` : ''}` : undefined} />
            <Row label="Stato nascita" value={ospite.statoNascita} />
          </div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 pb-1 border-b border-gray-200">Residenza</p>
          <div className="mb-4">
            <Row label="Stato" value={ospite.statoResidenza} />
            <Row label="Comune" value={ospite.comuneResidenza ? `${ospite.comuneResidenza}${ospite.provinciaResidenza ? ` (${ospite.provinciaResidenza})` : ''}` : undefined} />
          </div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 pb-1 border-b border-gray-200">Documento</p>
          <div className="mb-4">
            <Row label="Tipo" value={tipoDocLabel(ospite.tipoDocumento)} />
            <Row label="Numero" value={ospite.numeroDocumento} />
            <Row label="Rilasciato da" value={ospite.luogoRilascio ? `${ospite.luogoRilascio}${ospite.provinciaRilascio ? ` (${ospite.provinciaRilascio})` : ''} — ${ospite.statoRilascio || ''}` : ospite.statoRilascio} />
          </div>
          {(ospite.docFronte || ospite.docRetro || ospite.selfie) && (
            <>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 pb-1 border-b border-gray-200">Foto documento e selfie</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {[{ label: 'Fronte', src: ospite.docFronte }, { label: 'Retro', src: ospite.docRetro }, { label: 'Selfie', src: ospite.selfie }]
                  .filter(f => f.src).map(f => (
                  <button key={f.label} onClick={() => setFoto(f.src!)}
                    style={{ border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden', cursor: 'zoom-in', padding: 0, background: '#f9fafb' }}>
                    <img src={f.src!} alt={f.label} style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }} />
                    <p style={{ margin: 0, padding: '6px 0', fontSize: 11, fontWeight: 600, color: '#6b7280', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}</p>
                  </button>
                ))}
              </div>
            </>
          )}
          {!ospite.docFronte && !ospite.docRetro && !ospite.selfie && (
            <div className="text-sm text-gray-400 italic">Nessuna foto caricata (o già eliminate)</div>
          )}
        </div>
        <div style={{ padding: '0 24px 24px' }}>
          <button onClick={onChiudi} className="w-full py-2 rounded-lg border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50">Chiudi</button>
        </div>
      </div>
      {foto && (
        <div onClick={() => setFoto(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, cursor: 'zoom-out' }}>
          <img src={foto} alt="Documento" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 8 }} onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  )
}

// ── Modale modifica PRENOTAZIONE ──────────────────────────
function ModaleModificaPren({ pren, onSalva, onChiudi, appartamenti }: {
  pren: Prenotazione; onSalva: (id: string, dati: any) => Promise<void>; onChiudi: () => void; appartamenti: Appartamento[]
}) {
  const toLocal = (iso: string) => {
    if (!iso) return ''
    const d = new Date(iso)
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
  }
  const [form, setForm] = useState({
    nomeOspite: pren.nomeOspite, appartamento: pren.appartamento,
    checkIn: toLocal(pren.checkIn), checkOut: toLocal(pren.checkOut),
    numeroOspiti: pren.numeroOspiti, note: pren.note || '',
  })
  const [saving, setSaving] = useState(false)

  const handleSalva = async () => {
    setSaving(true)
    await onSalva(pren.id, { ...form, checkIn: new Date(form.checkIn).toISOString(), checkOut: new Date(form.checkOut).toISOString(), numeroOspiti: Number(form.numeroOspiti) })
    setSaving(false); onChiudi()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '20px 16px', overflowY: 'auto' }}>
      <div style={{ background: 'white', borderRadius: 16, padding: 24, width: '100%', maxWidth: 520, marginTop: 20 }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">✏️ Modifica prenotazione</h3>
          <button onClick={onChiudi} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>
        <div className="space-y-3">
          <div><label className={labelClass}>Nome ospite (referente)</label><input value={form.nomeOspite} onChange={e => setForm(f => ({ ...f, nomeOspite: e.target.value }))} className={inputClass} /></div>
          <div>
            <label className={labelClass}>Appartamento</label>
            <select value={form.appartamento} onChange={e => setForm(f => ({ ...f, appartamento: e.target.value }))} className={inputClass}>
              <option value="">-- Seleziona appartamento --</option>
              {appartamenti.map(a => <option key={a.id} value={a.nome}>{a.nome}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelClass}>Check-in</label><input type="datetime-local" value={form.checkIn} onChange={e => setForm(f => ({ ...f, checkIn: e.target.value }))} className={inputClass} /></div>
            <div><label className={labelClass}>Check-out</label><input type="datetime-local" value={form.checkOut} onChange={e => setForm(f => ({ ...f, checkOut: e.target.value }))} className={inputClass} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelClass}>Numero ospiti</label><input type="number" min="1" max="20" value={form.numeroOspiti} onChange={e => setForm(f => ({ ...f, numeroOspiti: parseInt(e.target.value) || 1 }))} className={inputClass} /></div>
            <div><label className={labelClass}>Note</label><input value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} className={inputClass} placeholder="Opzionale" /></div>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onChiudi} className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50">Annulla</button>
          <button onClick={handleSalva} disabled={saving} className="flex-1 py-2 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 disabled:opacity-50">{saving ? 'Salvataggio...' : '✓ Salva'}</button>
        </div>
      </div>
    </div>
  )
}

// ── Modale modifica OSPITE ────────────────────────────────
function ModaleModificaOspite({ ospite, onSalva, onChiudi }: {
  ospite: Ospite; onSalva: (slotId: string, dati: any) => Promise<void>; onChiudi: () => void
}) {
  const [form, setForm] = useState({
    cognome: ospite.cognome || '', nome: ospite.nome || '', sesso: ospite.sesso || 'M',
    dataNascita: ospite.dataNascita ? ospite.dataNascita.split('T')[0] : '',
    cittadinanzaTesto: ospite.cittadinanzaTesto || 'ITALIA',
    comuneNascita: ospite.comuneNascita || '', provinciaNascita: ospite.provinciaNascita || '', codiceComuneNascita: ospite.codiceComuneNascita || '',
    statoNascita: ospite.statoNascita || '',
    comuneResidenza: ospite.comuneResidenza || '', provinciaResidenza: ospite.provinciaResidenza || '', codiceComuneResidenza: ospite.codiceComuneResidenza || '',
    statoResidenza: ospite.statoResidenza || 'ITALIA',
    tipoDocumento: ospite.tipoDocumento || '', numeroDocumento: ospite.numeroDocumento || '',
    luogoRilascio: ospite.luogoRilascio || '', provinciaRilascio: ospite.provinciaRilascio || '', codiceComuneRilascio: ospite.codiceComuneRilascio || '',
    statoRilascio: ospite.statoRilascio || 'ITALIA',
  })
  const [saving, setSaving] = useState(false)
  const up = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  const isItaliano = form.cittadinanzaTesto.toUpperCase() === 'ITALIA'
  const natoInItalia = isItaliano || form.statoNascita.toUpperCase() === 'ITALIA'
  const residenzaItalia = (form.statoResidenza || 'ITALIA').toUpperCase() === 'ITALIA'
  const rilascioItalia = (form.statoRilascio || 'ITALIA').toUpperCase() === 'ITALIA'

  const handleSalva = async () => {
    setSaving(true)
    await onSalva(ospite.slotId, { ...form, cognome: form.cognome.toUpperCase().trim(), nome: form.nome.toUpperCase().trim() })
    setSaving(false); onChiudi()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '20px 16px', overflowY: 'auto' }}>
      <div style={{ background: 'white', borderRadius: 16, padding: 24, width: '100%', maxWidth: 580, marginTop: 20, marginBottom: 20 }}>
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold text-gray-800">✏️ Modifica ospite</h3>
          <button onClick={onChiudi} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 pb-1 border-b border-gray-100">Dati anagrafici</p>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div><label className={labelClass}>Cognome</label><input value={form.cognome} onChange={e => up('cognome', e.target.value)} className={inputClass} /></div>
          <div><label className={labelClass}>Nome</label><input value={form.nome} onChange={e => up('nome', e.target.value)} className={inputClass} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className={labelClass}>Sesso</label>
            <select value={form.sesso} onChange={e => up('sesso', e.target.value)} className={inputClass}>
              <option value="M">Maschio</option><option value="F">Femmina</option>
            </select>
          </div>
          <div><label className={labelClass}>Data di nascita</label><input type="date" value={form.dataNascita} onChange={e => up('dataNascita', e.target.value)} className={inputClass} /></div>
        </div>
        <div className="mb-3">
          <label className={labelClass}>Cittadinanza</label>
          <SelectStato value={form.cittadinanzaTesto} onChange={v => up('cittadinanzaTesto', v)} />
        </div>
        {!isItaliano && (
          <div className="mb-3">
            <label className={labelClass}>Stato di nascita</label>
            <SelectStato value={form.statoNascita} onChange={v => { up('statoNascita', v); up('comuneNascita', ''); up('provinciaNascita', ''); up('codiceComuneNascita', '') }} />
          </div>
        )}
        {natoInItalia && (
          <div className="mb-3">
            <label className={labelClass}>Comune di nascita</label>
            <ComboboxComune value={form.comuneNascita} onChange={c => { if (c) { up('comuneNascita', c.nome); up('provinciaNascita', c.prov); up('codiceComuneNascita', c.codice) } else { up('comuneNascita', ''); up('provinciaNascita', ''); up('codiceComuneNascita', '') } }} />
          </div>
        )}
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 pb-1 border-b border-gray-100 mt-4">Residenza</p>
        <div className="mb-3">
          <label className={labelClass}>Stato di residenza</label>
          <SelectStato value={form.statoResidenza} onChange={v => { up('statoResidenza', v); up('comuneResidenza', ''); up('provinciaResidenza', ''); up('codiceComuneResidenza', '') }} />
        </div>
        <div className="mb-3">
          {residenzaItalia ? (
            <><label className={labelClass}>Comune di residenza</label>
            <ComboboxComune value={form.comuneResidenza} onChange={c => { if (c) { up('comuneResidenza', c.nome); up('provinciaResidenza', c.prov); up('codiceComuneResidenza', c.codice) } else { up('comuneResidenza', ''); up('provinciaResidenza', ''); up('codiceComuneResidenza', '') } }} /></>
          ) : (
            <><label className={labelClass}>Città</label><input value={form.comuneResidenza} onChange={e => up('comuneResidenza', e.target.value)} className={inputClass} /></>
          )}
        </div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 pb-1 border-b border-gray-100 mt-4">Documento</p>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className={labelClass}>Tipo documento</label>
            <select value={form.tipoDocumento} onChange={e => up('tipoDocumento', e.target.value)} className={inputClass}>
              <option value="">--</option>
              <option value="IDENT">Carta d'identità</option>
              <option value="IDELE">C.I. elettronica</option>
              <option value="PASOR">Passaporto</option>
            </select>
          </div>
          <div><label className={labelClass}>Numero documento</label><input value={form.numeroDocumento} onChange={e => up('numeroDocumento', e.target.value)} className={inputClass} /></div>
        </div>
        <div className="mb-3">
          <label className={labelClass}>Stato di rilascio</label>
          <SelectStato value={form.statoRilascio} onChange={v => { up('statoRilascio', v); up('luogoRilascio', ''); up('provinciaRilascio', ''); up('codiceComuneRilascio', '') }} />
        </div>
        <div className="mb-5">
          {rilascioItalia ? (
            <><label className={labelClass}>Comune di rilascio</label>
            <ComboboxComune value={form.luogoRilascio} onChange={c => { if (c) { up('luogoRilascio', c.nome); up('provinciaRilascio', c.prov); up('codiceComuneRilascio', c.codice) } else { up('luogoRilascio', ''); up('provinciaRilascio', ''); up('codiceComuneRilascio', '') } }} /></>
          ) : (
            <><label className={labelClass}>Luogo di rilascio</label><input value={form.luogoRilascio} onChange={e => up('luogoRilascio', e.target.value)} className={inputClass} placeholder="Es. PARIS, BERLIN..." /></>
          )}
        </div>
        <div className="flex gap-3">
          <button onClick={onChiudi} className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50">Annulla</button>
          <button onClick={handleSalva} disabled={saving} className="flex-1 py-2 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 disabled:opacity-50">{saving ? 'Salvataggio...' : '✓ Salva modifiche'}</button>
        </div>
      </div>
    </div>
  )
}

// ── Pagina principale ─────────────────────────────────────
export default function PrenotazioniPage() {
  const [prenotazioni, setPrenotazioni] = useState<Prenotazione[]>([])
  const [appartamenti, setAppartamenti] = useState<Appartamento[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errore, setErrore] = useState('')
  const [copiato, setCopiato] = useState<string | null>(null)
  const [prenInModifica, setPrenInModifica] = useState<Prenotazione | null>(null)
  const [ospiteInModifica, setOspiteInModifica] = useState<Ospite | null>(null)
  const [riepilogoOspite, setRiepilogoOspite] = useState<{ ospite: Ospite; numero: number } | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [cerca, setCerca] = useState('')
  const [pagina, setPagina] = useState(1)
  const [form, setForm] = useState({
    nomeOspite: '', checkIn: '', checkOut: '', appartamento: '', note: '', numeroOspiti: 1,
  })

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  async function caricaPrenotazioni() {
    try {
      const res = await fetch('/api/prenotazioni')
      const data = await res.json()
      if (Array.isArray(data)) setPrenotazioni(data)
    } catch (e) { console.error(e) }
  }

  useEffect(() => {
    caricaPrenotazioni()
    fetch('/api/appartamenti').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setAppartamenti(data)
    })
  }, [])

  // Reset pagina quando cambia la ricerca
  useEffect(() => { setPagina(1) }, [cerca])

  // Filtra per ricerca
  const prenotazioniFiltrate = prenotazioni.filter(p => {
    if (!cerca.trim()) return true
    const q = cerca.toLowerCase()
    return (
      p.nomeOspite?.toLowerCase().includes(q) ||
      p.appartamento?.toLowerCase().includes(q) ||
      p.ospiti?.some(o => `${o.cognome} ${o.nome}`.toLowerCase().includes(q))
    )
  })

  // Paginazione
  const totPagine = Math.ceil(prenotazioniFiltrate.length / PER_PAGINA)
  const prenotazionePagina = prenotazioniFiltrate.slice((pagina - 1) * PER_PAGINA, pagina * PER_PAGINA)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setErrore('')
    try {
      const res = await fetch('/api/prenotazioni', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, checkIn: form.checkIn ? new Date(form.checkIn).toISOString() : '', checkOut: form.checkOut ? new Date(form.checkOut).toISOString() : '' }),
      })
      if (!res.ok) { const err = await res.json(); setErrore(err.error || 'Errore'); setLoading(false); return }
      setForm({ nomeOspite: '', checkIn: '', checkOut: '', appartamento: '', note: '', numeroOspiti: 1 })
      setShowForm(false); await caricaPrenotazioni(); showToast('Prenotazione creata ✓')
    } catch { setErrore('Errore di connessione') }
    setLoading(false)
  }

  async function salvaPren(id: string, dati: any) {
    const res = await fetch(`/api/prenotazioni/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dati) })
    if (res.ok) { await caricaPrenotazioni(); showToast('Prenotazione aggiornata ✓') } else showToast('Errore nel salvataggio')
  }

  async function eliminaPrenotazione(id: string) {
    if (!confirm('Eliminare questa prenotazione e tutti i dati degli ospiti? Azione irreversibile.')) return
    const res = await fetch(`/api/prenotazioni/${id}`, { method: 'DELETE' })
    if (res.ok) { setPrenotazioni(prev => prev.filter(p => p.id !== id)); showToast('Prenotazione eliminata') }
  }

  async function toggleConfermata(id: string, attuale: boolean) {
    const res = await fetch(`/api/prenotazioni/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ confermata: !attuale }),
    })
    if (res.ok) {
      setPrenotazioni(prev => prev.map(p => p.id === id ? { ...p, confermata: !attuale } : p))
      showToast(!attuale ? '✅ Prenotazione confermata' : 'Conferma rimossa')
    }
  }

  async function aggiornaTipoGruppo(id: string, tipo: string) {
    const res = await fetch(`/api/prenotazioni/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tipoGruppo: tipo }) })
    if (res.ok) { setPrenotazioni(prev => prev.map(p => p.id === id ? { ...p, tipoGruppo: tipo } : p)); showToast(`Tipo: ${tipo}`) }
  }

  async function salvaModificaOspite(slotId: string, dati: any) {
    const res = await fetch(`/api/ospiti/${slotId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dati) })
    if (res.ok) { await caricaPrenotazioni(); showToast('Ospite aggiornato ✓') } else showToast('Errore nel salvataggio')
  }

  async function eliminaFotoOspite(slotId: string) {
    if (!confirm('Eliminare foto documento e selfie? Azione irreversibile.')) return
    const res = await fetch(`/api/ospiti/${slotId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ docFronte: null, docRetro: null, selfie: null }) })
    if (res.ok) { await caricaPrenotazioni(); showToast('Foto eliminate ✓') }
  }
async function eliminaDocumentiPrenotazione(p: Prenotazione) {
  const ospitiConFoto = p.ospiti.filter(o => o.docFronte || o.docRetro || o.selfie)
  if (ospitiConFoto.length === 0) { showToast('Nessuna foto da eliminare'); return }
  if (!confirm(`Eliminare DEFINITIVAMENTE tutte le foto di ${ospitiConFoto.length} ospiti? I dati testuali resteranno. Azione irreversibile.`)) return
  for (const o of ospitiConFoto) {
    await fetch(`/api/ospiti/${o.slotId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ docFronte: null, docRetro: null, selfie: null }),
    })
  }
  await fetch(`/api/prenotazioni/${p.id}`, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ docsEliminati: new Date().toISOString() }),
  })
  await caricaPrenotazioni()
  showToast('🛡️ Foto eliminate, dati testuali conservati')
}
  async function esportaFile(id: string, tipo: 'alloggiati' | 'ross1000') {
    const res = await fetch(`/api/prenotazioni/${id}/export?tipo=${tipo}`)
    if (!res.ok) { const err = await res.json(); showToast(`Errore: ${err.error}`); return }
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = res.headers.get('Content-Disposition')?.split('filename="')[1]?.replace('"', '') || `export_${tipo}.txt`
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
    URL.revokeObjectURL(url)
    await caricaPrenotazioni()
    showToast(`File ${tipo === 'alloggiati' ? 'Alloggiati Web' : 'Ross1000'} scaricato ✓`)
  }

  function formatDatetime(iso: string) {
    if (!iso) return ''
    const d = new Date(iso)
    return d.toLocaleDateString('it-IT') + ' ' + d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
  }

  function getLinkOspite(token: string) { return `${window.location.origin}/ospite?token=${token}` }

  async function copiaLink(token: string) {
    await navigator.clipboard.writeText(getLinkOspite(token))
    setCopiato(token); setTimeout(() => setCopiato(null), 2000)
  }

  function tipoDocLabel(t?: string) {
    return { IDENT: 'C.I.', IDELE: 'C.I. elettronica', PASOR: 'Passaporto' }[t || ''] || t || ''
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {prenInModifica && <ModaleModificaPren pren={prenInModifica} onSalva={salvaPren} onChiudi={() => setPrenInModifica(null)} appartamenti={appartamenti} />}
      {ospiteInModifica && <ModaleModificaOspite ospite={ospiteInModifica} onSalva={salvaModificaOspite} onChiudi={() => setOspiteInModifica(null)} />}
      {riepilogoOspite && <ModaleRiepilogo ospite={riepilogoOspite.ospite} numero={riepilogoOspite.numero} onChiudi={() => setRiepilogoOspite(null)} />}

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: '#1c1917', color: 'white', padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 500, zIndex: 100, whiteSpace: 'nowrap' }}>
          {toast}
        </div>
      )}

      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">🏠 Gestione Ospiti</h1>
        <a href="/dashboard" className="text-sm text-blue-600 hover:text-blue-800">← Dashboard</a>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Prenotazioni</h2>
          <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition text-sm">
            + Nuova prenotazione
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Nuova prenotazione</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className={labelClass}>Nome ospite (referente) *</label><input type="text" value={form.nomeOspite} onChange={e => setForm({ ...form, nomeOspite: e.target.value })} className={inputClass} placeholder="Es. Mario Rossi" required /></div>
              <div>
                <label className={labelClass}>Appartamento *</label>
                <select value={form.appartamento} onChange={e => setForm({ ...form, appartamento: e.target.value })} className={inputClass} required>
                  <option value="">-- Seleziona appartamento --</option>
                  {appartamenti.map(a => <option key={a.id} value={a.nome}>{a.nome}</option>)}
                </select>
              </div>
              <div><label className={labelClass}>Check-in (data e ora) *</label><input type="datetime-local" value={form.checkIn} onChange={e => setForm({ ...form, checkIn: e.target.value })} className={inputClass} required /></div>
              <div><label className={labelClass}>Check-out (data e ora) *</label><input type="datetime-local" value={form.checkOut} onChange={e => setForm({ ...form, checkOut: e.target.value })} className={inputClass} required /></div>
              <div><label className={labelClass}>Numero ospiti *</label><input type="number" min="1" max="20" value={form.numeroOspiti} onChange={e => setForm({ ...form, numeroOspiti: parseInt(e.target.value) || 1 })} className={inputClass} required /></div>
              <div><label className={labelClass}>Note (opzionale)</label><input type="text" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} className={inputClass} placeholder="Es. Arriviamo tardi" /></div>
              {errore && <div className="md:col-span-2"><p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{errore}</p></div>}
              <div className="md:col-span-2 flex gap-3">
                <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition text-sm">{loading ? 'Salvataggio...' : 'Salva'}</button>
                <button type="button" onClick={() => { setShowForm(false); setErrore('') }} className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition text-sm">Annulla</button>
              </div>
            </form>
          </div>
        )}

        {/* Barra di ricerca */}
        <div className="relative mb-4">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            value={cerca}
            onChange={e => setCerca(e.target.value)}
            placeholder="Cerca per nome ospite, appartamento o cognome..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
          />
          {cerca && (
            <button onClick={() => setCerca('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
          )}
        </div>

        {/* Contatore risultati */}
        {cerca && (
          <p className="text-sm text-gray-500 mb-4">
            {prenotazioniFiltrate.length === 0
              ? 'Nessun risultato'
              : `${prenotazioniFiltrate.length} prenotazion${prenotazioniFiltrate.length === 1 ? 'e' : 'i'} trovat${prenotazioniFiltrate.length === 1 ? 'a' : 'e'}`}
          </p>
        )}

        {prenotazioniFiltrate.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-4xl mb-3">{cerca ? '🔍' : '📋'}</p>
            <p className="text-gray-500">{cerca ? 'Nessuna prenotazione corrisponde alla ricerca.' : 'Nessuna prenotazione ancora. Creane una!'}</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {prenotazionePagina.map((p) => {
                const compilati = (p.ospiti || []).filter(o => o.compilato).length
                const totale = p.numeroOspiti || 0
                const completo = compilati === totale && totale > 0
                const tipo = p.tipoGruppo || 'gruppo'

                return (
                  <div key={p.id} className={`bg-white rounded-xl shadow-sm border p-5 transition ${p.confermata ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-start gap-3">
                        {/* Spunta conferma */}
                        <button
                          onClick={() => toggleConfermata(p.id, !!p.confermata)}
                          title={p.confermata ? 'Rimuovi conferma' : 'Segna come confermata'}
                          className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                            p.confermata
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'border-gray-300 hover:border-green-400 text-transparent hover:text-green-400'
                          }`}
                        >
                          ✓
                        </button>
                        <div>
                          <h3 className="font-semibold text-gray-800 text-lg">{p.nomeOspite}</h3>
                          <p className="text-gray-500 text-sm">{p.appartamento}</p>
                          <p className="text-gray-400 text-sm">📅 {formatDatetime(p.checkIn)} → {formatDatetime(p.checkOut)}</p>
                          <p className="text-gray-400 text-sm">👥 {totale} {totale === 1 ? 'ospite' : 'ospiti'}{p.note && ` · 📝 ${p.note}`}</p>
                          {p.confermata && <p className="text-green-600 text-xs font-semibold mt-1">✅ Confermata</p>}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${completo ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {completo ? '✅ Completo' : `⏳ ${compilati}/${totale}`}
                        </span>
                        <div className="flex gap-2 flex-wrap justify-end">
                          <button onClick={() => setPrenInModifica(p)} className="text-xs bg-white border border-blue-200 text-blue-600 px-2 py-1 rounded hover:bg-blue-50 transition">✏️ Modifica</button>
                          <button onClick={() => eliminaPrenotazione(p.id)} className="text-xs bg-white border border-red-200 text-red-500 px-2 py-1 rounded hover:bg-red-50 transition">🗑 Elimina</button>
                        </div>
                      </div>
                    </div>

                    {totale > 1 && (
                      <div className="flex items-center gap-3 mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Tipo:</span>
                        <div className="flex gap-2">
                          {[{ val: 'gruppo', label: 'Gruppo (18/20)' }, { val: 'famiglia', label: 'Famiglia (17/19)' }].map(opt => (
                            <button key={opt.val} onClick={() => aggiornaTipoGruppo(p.id, opt.val)}
                              className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${tipo === opt.val ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-500 border-gray-300 hover:border-gray-600'}`}>
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {p.ospiti && p.ospiti.length > 0 && (
                      <div className="mb-3 space-y-2">
                        {p.ospiti.map((o, i) => (
                          <div key={o.slotId} className={`rounded-lg border p-3 ${o.compilato ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5 ${o.compilato ? 'bg-green-600' : 'bg-gray-400'}`}>{i + 1}</span>
                                <div>
                                  {o.compilato ? (
                                    <>
                                      <div className="text-sm font-semibold text-gray-800">{o.cognome} {o.nome} {o.isCapogruppo ? '👑' : ''}</div>
                                      <div className="text-xs text-gray-500 mt-0.5">
                                        {o.sesso} · {o.dataNascita ? new Date(o.dataNascita).toLocaleDateString('it-IT') : ''} · {o.cittadinanzaTesto}
                                        {o.numeroDocumento && ` · ${tipoDocLabel(o.tipoDocumento)} ${o.numeroDocumento}`}
                                      </div>
                                      <div className="flex gap-1 mt-1 flex-wrap">
                                        {o.docFronte && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">📄 Fronte</span>}
                                        {o.docRetro && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">📄 Retro</span>}
                                        {o.selfie && <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">🤳 Selfie</span>}
                                      </div>
                                    </>
                                  ) : (
                                    <div className="text-sm text-gray-400">In attesa di compilazione</div>
                                  )}
                                </div>
                              </div>
                              {o.compilato && (
                                <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
                                  <button onClick={() => setRiepilogoOspite({ ospite: o, numero: i + 1 })} className="text-xs bg-white border border-gray-300 text-gray-600 px-2 py-1 rounded hover:border-indigo-400 hover:text-indigo-600 transition">👁 Riepilogo</button>
                                  <button onClick={() => setOspiteInModifica(o)} className="text-xs bg-white border border-gray-300 text-gray-600 px-2 py-1 rounded hover:border-blue-400 hover:text-blue-600 transition">✏️ Modifica</button>
                                  {(o.docFronte || o.docRetro || o.selfie) && (
                                    <button onClick={() => eliminaFotoOspite(o.slotId)} className="text-xs bg-white border border-red-200 text-red-500 px-2 py-1 rounded hover:bg-red-50 transition">🗑 Foto</button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-3 border-t border-gray-100 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-gray-400">Link ospite:</span>
                        <button onClick={() => copiaLink(p.token)} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-lg transition">
                          {copiato === p.token ? '✅ Copiato!' : '📋 Copia link'}
                        </button>
                        <a href={getLinkOspite(p.token)} target="_blank" className="text-xs text-blue-500 hover:text-blue-700">Apri →</a>
                      </div>
                      {compilati > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-gray-400">Export:</span>
                          <button onClick={() => esportaFile(p.id, 'alloggiati')} className="text-xs bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-50 transition">📄 Alloggiati Web</button>
                          <button onClick={() => esportaFile(p.id, 'ross1000')} className="text-xs bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-50 transition">📊 Ross1000</button>
                          {p.alloggiatiEsportato && (
                            <span className="text-xs text-green-600">✓ Alloggiati {new Date(p.alloggiatiEsportato).toLocaleDateString('it-IT')}</span>
                          )} {p.ospiti.some(o => o.docFronte || o.docRetro || o.selfie) && !(p as any).docsEliminati && (
  <button
    onClick={() => eliminaDocumentiPrenotazione(p)}
    className="text-xs bg-white border border-orange-300 text-orange-600 px-3 py-1 rounded-lg hover:bg-orange-50 transition"
  >
    🛡️ Elimina foto (GDPR)
  </button>
)}
{(p as any).docsEliminati && (
  <span className="text-xs text-gray-400">🛡️ Foto eliminate</span>
)}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Paginazione */}
            {totPagine > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-500">
                  Pagina {pagina} di {totPagine} · {prenotazioniFiltrate.length} prenotazioni
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPagina(p => Math.max(1, p - 1))}
                    disabled={pagina === 1}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    ← Precedente
                  </button>
                  {Array.from({ length: totPagine }, (_, i) => i + 1).map(n => (
                    <button
                      key={n}
                      onClick={() => setPagina(n)}
                      className={`px-3 py-1.5 text-sm border rounded-lg transition ${n === pagina ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-300 hover:bg-gray-50'}`}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    onClick={() => setPagina(p => Math.min(totPagine, p + 1))}
                    disabled={pagina === totPagine}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Successiva →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}