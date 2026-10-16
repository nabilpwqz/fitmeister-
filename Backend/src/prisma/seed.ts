import bcrypt from 'bcryptjs';
import { prisma } from './client';

async function main() {
  console.log('[FitMeister Seed] Seeding production demo database...');

  // 1. Password hashing
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Password123', salt);

  // 2. Clear existing records safely
  await prisma.auditLog.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.favorite.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.availabilityBlock.deleteMany({});
  await prisma.operatingHour.deleteMany({});
  await prisma.roomImage.deleteMany({});
  await prisma.room.deleteMany({});
  await prisma.user.deleteMany({});

  // 3. Create core users
  const adminUser = await prisma.user.create({
    data: {
      name: 'System Administrator',
      email: 'admin@fitmeister.com',
      passwordHash,
      role: 'ADMIN',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    },
  });

  const hostUser = await prisma.user.create({
    data: {
      name: 'Marcus Vance',
      email: 'marcus@fitmeister.com',
      passwordHash,
      role: 'HOST',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    },
  });

  const studentUser = await prisma.user.create({
    data: {
      name: 'Alex Rivera',
      email: 'athlete@fitmeister.com',
      passwordHash,
      role: 'CUSTOMER',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    },
  });

  console.log('[FitMeister Seed] Created demo users (password: Password123 for all):');
  console.log(' - Admin: admin@fitmeister.com');
  console.log(' - Trainer/Host: marcus@fitmeister.com');
  console.log(' - Athlete/Member: athlete@fitmeister.com');

  // 4. Create rooms with photographs and operating hours
  const roomsData = [
    {
      name: 'Oakwood Quiet Haven',
      description: 'An isolated sanctuary tailored for deep uninterrupted focus, dissertation drafting, and final exam preparation.',
      floor: '3rd Floor - East Wing',
      capacity: 4,
      hourlyRate: 5.0,
      city: 'Pabna',
      address: 'Central University Library, Floor 3',
      amenities: ['Wi-Fi 6', 'Quiet Zone', 'Power Outlets', 'Ergonomic Task Chairs'],
      ownerId: hostUser.id,
      images: [
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Alpha Team Collaborative Suite',
      description: 'Engineered for group research seminars and multi-display sprint sessions with interactive writable surfaces.',
      floor: '1st Floor - Commons',
      capacity: 8,
      hourlyRate: 12.0,
      city: 'Pabna',
      address: 'Graduate Student Center, Suite 104',
      amenities: ['Magnetic Whiteboard', '4K Projection Display', 'Wi-Fi 6', 'Conference Speakerphone'],
      ownerId: hostUser.id,
      images: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Zen Den Acoustic Pod',
      description: 'Laboratory-grade acoustic insulation providing complete dampening for dissertation defences and audio analysis.',
      floor: '4th Floor - Penthouse',
      capacity: 2,
      hourlyRate: 7.0,
      city: 'Pabna',
      address: 'Acoustic Sciences Annex, Room 402',
      amenities: ['Acoustic Insulation', 'Climate Control', 'Power Outlets', 'Adjustable Lighting'],
      ownerId: hostUser.id,
      images: [
        'https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Pine Tree Ergonomic Micro-Pod',
      description: 'Compact personal workstation featuring electric height-adjustable desk and dedicated ambient illumination.',
      floor: '2nd Floor - Science Library',
      capacity: 1,
      hourlyRate: 4.5,
      city: 'Pabna',
      address: 'Science & Engineering Library, Pod 22',
      amenities: ['Standing Desk', 'Wi-Fi 6', 'Dual Monitor Arm', 'Noise Dampening'],
      ownerId: adminUser.id,
      images: [
        'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Edison Creative Design Hub',
      description: 'Spacious studio environment ideal for architecture reviews, physical drafting, and collaborative presentation practice.',
      floor: 'Ground Floor - Innovation Wing',
      capacity: 12,
      hourlyRate: 15.0,
      city: 'Pabna',
      address: 'Innovation Lab Pavilion, Studio B',
      amenities: ['Drafting Tables', 'Dual Projectors', 'High-Speed LAN', 'Coffee Station'],
      ownerId: adminUser.id,
      images: [
        'https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Newton Academic Research Chamber',
      description: 'Refined scholarly space flanked by reference shelves with brass study lamps and wide walnut timber tables.',
      floor: '3rd Floor - North Archive',
      capacity: 3,
      hourlyRate: 6.0,
      city: 'Pabna',
      address: 'Special Collections Wing, Chamber 312',
      amenities: ['Quiet Zone', 'Individual Reading Lamps', 'Power Outlets', 'Wi-Fi 6'],
      ownerId: hostUser.id,
      images: [
        'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Franklin Digital Recording & Podcast Studio',
      description: 'Acoustically shielded recording studio with calibrated studio microphones, pop guards, 4K camera rig, and directional studio monitors.',
      floor: 'Sub-Level 1 - Media Center',
      capacity: 2,
      hourlyRate: 9.0,
      city: 'Pabna',
      address: 'Digital Arts & Media Center, Studio 14',
      amenities: ['Acoustic Insulation', 'Podcast Microphones', '4K Camera Rig', 'Adjustable Lighting'],
      ownerId: hostUser.id,
      images: [
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Curie Honors Collaborative Research Lab',
      description: 'Designed for computational project groups, offering dual 65-inch presentation screens, modular rolling desks, and high-density power rails.',
      floor: '2nd Floor - STEM Annex',
      capacity: 6,
      hourlyRate: 11.0,
      city: 'Pabna',
      address: 'STEM Pavilion, Research Lab 208',
      amenities: ['Dual Presentation Screens', 'Modular Desks', 'Wi-Fi 6', 'Whiteboard Wall'],
      ownerId: adminUser.id,
      images: [
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Hypatia Silent Reading Alcove',
      description: 'Serene individual reading nook set against garden-facing windows, with velvet ergonomic armchair, solid brass reading sconce, and ottoman.',
      floor: '4th Floor - Special Collections',
      capacity: 1,
      hourlyRate: 4.0,
      city: 'Pabna',
      address: 'Rare Manuscripts Library, Alcove 418',
      amenities: ['Quiet Zone', 'Natural Daylight', 'Plush Armchair', 'Brass Reading Lamp'],
      ownerId: hostUser.id,
      images: [
        'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Turing Algorithmic Intensive Chamber',
      description: 'High-focus workstation for algorithmic sprints, featuring dual curved ultra-wide displays, high-speed wired Ethernet, and whiteboard walls.',
      floor: '3rd Floor - East Wing',
      capacity: 4,
      hourlyRate: 8.5,
      city: 'Pabna',
      address: 'Central University Library, Chamber 342',
      amenities: ['Curved Ultra-Wide Displays', 'Dry Erase Wall', 'High-Speed LAN', 'Ergonomic Task Chairs'],
      ownerId: adminUser.id,
      images: [
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Aristotle Executive Defense Suite',
      description: 'Distinguished conference chamber suited for thesis defenses, oral examinations, and interdepartmental academic colloquia.',
      floor: '1st Floor - Law Commons',
      capacity: 16,
      hourlyRate: 18.0,
      city: 'Pabna',
      address: 'Law & Jurisprudence Pavilion, Suite 101',
      amenities: ['Conference Microphone Array', 'Motorized Projector Screen', 'Executive Seating', 'Wi-Fi 6'],
      ownerId: hostUser.id,
      images: [
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      name: 'Ada Lovelace Autonomous Focus Cell',
      description: 'Ergonomically tuned solo cell with sit-stand motorized desk, anti-fatigue balance mat, dual gas monitor mount, and ambient noise dampening.',
      floor: '2nd Floor - Science Library',
      capacity: 1,
      hourlyRate: 5.0,
      city: 'Pabna',
      address: 'Science & Engineering Library, Cell 209',
      amenities: ['Standing Desk', 'Anti-Fatigue Mat', 'Noise Dampening', 'Dual Monitor Arm'],
      ownerId: adminUser.id,
      images: [
        'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=800&q=80',
      ],
    },
  ];

  for (const rData of roomsData) {
    const { images, amenities, ...fields } = rData;
    const room = await prisma.room.create({
      data: {
        ...fields,
        amenities: amenities ?? [],
        isPublished: true,
        isApproved: true,
        images: {
          create: images.map((url, idx) => ({ url, sortOrder: idx })),
        },
        operatingHours: {
          create: [0, 1, 2, 3, 4, 5, 6].map(day => ({
            dayOfWeek: day,
            openTime: '08:00',
            closeTime: '22:00',
            isOpen: true,
          })),
        },
      },
    });

    // Add a verified review
    const pastStart = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const pastEnd = new Date(pastStart.getTime() + 2 * 60 * 60 * 1000);

    const booking = await prisma.booking.create({
      data: {
        roomId: room.id,
        userId: studentUser.id,
        date: pastStart.toISOString().split('T')[0],
        startTime: pastStart,
        endTime: pastEnd,
        attendeeCount: 1,
        totalAmount: room.hourlyRate * 2,
        status: 'CONFIRMED',
        notes: 'Final exam study session.',
      },
    });

    await prisma.review.create({
      data: {
        roomId: room.id,
        userId: studentUser.id,
        bookingId: booking.id,
        rating: 5,
        comment: 'Superb environment. Acoustic containment was flawless and power sockets were readily accessible.',
      },
    });
  }

  console.log('[FitMeister Seed] Database seeded successfully with verified classes, studio rooms, schedules, and reviews.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

