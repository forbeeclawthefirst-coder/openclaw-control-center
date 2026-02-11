const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create default user first
  let user = await prisma.user.findUnique({
    where: { email: 'admin@openclaw.local' }
  });
  
  if (!user) {
    user = await prisma.user.create({
      data: {
        id: 'system-user',
        email: 'admin@openclaw.local',
        name: 'System Admin'
      }
    });
    console.log('Created user:', user.email);
  }

  // Create default organization
  let org = await prisma.organization.findUnique({
    where: { slug: 'default' }
  });
  
  if (!org) {
    org = await prisma.organization.create({
      data: {
        id: 'default-org',
        slug: 'default',
        name: 'Default Organization',
        ownerId: user.id
      }
    });
    console.log('Created organization:', org.name);
  }

  console.log('Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });