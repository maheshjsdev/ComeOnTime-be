const mongoose = require('mongoose');

const getMongoUri = () => {
  if (process.env.NODE_ENV_T === "production") {
    return process.env.MONGODB_URI_PROD;
  }
  return process.env.MONGODB_URI_DEV;
};

const connectDB = async () => {
  try {
    const uri = getMongoUri();
    if (!uri) throw new Error("Mongo URI is undefined. Check environment variables.");

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB connected (${process.env.NODE_ENV_T})`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
