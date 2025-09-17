const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const { User, Order, OrderStatus } = require('./models');
const { users, orders, orderStatuses } = require('./data/dummyData');

// Load environment variables
dotenv.config();

const importData = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await connectDB();
    
    console.log('🗑️  Clearing existing data...');
    await Order.deleteMany();
    await OrderStatus.deleteMany();
    await User.deleteMany();

    console.log('👥 Importing users...');
    await User.insertMany(users);
    console.log(`✅ ${users.length} users imported successfully`);

    console.log('📋 Importing orders...');
    await Order.insertMany(orders);
    console.log(`✅ ${orders.length} orders imported successfully`);

    console.log('📊 Importing order statuses...');
    await OrderStatus.insertMany(orderStatuses);
    console.log(`✅ ${orderStatuses.length} order statuses imported successfully`);

    console.log('🎉 All data imported successfully!');
    console.log('\nTest credentials:');
    console.log('Username: admin | Password: password123');
    console.log('Username: school_admin | Password: school123');
    console.log('Username: test_user | Password: test123');
    
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error importing data: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await connectDB();
    
    console.log('🗑️  Destroying all data...');
    await Order.deleteMany();
    await OrderStatus.deleteMany();
    await User.deleteMany();

    console.log('✅ All data destroyed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

// Check command line arguments
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  destroyData();
} else {
  console.log('Usage:');
  console.log('  node seeder.js -i    Import data');
  console.log('  node seeder.js -d    Destroy data');
  process.exit(1);
}