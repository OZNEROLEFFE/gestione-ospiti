'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function creaAppartamento(formData: FormData) {
  await prisma.appartamento.create({
    data: {
      nome: formData.get('nome') as string,
      cin: formData.get('cin') as string || null,
      cir: formData.get('cir') as string || null,
      codiceStruttura: formData.get('codiceStruttura') as string || null,
      indirizzo: formData.get('indirizzo') as string || null,
      note: formData.get('note') as string || null,
    },
  })
  revalidatePath('/dashboard/impostazioni')
}

export async function modificaAppartamento(id: string, formData: FormData) {
  await prisma.appartamento.update({
    where: { id },
    data: {
      nome: formData.get('nome') as string,
      cin: formData.get('cin') as string || null,
      cir: formData.get('cir') as string || null,
      codiceStruttura: formData.get('codiceStruttura') as string || null,
      indirizzo: formData.get('indirizzo') as string || null,
      note: formData.get('note') as string || null,
    },
  })
  revalidatePath('/dashboard/impostazioni')
}

export async function eliminaAppartamento(id: string) {
  await prisma.appartamento.delete({ where: { id } })
  revalidatePath('/dashboard/impostazioni')
}