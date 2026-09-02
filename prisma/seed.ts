import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const admin = await prisma.admin.upsert({
    where: { username: 'teacher' },
    update: {},
    create: {
      username: 'teacher',
      password: 'password123', // Change this to your preferred password
    },
  })
  console.log('Seeded Admin:', admin)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })