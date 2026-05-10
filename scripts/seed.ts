import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('password123', 10)
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@miobnb.it' },
    update: {},
    create: {
      email: 'admin@miobnb.it',
      password,
      name: 'Amministratore',
    },
  })
  
  console.log('Utente creato:', user.email)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
  