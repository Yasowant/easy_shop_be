const mongoose = require('mongoose');

module.exports.dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true, // Ensure better connection management
    });
    console.log('✅ Database connection established successfully.');
  } catch (error) {
    console.error(
      '❌ Failed to connect to the database. Error:',
      error.message
    );
    process.exit(1); // Exit the process if the database connection fails
  }
};
