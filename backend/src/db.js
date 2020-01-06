const mongoose = require("mongoose");

async function connectDB() {
  const uri =
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/freelancetaxplanner";
  try {
    await mongoose.connect(uri, { dbName: "freelancetaxplanner" });
    console.log("[DB] connected:", uri);
  } catch (err) {
    console.error("[DB] connection error:", err.message);
    process.exit(1);
  }
}

module.exports = { connectDB };
