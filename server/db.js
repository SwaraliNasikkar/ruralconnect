
import mongoose from 'mongoose';

let cached = globalThis.__mongooseCache;

if (!cached) {
  cached = globalThis.__mongooseCache = {
    connection: null,
    promise: null,
  };
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is missing');
  }

  if (cached.connection) {
    return cached.connection;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).catch((err) => {
      cached.promise = null;
      throw err;
    });
  }

  cached.connection = await cached.promise;
  console.log('MongoDB connected:', mongoose.connection.name);

  return cached.connection;
}
