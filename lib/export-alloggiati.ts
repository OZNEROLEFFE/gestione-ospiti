// Codici ufficiali Polizia di Stato per gli stati esteri (9 cifre)
const STATI_CODICI: Record<string, string> = {
  'ITALIA': '100000100',
  'AFGHANISTAN': '100000301',
  'ALBANIA': '100000201',
  'ALGERIA': '100000401',
  'ANDORRA': '100000202',
  'ANGOLA': '100000402',
  'ANTIGUA E BARBUDA': '100000503',
  'ARABIA SAUDITA': '100000302',
  'ARGENTINA': '100000602',
  'ARMENIA': '100000358',
  'AUSTRALIA': '100000701',
  'AUSTRIA': '100000203',
  'AZERBAIGIAN': '100000359',
  'BAHAMAS': '100000505',
  'BAHREIN': '100000304',
  'BANGLADESH': '100000305',
  'BARBADOS': '100000506',
  'BELGIO': '100000206',
  'BELIZE': '100000507',
  'BENIN': '100000406',
  'BHUTAN': '100000306',
  'BIELORUSSIA': '100000256',
  'BOLIVIA': '100000604',
  'BOSNIA ED ERZEGOVINA': '100000252',
  'BOTSWANA': '100000408',
  'BRASILE': '100000605',
  'BRUNEI DARUSSALAM': '100000309',
  'BULGARIA': '100000209',
  'BURKINA FASO': '100000409',
  'BURUNDI': '100000410',
  'CAMBOGIA': '100000310',
  'CAMERUN': '100000411',
  'CANADA': '100000509',
  'CAPO VERDE': '100000413',
  'CIAD': '100000415',
  'CILE': '100000606',
  'CINA': '100000314',
  'CIPRO': '100000315',
  'COLOMBIA': '100000608',
  'COMORE': '100000417',
  'CONGO': '100000418',
  'COREA DEL NORD': '100000319',
  'COREA DEL SUD': '100000320',
  "COSTA D'AVORIO": '100000404',
  'COSTA RICA': '100000513',
  'CROAZIA': '100000250',
  'CUBA': '100000514',
  'DANIMARCA': '100000212',
  'DOMINICA': '100000515',
  'ECUADOR': '100000609',
  'EGITTO': '100000419',
  'EL SALVADOR': '100000517',
  'EMIRATI ARABI UNITI': '100000322',
  'ERITREA': '100000466',
  'ESTONIA': '100000247',
  'ETIOPIA': '100000420',
  'FEDERAZIONE RUSSA': '100000245',
  'FIGI': '100000703',
  'FILIPPINE': '100000323',
  'FINLANDIA': '100000214',
  'FRANCIA': '100000215',
  'GABON': '100000421',
  'GAMBIA': '100000422',
  'GEORGIA': '100000360',
  'GERMANIA': '100000216',
  'GHANA': '100000423',
  'GIAMAICA': '100000518',
  'GIAPPONE': '100000326',
  'GIBUTI': '100000424',
  'GIORDANIA': '100000327',
  'GRECIA': '100000220',
  'GRENADA': '100000519',
  'GUATEMALA': '100000523',
  'GUINEA': '100000425',
  'GUINEA BISSAU': '100000426',
  'GUINEA EQUATORIALE': '100000427',
  'GUYANA': '100000612',
  'HAITI': '100000524',
  'HONDURAS': '100000525',
  'INDIA': '100000330',
  'INDONESIA': '100000331',
  'IRAN': '100000332',
  'IRAQ': '100000333',
  'IRLANDA': '100000221',
  'ISLANDA': '100000223',
  'ISRAELE': '100000334',
  'KAZAKISTAN': '100000356',
  'KENYA': '100000428',
  'KIRGHIZISTAN': '100000361',
  'KIRIBATI': '100000708',
  'KOSOVO': '100001002',
  'KUWAIT': '100000335',
  'LAOS': '100000336',
  'LESOTHO': '100000429',
  'LETTONIA': '100000248',
  'LIBANO': '100000337',
  'LIBERIA': '100000430',
  'LIBIA': '100000431',
  'LIECHTENSTEIN': '100000225',
  'LITUANIA': '100000249',
  'LUSSEMBURGO': '100000226',
  'MADAGASCAR': '100000432',
  'MALAWI': '100000434',
  'MALDIVE': '100000339',
  'MALI': '100000435',
  'MALTA': '100000227',
  'MAROCCO': '100000436',
  'MAURITANIA': '100000437',
  'MAURIZIO': '100000438',
  'MESSICO': '100000527',
  'MOLDAVIA': '100000254',
  'MONACO': '100000229',
  'MONGOLIA': '100000341',
  'MONTENEGRO': '100001001',
  'MOZAMBICO': '100000440',
  'MYANMAR-BIRMANIA': '100000307',
  'NAMIBIA': '100000441',
  'NAURU': '100000715',
  'NEPAL': '100000342',
  'NICARAGUA': '100000529',
  'NIGER': '100000442',
  'NIGERIA': '100000443',
  'NORVEGIA': '100000231',
  'NUOVA ZELANDA': '100000719',
  'OMAN': '100000343',
  'PAESI BASSI': '100000232',
  'PAKISTAN': '100000344',
  'PALESTINA': '110000001',
  'PANAMA': '100000530',
  'PARAGUAY': '100000614',
  "PERU'": '100000615',
  'POLONIA': '100000233',
  'PORTOGALLO': '100000234',
  'QATAR': '100000345',
  'REGNO UNITO': '100000219',
  'REPUBBLICA CECA': '100000257',
  'REPUBBLICA CENTRAFRICANA': '100000414',
  'REPUBBLICA DEMOCRATICA DEL CONGO': '100000998',
  'REPUBBLICA DOMINICANA': '100000516',
  'REPUBBLICA SLOVACCA': '100000255',
  'ROMANIA': '100000235',
  'RUANDA': '100000446',
  'SAINT LUCIA': '100000532',
  'SAMOA': '100000727',
  'SAN MARINO': '100000236',
  'SAO TOME E PRINCIPE': '100000448',
  'SENEGAL': '100000450',
  'SERBIA': '100001000',
  'SEYCHELLES': '100000449',
  'SIERRA LEONE': '100000451',
  'SINGAPORE': '100000346',
  'SIRIA': '100000348',
  'SLOVENIA': '100000251',
  'SOMALIA': '100000453',
  'SPAGNA': '100000239',
  'SRI LANKA (CEYLON)': '100000311',
  "STATI UNITI D'AMERICA": '100000536',
  "STATO DELLA CITTA' DEL VATICANO": '100000246',
  'SUD SUDAN': '100000467',
  'SUDAFRICA': '100000454',
  'SUDAN': '100000455',
  'SURINAME': '100000616',
  'SVEZIA': '100000240',
  'SVIZZERA': '100000241',
  'SWAZILAND': '100000456',
  'TAGIKISTAN': '100000362',
  'TAIWAN': '100000363',
  'TANZANIA': '100000457',
  'THAILANDIA': '100000349',
  'TOGO': '100000458',
  'TONGA': '100000730',
  'TRINIDAD E TOBAGO': '100000617',
  'TUNISIA': '100000460',
  'TURCHIA': '100000351',
  'TURKMENISTAN': '100000364',
  'TUVALU': '100000731',
  'UCRAINA': '100000243',
  'UGANDA': '100000461',
  'UNGHERIA': '100000244',
  'URUGUAY': '100000618',
  'UZBEKISTAN': '100000357',
  'VANUATU': '100000732',
  'VENEZUELA': '100000619',
  'VIETNAM': '100000353',
  'YEMEN': '100000354',
  'ZAMBIA': '100000464',
  'ZIMBABWE': '100000465',
}

export function getCodiceStato(nomeStato: string | null | undefined): string {
  if (!nomeStato) return '100000100'
  const key = nomeStato.toUpperCase().trim()
  return STATI_CODICI[key] || '100000100'
}

function padR(str: string | null | undefined, len: number): string {
  return String(str || '').slice(0, len).padEnd(len, ' ')
}

function formatDataAW(date: Date | string | null | undefined): string {
  if (!date) return '          '
  const d = new Date(date)
  if (isNaN(d.getTime())) return '          '
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

function calcolaNotti(checkIn: Date | string, checkOut: Date | string): number {
  const a = new Date(checkIn)
  const b = new Date(checkOut)
  const diff = Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(1, diff)
}

function tipoDocLabel(t: string | null | undefined): string {
  const map: Record<string, string> = {
    IDENT: "Carta d'identità",
    IDELE: "Carta d'identità elettronica",
    PASOR: 'Passaporto',
  }
  return map[t || ''] || t || ''
}

type OspiteExport = {
  cognome: string | null
  nome: string | null
  sesso: string | null
  dataNascita: Date | string | null
  cittadinanzaTesto: string | null
  codiceComuneNascita: string | null
  provinciaNascita: string | null
  statoNascita: string | null
  comuneResidenza: string | null
  provinciaResidenza: string | null
  codiceComuneResidenza: string | null
  statoResidenza: string | null
  indirizzoResidenza: string | null
  capResidenza: string | null
  tipoDocumento: string | null
  numeroDocumento: string | null
  luogoRilascio: string | null
  provinciaRilascio: string | null
  codiceComuneRilascio: string | null
  statoRilascio: string | null
  isCapogruppo: boolean
}

type PrenotazioneExport = {
  checkIn: Date | string
  checkOut: Date | string
  nomeOspite: string
  tipoGruppo: string | null
  ospiti: OspiteExport[]
}

type AppartamentoExport = {
  cin: string | null
  cir: string | null
  codiceStruttura: string | null
  nome: string
} | null

// ── ALLOGGIATI WEB — tracciato ufficiale 168 caratteri ──────────────────
export function generaFileAlloggiati(
  pren: PrenotazioneExport,
  ospitiCompleti: OspiteExport[]
): string {
  const totale = ospitiCompleti.length
  const isFamiglia = pren.tipoGruppo === 'famiglia'

  const ospitiOrdinati = [...ospitiCompleti].sort((a, b) => {
    if (a.isCapogruppo && !b.isCapogruppo) return -1
    if (!a.isCapogruppo && b.isCapogruppo) return 1
    return 0
  })
  const righe = ospitiOrdinati.map((o) => {
    let tipoAll: string
    if (totale === 1) tipoAll = '16'
    else if (o.isCapogruppo) tipoAll = isFamiglia ? '17' : '18'
    else tipoAll = isFamiglia ? '19' : '20'

    const codCittadinanza = getCodiceStato(o.cittadinanzaTesto)
    const isItaliano = (o.cittadinanzaTesto || '').toUpperCase().trim() === 'ITALIA'

    // Comune nascita: solo se italiano
    let codComuneNascita = '         '
    let provNascita = '  '
    if (isItaliano && o.codiceComuneNascita) {
      codComuneNascita = o.codiceComuneNascita
      provNascita = padR(o.provinciaNascita, 2)
    }

    // Stato di nascita
    const codStatoNascita = isItaliano
      ? '100000100'
      : getCodiceStato(o.statoNascita) || codCittadinanza

    // Luogo rilascio documento
    let codLuogoRilascio = '         '
    if (o.tipoDocumento) {
      const statoRil = (o.statoRilascio || 'ITALIA').toUpperCase()
      if (statoRil === 'ITALIA' && o.codiceComuneRilascio) {
        codLuogoRilascio = o.codiceComuneRilascio
      } else {
        codLuogoRilascio = getCodiceStato(o.statoRilascio)
      }
    }

    const notti = String(calcolaNotti(pren.checkIn, pren.checkOut)).padStart(2, '0')

    const riga =
      padR(tipoAll, 2) +
      padR(formatDataAW(pren.checkIn), 10) +
      notti +
      padR(o.cognome, 50) +
      padR(o.nome, 30) +
      (o.sesso === 'F' ? '2' : '1') +
      padR(formatDataAW(o.dataNascita), 10) +
      padR(codComuneNascita, 9) +
      padR(provNascita, 2) +
      padR(codStatoNascita, 9) +
      padR(codCittadinanza, 9) +
      padR(o.tipoDocumento, 5) +
      padR(o.numeroDocumento, 20) +
      padR(codLuogoRilascio, 9)

    return riga
  })

  return righe.join('\r\n') + '\r\n'
}

// ── ROSS1000 Lombardia — CSV ─────────────────────────────────────────────
export function generaFileRoss1000(
  pren: PrenotazioneExport,
  ospitiCompleti: OspiteExport[],
  appartamento: AppartamentoExport
): string {
  const codiceStruttura = appartamento?.codiceStruttura || ''
  const isFamiglia = pren.tipoGruppo === 'famiglia'
  const totale = ospitiCompleti.length

  // Ordina: capogruppo prima
  const ospitiOrdinati = [...ospitiCompleti].sort((a, b) => {
    if (a.isCapogruppo && !b.isCapogruppo) return -1
    if (!a.isCapogruppo && b.isCapogruppo) return 1
    return 0
  })

  // Genera ID univoci per ogni ospite
  const ids = ospitiOrdinati.map(() => Math.random().toString(16).slice(2, 18))
  const idCapo = ids[0]

  const formatData = (d: Date | string | null | undefined): string => {
    if (!d) return ''
    const dt = new Date(d)
    if (isNaN(dt.getTime())) return ''
    return `${dt.getFullYear()}${String(dt.getMonth() + 1).padStart(2, '0')}${String(dt.getDate()).padStart(2, '0')}`
  }

  const dataCheckIn = formatData(pren.checkIn)

  const getTipoAlloggiato = (o: OspiteExport, idx: number): string => {
    if (totale === 1) return '16'
    if (idx === 0) return isFamiglia ? '17' : '18'
    return isFamiglia ? '19' : '20'
  }

  const arriviXml = ospitiOrdinati.map((o, i) => {
    const tipo = getTipoAlloggiato(o, i)
    const isItaliano = (o.cittadinanzaTesto || '').toUpperCase().trim() === 'ITALIA'
    const codCittadinanza = getCodiceStato(o.cittadinanzaTesto)
    const codStatoNascita = isItaliano ? '100000100' : getCodiceStato(o.statoNascita) || codCittadinanza
    const codStatoResidenza = getCodiceStato(o.statoResidenza || 'ITALIA')
    const comuneNascita = isItaliano ? (o.codiceComuneNascita || '') : ''
    const comuneResidenza = o.codiceComuneResidenza || ''

    return `        <arrivo>
            <idswh>${ids[i]}</idswh>
            <tipoalloggiato>${tipo}</tipoalloggiato>
            <idcapo>${i === 0 ? '' : idCapo}</idcapo>
            <cognome>${o.cognome || ''}</cognome>
            <nome>${o.nome || ''}</nome>
            <sesso>${o.sesso === 'F' ? 'F' : 'M'}</sesso>
            <cittadinanza>${codCittadinanza}</cittadinanza>
            <statoresidenza>${codStatoResidenza}</statoresidenza>
            <luogoresidenza>${comuneResidenza}</luogoresidenza>
            <datanascita>${formatData(o.dataNascita)}</datanascita>
            <statonascita>${codStatoNascita}</statonascita>
            <comunenascita>${comuneNascita}</comunenascita>
            <tipoturismo>Non Specificato</tipoturismo>
            <mezzotrasporto>Non Specificato</mezzotrasporto>
            <canaleprenotazione>Non Specificato</canaleprenotazione>
            <titolostudio>Non Specificato</titolostudio>
            <professione></professione>
            <esenzioneimposta></esenzioneimposta>
        </arrivo>`
  }).join('\n')

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<movimenti>
    <codice>${codiceStruttura}</codice>
    <prodotto>GESTIONE-OSPITI</prodotto>
    <movimento>
        <data>${dataCheckIn}</data>
        <struttura>
            <apertura>SI</apertura>
            <camereoccupate>1</camereoccupate>
            <cameredisponibili>1</cameredisponibili>
            <lettidisponibili>${totale}</lettidisponibili>
        </struttura>
        <arrivi>
${arriviXml}
        </arrivi>
        <partenze/>
        <prenotazioni/>
        <rettifiche/>
    </movimento>
</movimenti>`
}