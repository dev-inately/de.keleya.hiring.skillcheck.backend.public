import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
  // I can use promise.all/Settled, but I need the id to be sequential for the sake of the Postman test
  await prisma.user.create({
    data: {
      name: 'Richard Cypher',
      email: 'richard@lots.com',
      credential: { create: { hash: hashSync('admin123#', 10) } },
      is_admin: true,
      email_confirmed: true,
    },
  });
  await prisma.user.create({
    data: {
      name: 'Jack ma',
      email: 'jm@alibaba.com',
      credential: { create: { hash: hashSync('randonuser247$', 10) } },
    },
  });
  await prisma.user.create({
    data: {
      name: 'Zeddicus "Zul Zorrander',
      email: 'zedd@lots.com',
      credential: { create: { hash: hashSync('themagixstaff@', 10) } },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
