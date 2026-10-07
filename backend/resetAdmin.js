const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const resetAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const user = await User.findOneAndUpdate(
      { email: 'admin@deskdrop.com' },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      console.log('Admin user not found.');
    } else {
      console.log('Admin password reset successfully!');
      console.log('Email: admin@deskdrop.com');
      console.log('Password: admin123');
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
};

resetAdmin();