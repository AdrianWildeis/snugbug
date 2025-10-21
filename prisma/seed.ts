import { PrismaClient } from '@/generated/prisma';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting to seed database...');

  // Create users with locations
  const user1 = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice Johnson',
      location: 'Geneva',
      phone: '+41 79 123 45 67',
      emailVerified: new Date(),
    },
  });
  console.log('✅ Created user:', user1.email);

  const user2 = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      name: 'Bob Smith',
      location: 'Lausanne',
      phone: '+41 78 987 65 43',
      emailVerified: new Date(),
    },
  });
  console.log('✅ Created user:', user2.email);

  const user3 = await prisma.user.create({
    data: {
      email: 'carol@example.com',
      name: 'Carol Davis',
      location: 'Nyon',
      emailVerified: new Date(),
    },
  });
  console.log('✅ Created user:', user3.email);

  // Create listings with new schema
  const listings = [
    {
      title: 'Premium Baby Stroller - Lightweight & Foldable',
      description: 'Lightweight jogging stroller in excellent condition. Perfect for active parents. Includes rain cover and storage basket. Used for only 6 months.',
      price: new Decimal('120.00'),
      category: 'strollers',
      condition: 'like-new',
      location: 'Geneva',
      ageRange: '0-6 months',
      brand: 'Bugaboo',
      images: ['https://images.unsplash.com/photo-1588772604686-bff7733db001?w=400&h=400&fit=crop'],
      userId: user1.id,
    },
    {
      title: 'Solid Wood Baby Crib - Convertible',
      description: 'Beautiful solid oak crib, barely used. Converts to toddler bed. Includes organic mattress and fitted sheets. Non-toxic finish.',
      price: new Decimal('280.00'),
      category: 'beds',
      condition: 'like-new',
      location: 'Geneva',
      brand: 'IKEA',
      images: ['https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400&h=400&fit=crop'],
      userId: user1.id,
    },
    {
      title: 'Adjustable High Chair - Modern Design',
      description: 'Modern high chair with 7 height positions and removable tray. Easy to clean and fold for storage. Perfect condition!',
      price: new Decimal('85.00'),
      category: 'furniture',
      condition: 'good',
      location: 'Lausanne',
      ageRange: '6-12 months',
      brand: 'Stokke',
      images: ['https://images.unsplash.com/photo-1606922063421-76f65b4b4403?w=400&h=400&fit=crop'],
      userId: user2.id,
    },
    {
      title: 'Video Baby Monitor with Night Vision',
      description: 'HD video baby monitor with crystal clear night vision and two-way audio. Includes wall mount and portable parent unit. Battery lasts 8 hours.',
      price: new Decimal('65.00'),
      category: 'monitors',
      condition: 'good',
      location: 'Lausanne',
      brand: 'Motorola',
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'],
      userId: user2.id,
    },
    {
      title: 'Infant Car Seat - Safety Tested',
      description: 'Rear-facing infant car seat (0-13kg), never been in an accident. Includes Isofix base and multiple headrest positions. Meets all Swiss safety standards.',
      price: new Decimal('140.00'),
      category: 'car-seats',
      condition: 'like-new',
      location: 'Geneva',
      ageRange: '0-6 months',
      brand: 'Maxi-Cosi',
      images: ['https://images.unsplash.com/photo-1617806118233-05a0e1d72c78?w=400&h=400&fit=crop'],
      userId: user1.id,
    },
    {
      title: 'Organic Cotton Onesies Set (6 pieces)',
      description: 'Set of 6 organic cotton onesies, sizes 0-3 months. Gentle on baby skin, GOTS certified. Washed but barely worn, perfect condition.',
      price: new Decimal('28.00'),
      category: 'clothing',
      condition: 'new',
      location: 'Nyon',
      ageRange: '0-6 months',
      size: '0-3 months',
      images: ['https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=400&h=400&fit=crop'],
      userId: user3.id,
    },
    {
      title: 'Educational Wooden Toys Set',
      description: 'Set of wooden building blocks and shape sorter. Promotes fine motor skills and creativity. All natural, non-toxic materials.',
      price: new Decimal('35.00'),
      category: 'toys',
      condition: 'good',
      location: 'Lausanne',
      ageRange: '1-2 years',
      brand: 'Hape',
      images: ['https://images.unsplash.com/photo-1587912781053-c18ab03b2f60?w=400&h=400&fit=crop'],
      userId: user2.id,
    },
    {
      title: 'Baby Bath Tub with Temperature Indicator',
      description: 'Soft-sided baby bath tub with built-in newborn support sling. Color-changing temperature indicator for safety. Includes 3 bath toys.',
      price: new Decimal('32.00'),
      category: 'bathing',
      condition: 'good',
      location: 'Geneva',
      ageRange: '0-6 months',
      images: ['https://images.unsplash.com/photo-1600857544200-242c985c0f55?w=400&h=400&fit=crop'],
      userId: user1.id,
    },
    {
      title: 'Electric Breast Pump - Hospital Grade',
      description: 'Medela electric double breast pump, hospital grade quality. Includes carrying case, bottles, and multiple flange sizes (S, M, L). Sterilized and ready to use.',
      price: new Decimal('165.00'),
      category: 'feeding',
      condition: 'like-new',
      location: 'Nyon',
      brand: 'Medela',
      images: ['https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop'],
      userId: user3.id,
    },
    {
      title: 'Baby Books Collection (10 Board Books)',
      description: 'Set of 10 popular board books for babies and toddlers. Classic stories including "The Very Hungry Caterpillar" and educational content. All in excellent condition.',
      price: new Decimal('22.00'),
      category: 'books',
      condition: 'good',
      location: 'Lausanne',
      ageRange: '0-6 months',
      images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop'],
      userId: user2.id,
    },
  ];

  for (const listingData of listings) {
    const listing = await prisma.listing.create({
      data: listingData,
    });
    console.log(`✅ Created listing: ${listing.title} (CHF ${listing.price})`);
  }

  console.log('🎉 Database seeding completed!');
  console.log('\n📧 Test Users (for OAuth sign-in):');
  console.log('- alice@example.com (Alice Johnson - Geneva)');
  console.log('- bob@example.com (Bob Smith - Lausanne)');
  console.log('- carol@example.com (Carol Davis - Nyon)');
  console.log('\n🛍️  Sample Listings: 10 baby items across all categories');
  console.log('   Categories: strollers, beds, furniture, monitors, car-seats, clothing, toys, bathing, feeding, books');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
