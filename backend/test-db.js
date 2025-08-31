const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    console.log('MongoDB URI:', process.env.MONGODB_URI || 'mongodb://localhost:27017/dsa-game');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dsa-game');
    console.log('✅ Connected to MongoDB');

    // Test models
    const Achievement = require('./models/Achievement');
    const Level = require('./models/Level');
    const Problem = require('./models/Problem');

    // Check if collections exist and have data
    const achievementCount = await Achievement.countDocuments();
    const levelCount = await Level.countDocuments();
    const problemCount = await Problem.countDocuments();

    console.log('📊 Database Status:');
    console.log(`   Achievements: ${achievementCount}`);
    console.log(`   Levels: ${levelCount}`);
    console.log(`   Problems: ${problemCount}`);

    if (achievementCount === 0) {
      console.log('⚠️  No achievements found. Run "npm run seed" to populate the database.');
    }

    if (levelCount === 0) {
      console.log('⚠️  No levels found. Run "npm run seed" to populate the database.');
    }

    if (problemCount === 0) {
      console.log('⚠️  No problems found. Run "npm run seed" to populate the database.');
    }

    if (achievementCount > 0 && levelCount > 0 && problemCount > 0) {
      console.log('✅ Database is properly seeded!');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    process.exit(1);
  }
}

testDatabase();