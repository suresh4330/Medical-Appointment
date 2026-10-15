const dns = require("dns");
const mongoose = require("mongoose");

const connectWithUri = async (uri) => {
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000
  });
};

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;
  const fallbackURI = process.env.MONGO_URI_FALLBACK;

  if (!mongoURI) {
    console.error("MongoDB connection failed: MONGO_URI is not set");
    process.exit(1);
  }

  try {
    if (mongoURI.startsWith("mongodb+srv://")) {
      dns.setServers(["8.8.8.8", "1.1.1.1"]);
    }

    await connectWithUri(mongoURI);
    console.log("MongoDB Connected");
  } catch (error) {
    const isSrvDnsError =
      error?.message?.includes("querySrv") ||
      error?.message?.includes("ENOTFOUND") ||
      error?.message?.includes("ECONNREFUSED");

    if (fallbackURI && isSrvDnsError) {
      try {
        await connectWithUri(fallbackURI);
        console.log("MongoDB Connected via fallback URI");
        return;
      } catch (fallbackError) {
        console.error("MongoDB fallback connection failed:", fallbackError.message);
      }
    }

    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
