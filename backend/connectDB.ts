import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var, @typescript-eslint/no-explicit-any
  var mongoose: any; // This must be a `var` and not a `let / const`
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDB() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// import mongoose from "mongoose";

// // Use global to persist the connection status
// const globalWithMongoose = global as typeof global & {
//   mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
// };

// if (!globalWithMongoose.mongoose) {
//   globalWithMongoose.mongoose = { conn: null, promise: null };
// }

// export async function connectToDatabase() {
//   if (globalWithMongoose.mongoose.conn) {
//     // If already connected, use the existing connection
//     return globalWithMongoose.mongoose.conn;
//   }

//   if (!globalWithMongoose.mongoose.promise) {
//     // Only create a new connection promise once
//     globalWithMongoose.mongoose.promise = mongoose.connect(process.env.MONGODB_URI as string, {}).then((mongoose) => {
//       console.log("Connected to MongoDB");
//       return mongoose;
//     });
//   }

//   // Await the connection promise and cache it
//   globalWithMongoose.mongoose.conn = await globalWithMongoose.mongoose.promise;
//   return globalWithMongoose.mongoose.conn;
// }