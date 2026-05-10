'use client'

import { useState, useEffect, useRef } from 'react'
import { STATI } from '@/lib/stati-data'

// ── Traduzioni ────────────────────────────────────────────
const T = {
  it: {
    checkinOnline: 'Check-in online', arrivo: 'Arrivo', partenza: 'Partenza',
    ciao: 'Ciao 👋',
    benvenuto: (nome: string, n: number) => `La prenotazione a nome di ${nome} è confermata. Per il check-in serve compilare i dati di tutti gli ospiti (${n} persone) come richiesto dalla legge italiana.`,
    compilati: (c: number, t: number) => `${c} di ${t} ospiti compilati`,
    tuttiCompilati: '✅ Tutti i dati sono stati inseriti! Ti aspettiamo per il check-in.',
    ospiti: 'Ospiti', ospite: 'Ospite', compilato: 'Compilato ✓',
    tocca: 'Tocca per compilare i tuoi dati',
    listaOspiti: '← Lista ospiti', annulla: 'Annulla', salva: 'Salva i miei dati',
    salvataggio: 'Salvataggio...',
    datiAnagrafici: 'Dati anagrafici', residenza: 'Residenza', documento: "Documento d'identità",
    cognome: 'Cognome', nome: 'Nome', sesso: 'Sesso', maschio: 'Maschio', femmina: 'Femmina',
    dataNascita: 'Data di nascita', cittadinanza: 'Cittadinanza',
    comuneNascita: 'Comune di nascita', statoNascita: 'Stato di nascita',
    statoResidenza: 'Stato di residenza', comune: 'Comune', citta: 'Città',
    selezionaStato: '-- Seleziona stato --',
    iniziaComune: 'Inizia a scrivere il comune...',
    nessunComune: 'Nessun comune trovato',
    docAccettati: "Documenti accettati: Carta d'identità (cartacea o elettronica), Passaporto",
    tipoDoc: 'Tipo documento', numeroDoc: 'Numero documento',
    statoRilascio: 'Stato di rilascio', comuneRilascio: 'Comune di rilascio',
    luogoRilascio: 'Luogo di rilascio',
    fotoFronte: 'Foto fronte *', fotoRetro: 'Foto retro *', selfie: 'Selfie *',
    fotocamera: 'Fotocamera', galleria: 'Galleria',
    solofoto: 'Carica le foto del tuo documento (fronte e retro) e un selfie. I dati testuali del documento non sono richiesti.',
    minorenne: (eta: number) => `👶 Minorenne (${eta} anni): non sono richiesti documenti né selfie.`,
    inserisciData: '📅 Inserisci la data di nascita per continuare.',
    errCognomeNome: 'Cognome e nome obbligatori',
    errData: 'Data di nascita obbligatoria',
    errTipoDoc: 'Seleziona il tipo di documento',
    errNumeroDoc: 'Inserisci il numero del documento',
    errFronte: 'Carica la foto del fronte del documento',
    errRetro: 'Carica anche la foto del retro',
    errSelfie: 'Scatta un selfie per completare',
    linkNonValido: 'Link non valido',
    linkNonValidoDesc: 'Prenotazione non trovata. Controlla il link o contatta l\'host.',
    footer: 'I dati inseriti sono trattati per gli adempimenti di legge (art. 109 TULPS) e per la comunicazione obbligatoria al portale Alloggiati Web della Polizia di Stato.',
    ospiteN: (n: number, t: number) => `Ospite ${n} di ${t}`,
  },
  en: {
    checkinOnline: 'Online check-in', arrivo: 'Arrival', partenza: 'Departure',
    ciao: 'Hello 👋',
    benvenuto: (nome: string, n: number) => `The booking under ${nome}'s name is confirmed. To check in, please fill in the details of all guests (${n} people) as required by Italian law.`,
    compilati: (c: number, t: number) => `${c} of ${t} guests completed`,
    tuttiCompilati: '✅ All details submitted! We look forward to welcoming you.',
    ospiti: 'Guests', ospite: 'Guest', compilato: 'Completed ✓',
    tocca: 'Tap to fill in your details',
    listaOspiti: '← Guest list', annulla: 'Cancel', salva: 'Save my details',
    salvataggio: 'Saving...',
    datiAnagrafici: 'Personal details', residenza: 'Residence', documento: 'ID document',
    cognome: 'Last name', nome: 'First name', sesso: 'Sex', maschio: 'Male', femmina: 'Female',
    dataNascita: 'Date of birth', cittadinanza: 'Citizenship',
    comuneNascita: 'Place of birth (municipality)', statoNascita: 'Country of birth',
    statoResidenza: 'Country of residence', comune: 'Municipality', citta: 'City',
    selezionaStato: '-- Select country --',
    iniziaComune: 'Start typing the municipality...',
    nessunComune: 'No municipality found',
    docAccettati: 'Accepted documents: ID card (paper or electronic), Passport',
    tipoDoc: 'Document type', numeroDoc: 'Document number',
    statoRilascio: 'Country of issue', comuneRilascio: 'Municipality of issue',
    luogoRilascio: 'Place of issue',
    fotoFronte: 'Front photo *', fotoRetro: 'Back photo *', selfie: 'Selfie *',
    fotocamera: 'Camera', galleria: 'Gallery',
    solofoto: 'Upload photos of your document (front and back) and a selfie. Text details are not required.',
    minorenne: (eta: number) => `👶 Minor (${eta} years old): no documents or selfie required.`,
    inserisciData: '📅 Enter date of birth to continue.',
    errCognomeNome: 'Last name and first name are required',
    errData: 'Date of birth is required',
    errTipoDoc: 'Select the document type',
    errNumeroDoc: 'Enter the document number',
    errFronte: 'Upload the front photo of the document',
    errRetro: 'Also upload the back photo',
    errSelfie: 'Take a selfie to complete',
    linkNonValido: 'Invalid link',
    linkNonValidoDesc: 'Booking not found. Check the link or contact your host.',
    footer: 'Your data is processed for legal requirements (art. 109 TULPS) and for mandatory reporting to the Alloggiati Web portal of the Italian State Police.',
    ospiteN: (n: number, t: number) => `Guest ${n} of ${t}`,
  },
  de: {
    checkinOnline: 'Online Check-in', arrivo: 'Anreise', partenza: 'Abreise',
    ciao: 'Hallo 👋',
    benvenuto: (nome: string, n: number) => `Die Buchung auf den Namen ${nome} ist bestätigt. Bitte füllen Sie die Daten aller Gäste (${n} Personen) aus.`,
    compilati: (c: number, t: number) => `${c} von ${t} Gästen ausgefüllt`,
    tuttiCompilati: '✅ Alle Daten eingegeben! Wir freuen uns auf Sie.',
    ospiti: 'Gäste', ospite: 'Gast', compilato: 'Ausgefüllt ✓',
    tocca: 'Tippen, um Ihre Daten einzugeben',
    listaOspiti: '← Gästeliste', annulla: 'Abbrechen', salva: 'Meine Daten speichern',
    salvataggio: 'Speichern...',
    datiAnagrafici: 'Persönliche Daten', residenza: 'Wohnsitz', documento: 'Ausweisdokument',
    cognome: 'Nachname', nome: 'Vorname', sesso: 'Geschlecht', maschio: 'Männlich', femmina: 'Weiblich',
    dataNascita: 'Geburtsdatum', cittadinanza: 'Staatsangehörigkeit',
    comuneNascita: 'Geburtsort (Gemeinde)', statoNascita: 'Geburtsland',
    statoResidenza: 'Wohnsitzland', comune: 'Gemeinde', citta: 'Stadt',
    selezionaStato: '-- Land auswählen --',
    iniziaComune: 'Gemeinde eingeben...',
    nessunComune: 'Keine Gemeinde gefunden',
    docAccettati: 'Akzeptierte Dokumente: Personalausweis (Papier oder elektronisch), Reisepass',
    tipoDoc: 'Dokumenttyp', numeroDoc: 'Dokumentnummer',
    statoRilascio: 'Ausstellungsland', comuneRilascio: 'Ausstellungsgemeinde',
    luogoRilascio: 'Ausstellungsort',
    fotoFronte: 'Foto Vorderseite *', fotoRetro: 'Foto Rückseite *', selfie: 'Selfie *',
    fotocamera: 'Kamera', galleria: 'Galerie',
    solofoto: 'Laden Sie Fotos Ihres Dokuments (Vorder- und Rückseite) und ein Selfie hoch. Textdaten sind nicht erforderlich.',
    minorenne: (eta: number) => `👶 Minderjährig (${eta} Jahre): keine Dokumente oder Selfie erforderlich.`,
    inserisciData: '📅 Geburtsdatum eingeben, um fortzufahren.',
    errCognomeNome: 'Nachname und Vorname sind erforderlich',
    errData: 'Geburtsdatum erforderlich',
    errTipoDoc: 'Dokumenttyp auswählen',
    errNumeroDoc: 'Dokumentnummer eingeben',
    errFronte: 'Foto der Vorderseite hochladen',
    errRetro: 'Auch Foto der Rückseite hochladen',
    errSelfie: 'Selfie machen',
    linkNonValido: 'Ungültiger Link',
    linkNonValidoDesc: 'Buchung nicht gefunden. Bitte prüfen Sie den Link.',
    footer: 'Ihre Daten werden für gesetzliche Verpflichtungen (Art. 109 TULPS) verarbeitet.',
    ospiteN: (n: number, t: number) => `Gast ${n} von ${t}`,
  },
  fr: {
    checkinOnline: 'Enregistrement en ligne', arrivo: 'Arrivée', partenza: 'Départ',
    ciao: 'Bonjour 👋',
    benvenuto: (nome: string, n: number) => `La réservation au nom de ${nome} est confirmée. Veuillez remplir les données de tous les invités (${n} personnes).`,
    compilati: (c: number, t: number) => `${c} sur ${t} invités complétés`,
    tuttiCompilati: '✅ Toutes les données saisies ! Nous vous attendons.',
    ospiti: 'Invités', ospite: 'Invité', compilato: 'Complété ✓',
    tocca: 'Appuyez pour saisir vos données',
    listaOspiti: '← Liste des invités', annulla: 'Annuler', salva: 'Enregistrer mes données',
    salvataggio: 'Enregistrement...',
    datiAnagrafici: 'Données personnelles', residenza: 'Résidence', documento: "Document d'identité",
    cognome: 'Nom', nome: 'Prénom', sesso: 'Sexe', maschio: 'Homme', femmina: 'Femme',
    dataNascita: 'Date de naissance', cittadinanza: 'Nationalité',
    comuneNascita: 'Lieu de naissance (commune)', statoNascita: 'Pays de naissance',
    statoResidenza: 'Pays de résidence', comune: 'Commune', citta: 'Ville',
    selezionaStato: '-- Sélectionner un pays --',
    iniziaComune: 'Commencez à écrire la commune...',
    nessunComune: 'Aucune commune trouvée',
    docAccettati: "Documents acceptés : Carte d'identité (papier ou électronique), Passeport",
    tipoDoc: 'Type de document', numeroDoc: 'Numéro de document',
    statoRilascio: 'Pays de délivrance', comuneRilascio: 'Commune de délivrance',
    luogoRilascio: 'Lieu de délivrance',
    fotoFronte: 'Photo recto *', fotoRetro: 'Photo verso *', selfie: 'Selfie *',
    fotocamera: 'Appareil photo', galleria: 'Galerie',
    solofoto: 'Téléchargez les photos de votre document (recto et verso) et un selfie. Les données textuelles ne sont pas requises.',
    minorenne: (eta: number) => `👶 Mineur (${eta} ans) : aucun document ni selfie requis.`,
    inserisciData: '📅 Entrez la date de naissance pour continuer.',
    errCognomeNome: 'Nom et prénom obligatoires',
    errData: 'Date de naissance obligatoire',
    errTipoDoc: 'Sélectionnez le type de document',
    errNumeroDoc: 'Entrez le numéro du document',
    errFronte: 'Téléchargez la photo du recto',
    errRetro: 'Téléchargez aussi la photo du verso',
    errSelfie: 'Prenez un selfie',
    linkNonValido: 'Lien invalide',
    linkNonValidoDesc: 'Réservation introuvable. Vérifiez le lien.',
    footer: 'Vos données sont traitées pour les obligations légales (art. 109 TULPS).',
    ospiteN: (n: number, t: number) => `Invité ${n} sur ${t}`,
  },
}
type Lang = keyof typeof T
const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
]

function detectLang(): Lang {
  try {
    const saved = localStorage.getItem('ospite_lang') as Lang
    if (saved && T[saved]) return saved
  } catch {}
  const nav = (navigator.language || 'it').slice(0, 2).toLowerCase() as Lang
  return T[nav] ? nav : 'it'
}

// ── Tipi ─────────────────────────────────────────────────
interface Ospite {
  slotId: string; compilato: boolean; isCapogruppo: boolean
  cognome?: string; nome?: string
}
interface Prenotazione {
  id: string; nomeOspite: string; appartamento: string
  checkIn: string; checkOut: string; numeroOspiti: number; ospiti: Ospite[]
}
interface Comune { nome: string; codice: string; prov: string }

// ── Helpers ───────────────────────────────────────────────
function formatDateTime(iso: string) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' · ' + d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
}

function calcolaEta(dataNascita: string): number | null {
  if (!dataNascita) return null
  const oggi = new Date(); const n = new Date(dataNascita)
  if (isNaN(n.getTime())) return null
  let e = oggi.getFullYear() - n.getFullYear()
  if (oggi.getMonth() - n.getMonth() < 0 || (oggi.getMonth() === n.getMonth() && oggi.getDate() < n.getDate())) e--
  return e < 0 || e > 120 ? null : e
}

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => {
      const img = new Image()
      img.onload = () => {
        const maxLato = 1200
        const canvas = document.createElement('canvas')
        let { width, height } = img
        if (width > height && width > maxLato) { height = Math.round(height * maxLato / width); width = maxLato }
        else if (height > maxLato) { width = Math.round(width * maxLato / height); height = maxLato }
        canvas.width = width; canvas.height = height
        canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }
      img.onerror = () => reject(new Error('Immagine non valida'))
      img.src = e.target!.result as string
    }
    reader.onerror = () => reject(new Error('Lettura fallita'))
    reader.readAsDataURL(file)
  })
}

// ── LangSwitcher ─────────────────────────────────────────
function LangSwitcher({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', fn); return () => document.removeEventListener('mousedown', fn)
  }, [])
  const cur = LANGS.find(l => l.code === lang)!
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)}
        style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '6px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
        {cur.flag} {cur.code.toUpperCase()} ▾
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, background: 'white', border: '1px solid #e7e2d8', borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', zIndex: 100, minWidth: 150, overflow: 'hidden' }}>
          {LANGS.map(l => (
            <button key={l.code} onClick={() => { onChange(l.code); setOpen(false) }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '10px 14px', background: l.code === lang ? '#f4efe6' : 'white', border: 'none', cursor: 'pointer', fontSize: 13, color: '#1c1917', fontFamily: 'inherit', textAlign: 'left' }}>
              {l.flag} {l.label} {l.code === lang && '✓'}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── ComboboxComune ────────────────────────────────────────
function ComboboxComune({ value, onChange, placeholder }: { value: string; onChange: (c: Comune | null) => void; placeholder: string }) {
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
      <input type="text" value={query} placeholder={placeholder}
        onChange={e => { setQuery(e.target.value); setOpen(true); setHighlighted(0); if (!e.target.value) onChange(null) }}
        onFocus={() => { if (query.length >= 2) setOpen(true) }}
        onKeyDown={e => {
          if (!open || !suggestions.length) return
          if (e.key === 'ArrowDown') { e.preventDefault(); setHighlighted(h => Math.min(h + 1, suggestions.length - 1)) }
          else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlighted(h => Math.max(h - 1, 0)) }
          else if (e.key === 'Enter') { e.preventDefault(); const s = suggestions[highlighted]; if (s) { setQuery(s.nome); onChange(s); setOpen(false) } }
          else if (e.key === 'Escape') setOpen(false)
        }}
        autoComplete="off" style={inputStyle} />
      {open && suggestions.length > 0 && (
        <div style={dropdownStyle}>
          {suggestions.map((s, i) => (
            <button key={s.codice} onMouseDown={e => { e.preventDefault(); setQuery(s.nome); onChange(s); setOpen(false) }}
              onMouseEnter={() => setHighlighted(i)}
              style={{ ...dropdownItemStyle, background: i === highlighted ? '#f4efe6' : 'white' }}>
              <span style={{ fontWeight: 500, color: '#1c1917' }}>{s.nome}</span>
              <span style={{ fontSize: 11, color: '#a8a29e', background: '#f0ebe1', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>{s.prov}</span>
            </button>
          ))}
        </div>
      )}
      {open && query.length >= 2 && suggestions.length === 0 && (
        <div style={dropdownStyle}><div style={{ padding: 12, color: '#a8a29e', fontSize: 13, textAlign: 'center' }}>Nessun comune trovato</div></div>
      )}
    </div>
  )
}

// ── SelectStato ───────────────────────────────────────────
function SelectStato({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <select value={value || ''} onChange={e => onChange(e.target.value)} style={inputStyle}>
      <option value="">{placeholder}</option>
      {STATI.map(s => <option key={s.codice} value={s.nome}>{s.nome}</option>)}
    </select>
  )
}

// ── FotoUpload ────────────────────────────────────────────
function FotoUpload({ label, value, onChange, selfie = false, t }: {
  label: string; value: string | null; onChange: (v: string | null) => void; selfie?: boolean; t: typeof T.it
}) {
  const [loading, setLoading] = useState(false)
  const camId = 'cam_' + Math.random().toString(36).slice(2, 8)
  const galId = 'gal_' + Math.random().toString(36).slice(2, 8)
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setLoading(true)
    try { onChange(await compressImage(file)) }
    catch (err: any) { alert('Errore: ' + err.message) }
    finally { setLoading(false); e.target.value = '' }
  }
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={labelStyle}>{label}</div>
      {value ? (
        <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: '1px solid #e7e2d8' }}>
          <img src={value} alt={label} style={{ width: '100%', height: 96, objectFit: 'cover', display: 'block' }} />
          <button onClick={() => onChange(null)}
            style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(28,25,23,0.75)', color: 'white', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 8 }}>
          <label htmlFor={camId} style={fotoBtnStyle}>
            {loading ? '...' : <>{selfie ? '🤳' : '📷'}<span>{selfie ? t.selfie.replace(' *', '') : t.fotocamera}</span></>}
            <input id={camId} type="file" accept="image/*" capture={selfie ? 'user' : 'environment'} onChange={handleFile} disabled={loading} style={{ display: 'none' }} />
          </label>
          {!selfie && (
            <label htmlFor={galId} style={fotoBtnStyle}>
              🖼<span>{t.galleria}</span>
              <input id={galId} type="file" accept="image/*" onChange={handleFile} disabled={loading} style={{ display: 'none' }} />
            </label>
          )}
        </div>
      )}
    </div>
  )
}

// ── Field ─────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={labelStyle}>{label}</div>
      {children}
    </div>
  )
}

// ── Lista ospiti ──────────────────────────────────────────
function ListaOspiti({ pren, onApri, lang, setLang, t }: {
  pren: Prenotazione; onApri: (s: Ospite) => void; lang: Lang; setLang: (l: Lang) => void; t: typeof T.it
}) {
  const compilati = pren.ospiti.filter(o => o.compilato).length
  const totale = pren.ospiti.length
  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={{ background: '#1c1917', color: 'white', padding: '20px 16px 24px', borderRadius: '0 0 16px 16px', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#c89b4a', margin: 0 }}>{t.checkinOnline}</p>
          <LangSwitcher lang={lang} onChange={setLang} />
        </div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 22, margin: '0 0 16px', fontWeight: 500 }}>{pren.appartamento}</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, background: 'rgba(255,255,255,0.08)', padding: 12, borderRadius: 10 }}>
          <div>
            <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#c89b4a', margin: '0 0 3px' }}>{t.arrivo}</p>
            <p style={{ fontSize: 13, margin: 0, fontWeight: 500 }}>{formatDateTime(pren.checkIn)}</p>
          </div>
          <div>
            <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#c89b4a', margin: '0 0 3px' }}>{t.partenza}</p>
            <p style={{ fontSize: 13, margin: 0, fontWeight: 500 }}>{formatDateTime(pren.checkOut)}</p>
          </div>
        </div>
      </div>

      {/* Benvenuto */}
      <div style={cardStyle}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, margin: '0 0 10px', color: '#1c1917' }}>{t.ciao}</h2>
        <p style={{ color: '#44403c', margin: '0 0 14px', lineHeight: 1.6, fontSize: 14 }}>
          {t.benvenuto(pren.nomeOspite, totale)}
        </p>
        <div style={{ background: '#f4efe6', borderRadius: 8, padding: '10px 14px' }}>
          <div style={{ height: 6, background: '#e7e2d8', borderRadius: 100, overflow: 'hidden', marginBottom: 6 }}>
            <div style={{ height: '100%', width: `${(compilati / totale) * 100}%`, background: 'linear-gradient(90deg, #b54a2c, #c89b4a)', transition: 'width 0.4s' }} />
          </div>
          <p style={{ margin: 0, fontSize: 12, color: '#44403c', fontWeight: 600 }}>{t.compilati(compilati, totale)}</p>
        </div>
      </div>

      {compilati === totale && (
        <div style={{ ...cardStyle, background: '#e0ebe2', border: '1px solid #4a7c59' }}>
          <p style={{ margin: 0, color: '#2d5a3a', fontWeight: 600, fontSize: 14 }}>{t.tuttiCompilati}</p>
        </div>
      )}

      {/* Lista ospiti */}
      <div style={cardStyle}>
        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 18, margin: '0 0 14px', color: '#1c1917', fontWeight: 600 }}>{t.ospiti}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {pren.ospiti.map((slot, i) => (
            <button key={slot.slotId} onClick={() => !slot.compilato && onApri(slot)} disabled={slot.compilato}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: slot.compilato ? '#e0ebe2' : '#f4efe6', border: `1px solid ${slot.compilato ? '#4a7c59' : '#e7e2d8'}`, borderRadius: 10, cursor: slot.compilato ? 'default' : 'pointer', width: '100%', textAlign: 'left', font: 'inherit' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: slot.compilato ? '#4a7c59' : '#1c1917', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 15, fontWeight: 600, color: '#1c1917' }}>
                  {slot.compilato ? `${slot.cognome} ${slot.nome}` : `${t.ospite} ${i + 1}`}
                </div>
                <div style={{ fontSize: 12, color: '#57534e', marginTop: 2 }}>
                  {slot.compilato ? t.compilato : t.tocca}
                </div>
              </div>
              {!slot.compilato && <span style={{ color: '#57534e', fontSize: 18 }}>›</span>}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 4px 60px', fontSize: 11, color: '#78716c', lineHeight: 1.6 }}>{t.footer}</div>
    </div>
  )
}

// ── Form ospite ───────────────────────────────────────────
function FormOspite({ slot, numero, totale, pren, token, onSalvato, onAnnulla, t }: {
  slot: Ospite; numero: number; totale: number; pren: Prenotazione
  token: string; onSalvato: () => void; onAnnulla: () => void; t: typeof T.it
}) {
  // Determina se sarà capogruppo: unico ospite, già marcato, o nessuno ha ancora compilato
  const nessunCapo = !pren.ospiti.some(o => o.isCapogruppo)
  const nessunCompilato = !pren.ospiti.some(o => o.compilato && o.slotId !== slot.slotId)
  const isCapogruppo = totale === 1 || slot.isCapogruppo || (nessunCapo && nessunCompilato)

  const [form, setForm] = useState({
    cognome: '', nome: '', sesso: 'M', dataNascita: '',
    cittadinanzaTesto: 'ITALIA',
    comuneNascita: '', provinciaNascita: '', codiceComuneNascita: '', statoNascita: '',
    comuneResidenza: '', provinciaResidenza: '', codiceComuneResidenza: '', statoResidenza: 'ITALIA',
    tipoDocumento: '', numeroDocumento: '',
    luogoRilascio: '', provinciaRilascio: '', codiceComuneRilascio: '', statoRilascio: 'ITALIA',
    docFronte: null as string | null, docRetro: null as string | null, selfie: null as string | null,
  })
  const [saving, setSaving] = useState(false)
  const [errore, setErrore] = useState('')

  const up = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  const eta = calcolaEta(form.dataNascita)
  const isMaggiorenne = eta !== null && eta >= 18
  const isItaliano = form.cittadinanzaTesto.toUpperCase() === 'ITALIA'
  const residenzaItalia = (form.statoResidenza || 'ITALIA').toUpperCase() === 'ITALIA'
  const rilascioItalia = (form.statoRilascio || 'ITALIA').toUpperCase() === 'ITALIA'
  const isPassaporto = form.tipoDocumento === 'PASOR'

  const handleSalva = async () => {
    setErrore('')
    if (!form.cognome.trim() || !form.nome.trim()) { setErrore(t.errCognomeNome); return }
    if (!form.dataNascita) { setErrore(t.errData); return }
    if (isMaggiorenne) {
      if (isCapogruppo) {
        if (!form.tipoDocumento) { setErrore(t.errTipoDoc); return }
        if (!form.numeroDocumento.trim()) { setErrore(t.errNumeroDoc); return }
      }
      if (!form.docFronte) { setErrore(t.errFronte); return }
      if (!isPassaporto && !form.docRetro) { setErrore(t.errRetro); return }
      if (!form.selfie) { setErrore(t.errSelfie); return }
    }
    setSaving(true)
    try {
      const res = await fetch('/api/ospite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token, slotId: slot.slotId,
          cognome: form.cognome.toUpperCase().trim(),
          nome: form.nome.toUpperCase().trim(),
          sesso: form.sesso, dataNascita: form.dataNascita,
          cittadinanzaTesto: form.cittadinanzaTesto.toUpperCase().trim(),
          comuneNascita: form.comuneNascita.toUpperCase().trim(),
          provinciaNascita: form.provinciaNascita,
          codiceComuneNascita: form.codiceComuneNascita,
          statoNascita: form.statoNascita.toUpperCase().trim(),
          comuneResidenza: form.comuneResidenza.toUpperCase().trim(),
          provinciaResidenza: form.provinciaResidenza,
          codiceComuneResidenza: form.codiceComuneResidenza,
          statoResidenza: form.statoResidenza.toUpperCase().trim(),
          tipoDocumento: form.tipoDocumento,
          numeroDocumento: form.numeroDocumento.toUpperCase().trim(),
          luogoRilascio: form.luogoRilascio.toUpperCase().trim(),
          provinciaRilascio: form.provinciaRilascio,
          codiceComuneRilascio: form.codiceComuneRilascio,
          statoRilascio: form.statoRilascio.toUpperCase().trim(),
          docFronte: form.docFronte, docRetro: form.docRetro, selfie: form.selfie,
        }),
      })
      if (!res.ok) { const e = await res.json(); setErrore(e.error || 'Errore'); return }
      onSalvato()
    } catch (e: any) { setErrore('Errore: ' + e.message) }
    finally { setSaving(false) }
  }

  return (
    <div style={pageStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <button onClick={onAnnulla} style={backBtnStyle}>{t.listaOspiti}</button>
        <span style={{ fontSize: 11, color: '#57534e', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
          {t.ospiteN(numero, totale)}
        </span>
      </div>

      {/* Dati anagrafici */}
      <div style={cardStyle}>
        <h3 style={sectionTitle}>{t.datiAnagrafici}</h3>
        <div style={rowStyle}>
          <Field label={t.cognome + ' *'}>
            <input value={form.cognome} onChange={e => up('cognome', e.target.value)} style={inputStyle} autoComplete="family-name" />
          </Field>
          <Field label={t.nome + ' *'}>
            <input value={form.nome} onChange={e => up('nome', e.target.value)} style={inputStyle} autoComplete="given-name" />
          </Field>
        </div>
        <div style={rowStyle}>
          <Field label={t.sesso + ' *'}>
            <select value={form.sesso} onChange={e => up('sesso', e.target.value)} style={inputStyle}>
              <option value="M">{t.maschio}</option>
              <option value="F">{t.femmina}</option>
            </select>
          </Field>
          <Field label={t.dataNascita + ' *'}>
            <input type="date" value={form.dataNascita} onChange={e => up('dataNascita', e.target.value)} style={inputStyle} />
          </Field>
        </div>
        <Field label={t.cittadinanza + ' *'}>
          <SelectStato value={form.cittadinanzaTesto} onChange={v => up('cittadinanzaTesto', v)} placeholder={t.selezionaStato} />
        </Field>
        {isItaliano ? (
  <Field label={t.comuneNascita}>
    <ComboboxComune value={form.comuneNascita} placeholder={t.iniziaComune}
      onChange={c => { if (c) { up('comuneNascita', c.nome); up('provinciaNascita', c.prov); up('codiceComuneNascita', c.codice) } else { up('comuneNascita', ''); up('provinciaNascita', ''); up('codiceComuneNascita', '') } }} />
  </Field>
) : (
  <>
    <Field label={t.statoNascita}>
      <SelectStato value={form.statoNascita} onChange={v => { up('statoNascita', v); up('comuneNascita', ''); up('provinciaNascita', ''); up('codiceComuneNascita', '') }} placeholder={t.selezionaStato} />
    </Field>
    {form.statoNascita === 'ITALIA' && (
      <Field label={t.comuneNascita}>
        <ComboboxComune value={form.comuneNascita} placeholder={t.iniziaComune}
          onChange={c => { if (c) { up('comuneNascita', c.nome); up('provinciaNascita', c.prov); up('codiceComuneNascita', c.codice) } else { up('comuneNascita', ''); up('provinciaNascita', ''); up('codiceComuneNascita', '') } }} />
      </Field>
    )}
  </>
)}
      </div>

      {/* Residenza — senza indirizzo e CAP */}
      <div style={cardStyle}>
        <h3 style={sectionTitle}>{t.residenza}</h3>
        <Field label={t.statoResidenza}>
          <SelectStato value={form.statoResidenza}
            onChange={v => { up('statoResidenza', v); up('comuneResidenza', ''); up('provinciaResidenza', ''); up('codiceComuneResidenza', '') }}
            placeholder={t.selezionaStato} />
        </Field>
        {residenzaItalia ? (
          <Field label={t.comune}>
            <ComboboxComune value={form.comuneResidenza} placeholder={t.iniziaComune}
              onChange={c => { if (c) { up('comuneResidenza', c.nome); up('provinciaResidenza', c.prov); up('codiceComuneResidenza', c.codice) } else { up('comuneResidenza', ''); up('provinciaResidenza', ''); up('codiceComuneResidenza', '') } }} />
          </Field>
        ) : (
          <Field label={t.citta}>
            <input value={form.comuneResidenza} onChange={e => up('comuneResidenza', e.target.value)} style={inputStyle} />
          </Field>
        )}
      </div>

      {/* Documento */}
      {eta === null && (
        <div style={{ ...cardStyle, background: '#dde7f0', border: '1px solid #3a5a78' }}>
          <p style={{ margin: 0, color: '#1e3a52', fontSize: 14, fontWeight: 500 }}>{t.inserisciData}</p>
        </div>
      )}
      {eta !== null && !isMaggiorenne && (
        <div style={{ ...cardStyle, background: '#dde7f0', border: '1px solid #3a5a78' }}>
          <p style={{ margin: 0, color: '#1e3a52', fontSize: 14 }}>{t.minorenne(eta)}</p>
        </div>
      )}
      {isMaggiorenne && (
        <div style={cardStyle}>
          <h3 style={sectionTitle}>{t.documento}</h3>
          <div style={{ background: '#fce8d8', border: '1px solid #b85b1c', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: '#7a3a10', fontWeight: 500 }}>
            ℹ️ {t.docAccettati}
          </div>

          {/* Capogruppo: compila dati + foto */}
          {isCapogruppo && (
            <>
              <div style={rowStyle}>
                <Field label={t.tipoDoc + ' *'}>
                  <select value={form.tipoDocumento} onChange={e => up('tipoDocumento', e.target.value)} style={inputStyle}>
                    <option value="">--</option>
                    <option value="IDENT">Carta d'identità (cartacea)</option>
                    <option value="IDELE">Carta d'identità elettronica</option>
                    <option value="PASOR">Passaporto</option>
                  </select>
                </Field>
                <Field label={t.numeroDoc + ' *'}>
                  <input value={form.numeroDocumento} onChange={e => up('numeroDocumento', e.target.value)} style={inputStyle} />
                </Field>
              </div>
              <Field label={t.statoRilascio}>
                <SelectStato value={form.statoRilascio}
                  onChange={v => { up('statoRilascio', v); up('luogoRilascio', ''); up('provinciaRilascio', ''); up('codiceComuneRilascio', '') }}
                  placeholder={t.selezionaStato} />
              </Field>
              {rilascioItalia ? (
                <Field label={t.comuneRilascio}>
                  <ComboboxComune value={form.luogoRilascio} placeholder={t.iniziaComune}
                    onChange={c => { if (c) { up('luogoRilascio', c.nome); up('provinciaRilascio', c.prov); up('codiceComuneRilascio', c.codice) } else { up('luogoRilascio', ''); up('provinciaRilascio', ''); up('codiceComuneRilascio', '') } }} />
                </Field>
              ) : (
                <Field label={t.luogoRilascio}>
                  <input value={form.luogoRilascio} onChange={e => up('luogoRilascio', e.target.value)} style={inputStyle} placeholder="Es. PARIS, BERLIN..." />
                </Field>
              )}
            </>
          )}

          {/* Secondario: solo info + foto */}
          {!isCapogruppo && (
            <div style={{ background: '#f4efe6', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: '#44403c' }}>
              📷 {t.solofoto}
            </div>
          )}

          <FotoUpload label={t.fotoFronte} value={form.docFronte} onChange={v => up('docFronte', v)} t={t} />
          {!isPassaporto && <FotoUpload label={t.fotoRetro} value={form.docRetro} onChange={v => up('docRetro', v)} t={t} />}
          <FotoUpload label={t.selfie} value={form.selfie} onChange={v => up('selfie', v)} selfie t={t} />
        </div>
      )}

      {errore && (
        <div style={{ background: '#fce8d8', border: '1px solid #b54a2c', borderRadius: 8, padding: '12px 16px', color: '#7a2010', fontSize: 13, marginBottom: 12, fontWeight: 500 }}>
          ⚠️ {errore}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, paddingBottom: 60 }}>
        <button onClick={onAnnulla} style={btnSecondaryStyle}>{t.annulla}</button>
        <button onClick={handleSalva} disabled={saving} style={{ ...btnPrimaryStyle, flex: 1, opacity: saving ? 0.6 : 1 }}>
          {saving ? t.salvataggio : `✓ ${t.salva}`}
        </button>
      </div>
    </div>
  )
}

// ── Pagina principale ─────────────────────────────────────
export default function OspitePage() {
  const [token, setToken] = useState<string | null>(null)
  const [pren, setPren] = useState<Prenotazione | null>(null)
  const [errore, setErrore] = useState('')
  const [loading, setLoading] = useState(true)
  const [slotAttivo, setSlotAttivo] = useState<Ospite | null>(null)
  const [lang, setLang] = useState<Lang>('it')

  useEffect(() => {
    setLang(detectLang())
    const params = new URLSearchParams(window.location.search)
    const t = params.get('token'); setToken(t)
    if (!t) { setErrore('Link non valido'); setLoading(false); return }
    fetch(`/api/ospite?token=${t}`)
      .then(r => r.json())
      .then(data => { if (data.error) setErrore(data.error); else setPren(data) })
      .catch(() => setErrore('Errore di connessione'))
      .finally(() => setLoading(false))
  }, [])

  const changeLang = (l: Lang) => {
    setLang(l)
    try { localStorage.setItem('ospite_lang', l) } catch {}
  }

  const ricarica = async () => {
    if (!token) return
    const res = await fetch(`/api/ospite?token=${token}`)
    const data = await res.json()
    if (!data.error) setPren(data)
    setSlotAttivo(null)
  }

  const t = T[lang]

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#faf7f2', fontFamily: 'system-ui, sans-serif' }}>
      Caricamento...
    </div>
  )

  if (errore || !pren) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#faf7f2', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
        <h2 style={{ fontFamily: 'Georgia, serif', color: '#1c1917' }}>{t.linkNonValido}</h2>
        <p style={{ color: '#57534e' }}>{errore || t.linkNonValidoDesc}</p>
      </div>
    </div>
  )

  if (slotAttivo) {
    const numero = pren.ospiti.findIndex(o => o.slotId === slotAttivo.slotId) + 1
    return <FormOspite slot={slotAttivo} numero={numero} totale={pren.ospiti.length} pren={pren} token={token!} onSalvato={ricarica} onAnnulla={() => setSlotAttivo(null)} t={t} />
  }

  return <ListaOspiti pren={pren} onApri={setSlotAttivo} lang={lang} setLang={changeLang} t={t} />
}

// ── Stili ─────────────────────────────────────────────────
const pageStyle: React.CSSProperties = { maxWidth: 560, margin: '0 auto', padding: '20px 16px', background: '#faf7f2', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }
const cardStyle: React.CSSProperties = { background: 'white', border: '1px solid #e7e2d8', borderRadius: 12, padding: '18px 16px', marginBottom: 14 }
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid #e7e2d8', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', background: '#faf7f2', color: '#1c1917', boxSizing: 'border-box' }
const labelStyle: React.CSSProperties = { fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: '#44403c', fontWeight: 700, marginBottom: 6, display: 'block' }
const rowStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }
const sectionTitle: React.CSSProperties = { fontFamily: 'Georgia, serif', fontSize: 17, fontWeight: 600, margin: '0 0 14px', color: '#1c1917' }
const fotoBtnStyle: React.CSSProperties = { flex: 1, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', gap: 6, padding: '14px 8px', border: '1px dashed #d4cfc6', borderRadius: 8, background: '#faf7f2', color: '#44403c', cursor: 'pointer', fontSize: 12, fontWeight: 600, minHeight: 70, textAlign: 'center' as const }
const dropdownStyle: React.CSSProperties = { position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: 'white', border: '1px solid #e7e2d8', borderRadius: 8, boxShadow: '0 4px 20px rgba(28,25,23,0.08)', zIndex: 50, maxHeight: 260, overflowY: 'auto' }
const dropdownItemStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit', textAlign: 'left' }
const backBtnStyle: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#44403c', fontFamily: 'inherit', padding: '6px 0', fontWeight: 600 }
const btnPrimaryStyle: React.CSSProperties = { background: '#1c1917', color: 'white', border: 'none', padding: '14px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }
const btnSecondaryStyle: React.CSSProperties = { background: 'white', color: '#1c1917', border: '1px solid #e7e2d8', padding: '14px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }