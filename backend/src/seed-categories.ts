import mongoose from 'mongoose';
import { env } from './config/env.js';
import { WorkCategory } from './models/WorkCategory.js';

const extendedCategories = [
  { name: 'plumber', label: 'Plumbing', iconName: 'FaWrench', iconColor: 'blue' },
  { name: 'electrician', label: 'Electrical', iconName: 'FaBolt', iconColor: 'amber' },
  { name: 'carpenter', label: 'Carpentry', iconName: 'FaHammer', iconColor: 'orange' },
  { name: 'painter', label: 'Painting', iconName: 'FaPaintRoller', iconColor: 'pink' },
  { name: 'ac technician', label: 'AC Service', iconName: 'FaFan', iconColor: 'cyan' },
  { name: 'mechanic', label: 'Mechanical', iconName: 'FaCar', iconColor: 'red' },
  { name: 'gardener', label: 'Gardening', iconName: 'FaTree', iconColor: 'emerald' },
  { name: 'cleaner', label: 'Cleaning', iconName: 'FaBroom', iconColor: 'purple' },
  
  // New Categories
  { name: 'mason', label: 'Masonry / Bricklaying', iconName: 'FaTrowel', iconColor: 'stone' },
  { name: 'welder', label: 'Welding', iconName: 'FaFire', iconColor: 'orange' },
  { name: 'tailor', label: 'Tailoring', iconName: 'FaCut', iconColor: 'pink' },
  { name: 'driver', label: 'Driver / Chauffeur', iconName: 'FaSteeringWheel', iconColor: 'blue' },
  { name: 'cook', label: 'Cook / Chef', iconName: 'FaUtensils', iconColor: 'red' },
  { name: 'maid', label: 'Maid / Housekeeper', iconName: 'FaMitten', iconColor: 'purple' },
  { name: 'nanny', label: 'Babysitter / Nanny', iconName: 'FaBaby', iconColor: 'rose' },
  { name: 'tutor', label: 'Tutor', iconName: 'FaBook', iconColor: 'indigo' },
  { name: 'beautician', label: 'Beautician', iconName: 'FaSpa', iconColor: 'pink' },
  { name: 'barber', label: 'Barber / Hairdresser', iconName: 'FaCut', iconColor: 'teal' },
  { name: 'pest control', label: 'Pest Control', iconName: 'FaBug', iconColor: 'emerald' },
  { name: 'appliance repair', label: 'Appliance Repair', iconName: 'FaPlug', iconColor: 'blue' },
  { name: 'computer repair', label: 'Computer Repair', iconName: 'FaLaptopMedical', iconColor: 'cyan' },
  { name: 'mobile repair', label: 'Mobile Repair', iconName: 'FaMobileAlt', iconColor: 'slate' },
  { name: 'laborer', label: 'Laborer / Mazdoor', iconName: 'FaHardHat', iconColor: 'amber' },
  { name: 'movers', label: 'Packers & Movers', iconName: 'FaTruck', iconColor: 'blue' },
  { name: 'glazier', label: 'Glass Worker', iconName: 'FaSquareFull', iconColor: 'sky' },
  { name: 'aluminum worker', label: 'Aluminum / Windows', iconName: 'FaWindowMaximize', iconColor: 'slate' },
  { name: 'solar technician', label: 'Solar Installation', iconName: 'FaSun', iconColor: 'amber' },
  { name: 'photographer', label: 'Photographer', iconName: 'FaCamera', iconColor: 'violet' }
];

const seedCategories = async () => {
  try {
    await mongoose.connect(env.mongodbUri);
    console.log('Connected to DB for seeding categories...');

    for (const cat of extendedCategories) {
      const existing = await WorkCategory.findOne({ name: cat.name });
      if (!existing) {
        await WorkCategory.create(cat);
        console.log(`Added category: ${cat.name}`);
      } else {
        console.log(`Category already exists: ${cat.name}`);
      }
    }

    console.log('Finished seeding categories.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedCategories();
