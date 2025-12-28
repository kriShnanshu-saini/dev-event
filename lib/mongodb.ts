import mongoose from "mongoose";

// define the connection cache type
type MongooseCache = {
    conn: typeof mongoose | null,
    promise: Promise<typeof mongoose> | null,
}

// extend global object to include our mongoose cache
declare global {
    // eslint-disable-next-line no-var
    var mongoose: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

// initialize the cache on global object to persist across hot reloads in development
let cached: MongooseCache = global.mongoose || {conn: null, promise: null};

if (!global.mongoose) {
    global.mongoose = cached;
}

/**
 * Establishes a connection to MongoDb using mongoose
 * Caches the connection to prevent multiple connections during development hot reloads
 * @returns Promise resolving to the Mongoose instance
 */
async function connectDB(): Promise<typeof mongoose> {
    // return existing connection if available
    if (cached.conn)
        return cached.conn;

    // return existing connection promise if one is in progress
    if (!cached.promise) {
        // validate mongodb_uri exists
        if (!MONGODB_URI) {
            throw new Error("Please define the MONGODB_URI environment variable inside .env");
        }
        const options = {
            bufferCommands: false, //disable mongoose buffering
        };

        // create new connection promise
        cached.promise = mongoose.connect(MONGODB_URI!, options)
            .then((mongoose) => mongoose);
    }

    try {
        // wait for the connection to establish
        cached.conn = await cached.promise;
    } catch (err) {
        // reset promise on error to allow retry
        cached.promise = null;
        throw err;
    }

    return cached.conn;
}

export default connectDB;