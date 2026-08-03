const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Crop = require('./models/Crop');
const MandiPrice = require('./models/MandiPrice');
const Question = require('./models/Question');
const User = require('./models/User');

dotenv.config();

const crops = [
    {
        name: 'Rice (Paddy)',
        season: 'Kharif',
        soilType: 'Clayey, Loamy',
        irrigation: 'Flood irrigation, standing water required',
        fertilizerSchedule: 'NPK 120:60:40 kg/ha. Basal dose at transplanting, top dressing at tillering & panicle initiation',
        pests: ['Stem Borer', 'Brown Plant Hopper', 'Blast'],
        description: 'Staple cereal crop of India. Requires warm humid climate with 100-200cm rainfall.'
    },
    {
        name: 'Wheat',
        season: 'Rabi',
        soilType: 'Loamy, Clay Loam',
        irrigation: 'Sprinkler or flood, 4-6 irrigations needed',
        fertilizerSchedule: 'NPK 120:60:40 kg/ha. Half N + full P&K as basal, remaining N in 2 splits',
        pests: ['Aphids', 'Rust', 'Termites'],
        description: 'Major Rabi cereal. Grows best in cool climate with 50-75cm rainfall.'
    },
    {
        name: 'Tomato',
        season: 'All Season',
        soilType: 'Sandy Loam, Red Soil',
        irrigation: 'Drip irrigation recommended, regular watering',
        fertilizerSchedule: 'NPK 100:50:50 kg/ha. Apply FYM before planting, split N application',
        pests: ['Fruit Borer', 'Leaf Curl Virus', 'Early Blight'],
        description: 'High-value vegetable crop grown across India with good market demand year-round.'
    },
    {
        name: 'Cotton',
        season: 'Kharif',
        soilType: 'Black Soil, Alluvial',
        irrigation: 'Drip or furrow irrigation, moderate water needs',
        fertilizerSchedule: 'NPK 80:40:40 kg/ha. Basal + 2 top dressings of N',
        pests: ['Bollworm', 'Whitefly', 'Jassids'],
        description: 'Major commercial fiber crop. Bt Cotton widely adopted across Maharashtra, Gujarat, Telangana.'
    },
    {
        name: 'Sugarcane',
        season: 'Kharif',
        soilType: 'Loamy, Deep Rich Soil',
        irrigation: 'Frequent irrigation needed, drip recommended for water saving',
        fertilizerSchedule: 'NPK 250:100:120 kg/ha. Heavy feeder, split N application across growth phases',
        pests: ['Top Shoot Borer', 'Red Rot', 'Pyrilla'],
        description: 'Major cash crop for sugar production. Long duration crop (10-14 months).'
    },
    {
        name: 'Soybean',
        season: 'Kharif',
        soilType: 'Black Soil, Clay Loam',
        irrigation: 'Rainfed mostly, supplemental irrigation during dry spells',
        fertilizerSchedule: 'NPK 20:80:20 kg/ha + Rhizobium seed treatment. Being a legume, fixes its own nitrogen',
        pests: ['Girdle Beetle', 'Stem Fly', 'Leaf Miner'],
        description: 'Important oilseed crop mainly grown in MP, Maharashtra, and Rajasthan.'
    },
    {
        name: 'Onion',
        season: 'Rabi',
        soilType: 'Sandy Loam, Well-drained',
        irrigation: 'Light frequent irrigations, avoid waterlogging',
        fertilizerSchedule: 'NPK 100:50:50 kg/ha + Sulphur 25 kg/ha. Sulphur improves pungency and storage',
        pests: ['Thrips', 'Purple Blotch', 'Downy Mildew'],
        description: 'Essential vegetable crop with high price volatility. Nashik is the onion capital of India.'
    },
    {
        name: 'Potato',
        season: 'Rabi',
        soilType: 'Sandy Loam, Light Soil',
        irrigation: 'Regular irrigation at 7-10 day intervals',
        fertilizerSchedule: 'NPK 150:100:100 kg/ha. All P&K + half N as basal, rest N at earthing up',
        pests: ['Late Blight', 'Potato Tuber Moth', 'Aphids'],
        description: 'Major vegetable crop for food processing and fresh market. UP, WB, Bihar are top producers.'
    },
    {
        name: 'Maize (Corn)',
        season: 'Kharif',
        soilType: 'Loamy, Well-drained',
        irrigation: 'Critical irrigations at tasseling & grain filling stages',
        fertilizerSchedule: 'NPK 120:60:40 kg/ha. Zinc application beneficial. Split N at knee-high and tasseling',
        pests: ['Fall Army Worm', 'Stem Borer', 'Downy Mildew'],
        description: 'Versatile cereal used for food, feed, and industrial purposes. Grows across diverse agro-climates.'
    },
    {
        name: 'Mustard',
        season: 'Rabi',
        soilType: 'Loamy, Sandy Loam',
        irrigation: 'Light irrigations, 2-3 irrigations sufficient',
        fertilizerSchedule: 'NPK 60:40:20 kg/ha + Sulphur 20 kg/ha. Basal dose application',
        pests: ['Aphids', 'Painted Bug', 'White Rust'],
        description: 'Important oilseed crop predominantly grown in Rajasthan, UP, and Haryana during winter season.'
    },
    {
        name: 'Banana',
        season: 'All Season',
        soilType: 'Rich Loamy, Well-drained',
        irrigation: 'Drip irrigation ideal, consistent moisture needed',
        fertilizerSchedule: 'NPK 200:60:300 g/plant/year. Split into monthly doses. Potassium is critical for fruit quality',
        pests: ['Panama Wilt', 'Banana Bunchy Top Virus', 'Sigatoka Leaf Spot'],
        description: 'Perennial fruit crop. India is the largest producer. Grand Naine, Robusta are popular varieties.'
    },
    {
        name: 'Turmeric',
        season: 'Kharif',
        soilType: 'Sandy Loam, Rich Clay Loam',
        irrigation: 'Regular watering, avoid waterlogging. Drip preferred',
        fertilizerSchedule: 'NPK 60:30:120 kg/ha + FYM 25 t/ha. Heavy potash feeder',
        pests: ['Shoot Borer', 'Rhizome Rot', 'Leaf Blotch'],
        description: 'High-value spice crop. Telangana, Tamil Nadu, and Maharashtra are major producers.'
    }
];

const districts = ['Nashik', 'Pune', 'Indore', 'Jaipur', 'Lucknow', 'Patna', 'Hyderabad', 'Bangalore'];
const mandiCrops = ['Tomato', 'Onion', 'Potato', 'Rice', 'Wheat', 'Soybean', 'Cotton', 'Maize'];

function generateMandiPrices() {
    const prices = [];
    const today = new Date();
    districts.forEach(district => {
        mandiCrops.forEach(crop => {
            let basePrice;
            switch (crop) {
                case 'Tomato': basePrice = 2500 + Math.random() * 1500; break;
                case 'Onion': basePrice = 1800 + Math.random() * 1200; break;
                case 'Potato': basePrice = 1200 + Math.random() * 800; break;
                case 'Rice': basePrice = 2200 + Math.random() * 600; break;
                case 'Wheat': basePrice = 2400 + Math.random() * 400; break;
                case 'Soybean': basePrice = 4500 + Math.random() * 1000; break;
                case 'Cotton': basePrice = 6000 + Math.random() * 1500; break;
                case 'Maize': basePrice = 1800 + Math.random() * 500; break;
                default: basePrice = 2000 + Math.random() * 1000;
            }
            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const fluctuation = 1 + (Math.random() - 0.5) * 0.1;
                prices.push({
                    district,
                    crop,
                    date,
                    price: Math.round(basePrice * fluctuation)
                });
                basePrice = basePrice * fluctuation;
            }
        });
    });
    return prices;
}

const sampleQuestions = [
    {
        userName: 'Rajesh Kumar',
        userRole: 'farmer',
        title: 'Best time to sow wheat in North India?',
        content: 'I am from Lucknow. When is the ideal window for wheat sowing in the Indo-Gangetic plain? Which variety should I choose for irrigated conditions?',
        tags: ['wheat', 'rabi', 'sowing'],
        answers: [
            {
                userName: 'Dr. Priya Sharma',
                userRole: 'expert',
                content: 'The optimal sowing window for wheat in the Indo-Gangetic plains is November 1-25. For irrigated conditions, HD-2967 and HD-3086 are excellent choices with yields of 50-55 q/ha. Ensure seed treatment with Thiram @ 2.5g/kg before sowing.'
            }
        ]
    },
    {
        userName: 'Sunil Patil',
        userRole: 'farmer',
        title: 'How to manage Fall Army Worm in Maize?',
        content: 'My maize crop is severely affected by Fall Army Worm. The larvae are eating through the whorl leaves. What integrated pest management strategy should I adopt?',
        tags: ['maize', 'pest', 'FAW'],
        answers: [
            {
                userName: 'Agri Expert Panel',
                userRole: 'expert',
                content: 'For FAW management: 1) Apply Emamectin Benzoate 5% SG @ 0.4g/L or Spinetoram 11.7% SC @ 0.5ml/L as foliar spray directed into the whorl. 2) Release Trichogramma parasitoids @ 1 lakh/ha. 3) Set up pheromone traps @ 5/acre for monitoring. 4) Apply neem oil 5% as preventive spray.'
            }
        ]
    },
    {
        userName: 'Meena Devi',
        userRole: 'farmer',
        title: 'Drip irrigation subsidy for small farmers?',
        content: 'I have a 2-acre farm in Rajasthan growing vegetables. Are there any government schemes for drip irrigation subsidy? What is the application process?',
        tags: ['irrigation', 'subsidy', 'government'],
        answers: []
    },
    {
        userName: 'Vikram Singh',
        userRole: 'farmer',
        title: 'Organic certification process for exports?',
        content: 'I want to convert my 5-acre turmeric farm to organic certification for export. What is the process, cost, and time involved? Which certifying body should I approach?',
        tags: ['organic', 'certification', 'export'],
        answers: [
            {
                userName: 'Export Advisor',
                userRole: 'expert',
                content: 'For organic certification: Apply to APEDA-accredited certification bodies like OneCert, IMO, or INDOCERT. The process involves: 1) 3-year conversion period 2) Documentation of farm practices 3) Annual inspection 4) Cost ranges ₹15,000-30,000/year. For exports, you need NPOP (National Programme for Organic Production) certification which is equivalent to EU and USDA organic standards.'
            }
        ]
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding...');

        // Clear existing data
        await Crop.deleteMany({});
        await MandiPrice.deleteMany({});
        await Question.deleteMany({});
        console.log('Cleared existing data');

        // Create a dummy user for questions
        let dummyUser = await User.findOne({ email: 'demo@farmiq.com' });
        if (!dummyUser) {
            dummyUser = await User.create({
                name: 'Demo Farmer',
                email: 'demo@farmiq.com',
                password: 'demo123456',
                role: 'farmer'
            });
        }

        // Seed crops
        await Crop.insertMany(crops);
        console.log(`Seeded ${crops.length} crops`);

        // Seed mandi prices
        const mandiPrices = generateMandiPrices();
        await MandiPrice.insertMany(mandiPrices);
        console.log(`Seeded ${mandiPrices.length} mandi price records`);

        // Seed questions
        const questionsWithUser = sampleQuestions.map(q => ({
            ...q,
            userId: dummyUser._id,
            answers: q.answers.map(a => ({ ...a, userId: dummyUser._id }))
        }));
        await Question.insertMany(questionsWithUser);
        console.log(`Seeded ${sampleQuestions.length} questions`);

        console.log('\n✅ Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedDB();
