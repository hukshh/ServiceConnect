const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');

dotenv.config();

// Seeds the database with 5 default service categories
const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    const categories = [
      {
        name: 'Electrician',
        description: 'Electrical repairs, wiring, installations, and maintenance services.',
        icon: '⚡',
      },
      {
        name: 'Plumber',
        description: 'Plumbing repairs, pipe installations, leak fixes, and drainage solutions.',
        icon: '🔧',
      },
      {
        name: 'Tutor',
        description: 'Academic tutoring for all subjects and levels, online or in-person.',
        icon: '📚',
      },
      {
        name: 'AC Repair',
        description: 'Air conditioner servicing, repairs, installation, and gas refilling.',
        icon: '❄️',
      },
      {
        name: 'Cleaner',
        description: 'Home and office deep cleaning, carpet cleaning, and sanitization.',
        icon: '🧹',
      },
    ];

    // Delete existing categories and insert fresh ones
    await Category.deleteMany({});
    const created = await Category.insertMany(categories);
    console.log(`✅ Seeded ${created.length} categories successfully:`);
    created.forEach((cat) => console.log(`   ${cat.icon} ${cat.name}`));

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

seedCategories();
