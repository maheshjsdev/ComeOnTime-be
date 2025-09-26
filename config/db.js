const mongoose = require('mongoose');

const getMongoUri = () => {
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("MONGODB_URI_PROD:", process.env.MONGODB_URI_PROD);
  console.log("MONGODB_URI_DEV:", process.env.MONGODB_URI_DEV);

  return process.env.MONGODB_URI_PROD || process.env.MONGODB_URI_DEV;
};

const connectDB = async () => {
  try {
    const uri = getMongoUri();
    if (!uri) throw new Error("Mongo URI is undefined. Check environment variables.");
    console.log("Connecting to Mongo URI:", uri.replace(/\/\/.*@/, "//***:***@")); // hide password

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
