import { NextResponse } from 'next/server'
import { COMUNI } from '@/lib/comuni-data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.toLowerCase().trim()
  if (!q || q.length < 2) return NextResponse.json([])
  const results = COMUNI
    .filter(c => c.nome.toLowerCase().startsWith(q))
    .slice(0, 40)
  return NextResponse.json(results)
}