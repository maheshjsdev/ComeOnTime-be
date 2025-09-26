const mongoose = require('mongoose');

const getMongoUri = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.MONGODB_URI_PROD || process.env.MONGODB_URI;
  }
  return process.env.MONGODB_URI_DEV || process.env.MONGODB_URI;
};

const connectDB = async () => {
  try {
    await mongoose.connect(getMongoUri(), {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
