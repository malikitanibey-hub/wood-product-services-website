require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password || password.length < 12) {
    throw new Error('Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 12 characters before seeding.');
  }

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash: await hash(password, 12), role: 'ADMIN', refreshTokenHash: null },
    create: { email, name: 'Administrator', passwordHash: await hash(password, 12), role: 'ADMIN' },
  });
  console.log(`Administrator account ready: ${email}`);
}

main().finally(() => prisma.$disconnect());
