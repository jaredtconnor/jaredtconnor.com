const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create a user
  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
    },
  });

  // Create posts
  for (let i = 1; i <= 5; i++) {
    await prisma.post.upsert({
      where: { slug: `sample-post-${i}` },
      update: {},
      create: {
        title: `Sample Post ${i}`,
        slug: `sample-post-${i}`,
        content: `This is sample content for post ${i}. It includes a variety of different elements like paragraphs, code blocks, and more.`,
        excerpt: `This is a sample excerpt for post ${i}.`,
        published: true,
      },
    });
  }

  // Create projects
  for (let i = 1; i <= 3; i++) {
    await prisma.project.upsert({
      where: { slug: `project-${i}` },
      update: {},
      create: {
        title: `Project ${i}`,
        slug: `project-${i}`,
        description: `This is a description for project ${i}.`,
        link: `https://example.com/project-${i}`,
        githubUrl: `https://github.com/yourusername/project-${i}`,
      },
    });
  }

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
