const Resource = require('../models/Resource');

const sampleResources = [
  {
    name: 'Meeting Room A',
    description: '10-person conference room with 4K projector, whiteboard, and video conferencing setup.',
    category: 'Conference Room',
    location: 'Building A - Floor 2',
    status: 'Available',
  },
  {
    name: 'Meeting Room B',
    description: '6-person glass meeting pod ideal for quick team syncs and client calls.',
    category: 'Conference Room',
    location: 'Building A - Floor 3',
    status: 'In Use',
  },
  {
    name: 'Podcast Microphone',
    description: 'Shure SM7B dynamic microphone with XLR cable, boom arm, and pop filter.',
    category: 'Audio/Visual Equipment',
    location: 'Media Studio - Room 104',
    status: 'Available',
  },
  {
    name: 'Testing Device',
    description: 'iPad Pro 12.9" M2 test tablet with pre-loaded dev builds and testing tools.',
    category: 'Hardware & Tech',
    location: 'QA Lab - Desk 12',
    status: 'Available',
  },
  {
    name: 'Display Screen',
    description: '27-inch 4K LG UltraFine monitor with USB-C 90W power delivery.',
    category: 'Hardware & Tech',
    location: 'Hot Desk Area - Bay 4',
    status: 'Maintenance',
  },
];

const seedResources = async () => {
  try {
    const count = await Resource.countDocuments();
    if (count === 0) {
      await Resource.insertMany(sampleResources);
      console.log('Sample resources seeded into MongoDB successfully!');
    }
  } catch (error) {
    console.error('Error seeding resources:', error.message);
  }
};

module.exports = seedResources;
