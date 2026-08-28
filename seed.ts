import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...');
  
  // Clean up existing
  await prisma.user.deleteMany({});
  
  // Create Test User
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: 'password123',
    }
  });

  // Create Profile
  const profile = await prisma.profile.create({
    data: {
      userId: user.id,
      username: 'testuser',
      displayName: 'Test User',
      bio: 'This is a test link-in-bio profile created for demonstration purposes. Welcome to my space!',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      themeConfig: JSON.stringify({
        glassmorphism: true,
        backgroundImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
        fontFamily: 'Inter, sans-serif',
        buttonStyle: 'rounded',
      })
    }
  });

  // Create Social Links
  await prisma.socialLink.createMany({
    data: [
      { platform: 'twitter', url: 'https://twitter.com', profileId: profile.id, order: 1 },
      { platform: 'github', url: 'https://github.com', profileId: profile.id, order: 2 },
      { platform: 'youtube', url: 'https://youtube.com', profileId: profile.id, order: 3 },
      { platform: 'instagram', url: 'https://instagram.com', profileId: profile.id, order: 4 },
    ]
  });

  // Create Blocks
  await prisma.block.create({
    data: {
      type: 'header_text',
      data: JSON.stringify({ text: 'My Projects' }),
      profileId: profile.id,
      order: 1
    }
  });

  await prisma.block.create({
    data: {
      type: 'standard_link',
      data: JSON.stringify({ title: 'My Awesome Portfolio', url: 'https://example.com/portfolio', animate: true }),
      profileId: profile.id,
      order: 2
    }
  });

  await prisma.block.create({
    data: {
      type: 'standard_link',
      data: JSON.stringify({ title: 'Read my latest Blog', url: 'https://example.com/blog', animate: false }),
      profileId: profile.id,
      order: 3
    }
  });

  await prisma.block.create({
    data: {
      type: 'header_text',
      data: JSON.stringify({ text: 'Watch my latest video' }),
      profileId: profile.id,
      order: 4
    }
  });

  await prisma.block.create({
    data: {
      type: 'embed_block',
      data: JSON.stringify({ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', provider: 'youtube' }),
      profileId: profile.id,
      order: 5
    }
  });

  await prisma.block.create({
    data: {
      type: 'contact_card',
      data: JSON.stringify({ title: 'Get in Touch', emailTo: 'test@example.com' }),
      profileId: profile.id,
      order: 6
    }
  });

  console.log('Database seeded successfully!');
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
