const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;

const connectDB = async () => {
  try {
    // Try connecting to local MongoDB first
    if (process.env.MONGO_URI && !process.env.USE_MEMORY_DB) {
      try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
          serverSelectionTimeoutMS: 3000
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return;
      } catch (err) {
        console.log('Local MongoDB not available, starting in-memory database...');
      }
    }

    // Fallback to in-memory MongoDB
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log(`In-Memory MongoDB Connected: ${uri}`);

    // Auto-seed since in-memory DB is empty
    await seedDatabase();
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

async function seedDatabase() {
  const Crop = require('../models/Crop');
  const MandiPrice = require('../models/MandiPrice');
  const Question = require('../models/Question');
  const User = require('../models/User');

  const cropCount = await Crop.countDocuments();
  if (cropCount > 0) return; // Already seeded

  console.log('Seeding database...');

  // Create demo user
  const demoUser = await User.create({
    name: 'Demo Farmer',
    email: 'demo@farmiq.com',
    password: 'demo123456',
    role: 'farmer'
  });

  // Seed crops
  const crops = [
    { name: 'Rice (Paddy)', season: 'Kharif', soilType: 'Clayey, Loamy', irrigation: 'Flood irrigation, standing water required', fertilizerSchedule: 'NPK 120:60:40 kg/ha. Basal dose at transplanting, top dressing at tillering & panicle initiation', pests: ['Stem Borer', 'Brown Plant Hopper', 'Blast'], description: 'Staple cereal crop of India. Requires warm humid climate with 100-200cm rainfall.' },
    { name: 'Wheat', season: 'Rabi', soilType: 'Loamy, Clay Loam', irrigation: 'Sprinkler or flood, 4-6 irrigations needed', fertilizerSchedule: 'NPK 120:60:40 kg/ha. Half N + full P&K as basal, remaining N in 2 splits', pests: ['Aphids', 'Rust', 'Termites'], description: 'Major Rabi cereal. Grows best in cool climate with 50-75cm rainfall.' },
    { name: 'Tomato', season: 'All Season', soilType: 'Sandy Loam, Red Soil', irrigation: 'Drip irrigation recommended, regular watering', fertilizerSchedule: 'NPK 100:50:50 kg/ha. Apply FYM before planting, split N application', pests: ['Fruit Borer', 'Leaf Curl Virus', 'Early Blight'], description: 'High-value vegetable crop grown across India with good market demand year-round.' },
    { name: 'Cotton', season: 'Kharif', soilType: 'Black Soil, Alluvial', irrigation: 'Drip or furrow irrigation, moderate water needs', fertilizerSchedule: 'NPK 80:40:40 kg/ha. Basal + 2 top dressings of N', pests: ['Bollworm', 'Whitefly', 'Jassids'], description: 'Major commercial fiber crop. Bt Cotton widely adopted across Maharashtra, Gujarat, Telangana.' },
    { name: 'Sugarcane', season: 'Kharif', soilType: 'Loamy, Deep Rich Soil', irrigation: 'Frequent irrigation needed, drip recommended', fertilizerSchedule: 'NPK 250:100:120 kg/ha. Heavy feeder, split N application', pests: ['Top Shoot Borer', 'Red Rot', 'Pyrilla'], description: 'Major cash crop for sugar production. Long duration crop (10-14 months).' },
    { name: 'Soybean', season: 'Kharif', soilType: 'Black Soil, Clay Loam', irrigation: 'Rainfed mostly, supplemental irrigation during dry spells', fertilizerSchedule: 'NPK 20:80:20 kg/ha + Rhizobium seed treatment', pests: ['Girdle Beetle', 'Stem Fly', 'Leaf Miner'], description: 'Important oilseed crop mainly grown in MP, Maharashtra, Rajasthan.' },
    { name: 'Onion', season: 'Rabi', soilType: 'Sandy Loam, Well-drained', irrigation: 'Light frequent irrigations, avoid waterlogging', fertilizerSchedule: 'NPK 100:50:50 kg/ha + Sulphur 25 kg/ha', pests: ['Thrips', 'Purple Blotch', 'Downy Mildew'], description: 'Essential vegetable crop with high price volatility. Nashik is the onion capital of India.' },
    { name: 'Potato', season: 'Rabi', soilType: 'Sandy Loam, Light Soil', irrigation: 'Regular irrigation at 7-10 day intervals', fertilizerSchedule: 'NPK 150:100:100 kg/ha. All P&K + half N as basal', pests: ['Late Blight', 'Potato Tuber Moth', 'Aphids'], description: 'Major vegetable crop for food processing and fresh market.' },
    { name: 'Maize (Corn)', season: 'Kharif', soilType: 'Loamy, Well-drained', irrigation: 'Critical irrigations at tasseling & grain filling', fertilizerSchedule: 'NPK 120:60:40 kg/ha. Zinc application beneficial', pests: ['Fall Army Worm', 'Stem Borer', 'Downy Mildew'], description: 'Versatile cereal used for food, feed, and industrial purposes.' },
    { name: 'Mustard', season: 'Rabi', soilType: 'Loamy, Sandy Loam', irrigation: 'Light irrigations, 2-3 irrigations sufficient', fertilizerSchedule: 'NPK 60:40:20 kg/ha + Sulphur 20 kg/ha', pests: ['Aphids', 'Painted Bug', 'White Rust'], description: 'Important oilseed crop predominantly grown in Rajasthan, UP, and Haryana.' },
    { name: 'Banana', season: 'All Season', soilType: 'Rich Loamy, Well-drained', irrigation: 'Drip irrigation ideal, consistent moisture', fertilizerSchedule: 'NPK 200:60:300 g/plant/year. Potassium critical for fruit', pests: ['Panama Wilt', 'Bunchy Top Virus', 'Sigatoka'], description: 'Perennial fruit crop. India is the largest producer worldwide.' },
    { name: 'Turmeric', season: 'Kharif', soilType: 'Sandy Loam, Rich Clay Loam', irrigation: 'Regular watering, avoid waterlogging', fertilizerSchedule: 'NPK 60:30:120 kg/ha + FYM 25 t/ha', pests: ['Shoot Borer', 'Rhizome Rot', 'Leaf Blotch'], description: 'High-value spice crop from Telangana, Tamil Nadu, Maharashtra.' },
  ];
  await Crop.insertMany(crops);
  console.log(`  ✔ Seeded ${crops.length} crops`);

  // Seed mandi prices
  const districts = ['Nashik', 'Pune', 'Indore', 'Jaipur', 'Lucknow', 'Patna', 'Hyderabad', 'Bangalore'];
  const mandiCrops = ['Tomato', 'Onion', 'Potato', 'Rice', 'Wheat', 'Soybean', 'Cotton', 'Maize'];
  const prices = [];
  const today = new Date();
  districts.forEach(district => {
    mandiCrops.forEach(crop => {
      let base;
      switch (crop) {
        case 'Tomato': base = 2500 + Math.random() * 1500; break;
        case 'Onion': base = 1800 + Math.random() * 1200; break;
        case 'Potato': base = 1200 + Math.random() * 800; break;
        case 'Rice': base = 2200 + Math.random() * 600; break;
        case 'Wheat': base = 2400 + Math.random() * 400; break;
        case 'Soybean': base = 4500 + Math.random() * 1000; break;
        case 'Cotton': base = 6000 + Math.random() * 1500; break;
        default: base = 1800 + Math.random() * 500;
      }
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const fluct = 1 + (Math.random() - 0.5) * 0.1;
        prices.push({ district, crop, date, price: Math.round(base * fluct) });
        base = base * fluct;
      }
    });
  });
  await MandiPrice.insertMany(prices);
  console.log(`  ✔ Seeded ${prices.length} mandi price records`);

  // Seed questions
  const questions = [
    { userId: demoUser._id, userName: 'Rajesh Kumar', userRole: 'farmer', title: 'Best time to sow wheat in North India?', content: 'I am from Lucknow. When is the ideal window for wheat sowing?', tags: ['wheat', 'rabi', 'sowing'], answers: [{ userId: demoUser._id, userName: 'Dr. Priya Sharma', userRole: 'expert', content: 'The optimal sowing window for wheat in Indo-Gangetic plains is November 1-25. HD-2967 and HD-3086 are excellent choices for irrigated conditions with yields of 50-55 q/ha.' }] },
    { userId: demoUser._id, userName: 'Sunil Patil', userRole: 'farmer', title: 'How to manage Fall Army Worm in Maize?', content: 'My maize crop is severely affected by Fall Army Worm. What IPM strategy should I adopt?', tags: ['maize', 'pest', 'FAW'], answers: [{ userId: demoUser._id, userName: 'Agri Expert Panel', userRole: 'expert', content: 'Apply Emamectin Benzoate 5% SG @ 0.4g/L as foliar spray into whorl. Release Trichogramma @ 1 lakh/ha. Set up pheromone traps @ 5/acre for monitoring.' }] },
    { userId: demoUser._id, userName: 'Meena Devi', userRole: 'farmer', title: 'Drip irrigation subsidy for small farmers?', content: 'I have a 2-acre farm in Rajasthan. Are there government schemes for drip irrigation?', tags: ['irrigation', 'subsidy', 'government'], answers: [] },
    { userId: demoUser._id, userName: 'Vikram Singh', userRole: 'farmer', title: 'Organic certification for turmeric export?', content: 'How do I get organic certification for my 5-acre turmeric farm for export?', tags: ['organic', 'certification', 'export'], answers: [{ userId: demoUser._id, userName: 'Export Advisor', userRole: 'expert', content: 'Apply to APEDA-accredited bodies like OneCert or INDOCERT. Process: 3-year conversion, annual inspection, cost ₹15-30K/year. NPOP certification covers EU/USDA standards.' }] },
  ];
  await Question.insertMany(questions);
  console.log(`  ✔ Seeded ${questions.length} questions`);
  console.log('✅ Database seeded successfully!\n');
}

module.exports = connectDB;
