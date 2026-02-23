import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Next.js hot reload edge case caching
interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

const globalWithMongoose = global as unknown as { mongooseCache: MongooseCache | undefined };

let cached: MongooseCache = globalWithMongoose.mongooseCache as MongooseCache;

if (!globalWithMongoose.mongooseCache) {
    globalWithMongoose.mongooseCache = { conn: null, promise: null };
    cached = globalWithMongoose.mongooseCache;
}

export async function connectToDatabase() {
    console.log('Checking environment variable MONGODB_URI exists:', !!process.env.MONGODB_URI);

    if (cached.conn) {
        console.log('MongoDB connection state connected:', mongoose.connection.readyState === 1);
        return cached.conn;
    }

    if (!cached.promise) {
        // Extract dbName from the URI
        const dbNameMatch = MONGODB_URI.match(/\/([^/?]+)(\?|$)/);
        const dbName = dbNameMatch ? dbNameMatch[1] : undefined;

        const opts = {
            bufferCommands: false,
            dbName,
            retryWrites: true,
            serverSelectionTimeoutMS: 5000,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
            console.log('Successfully connected to MongoDB!');
            return mongooseInstance;
        }).catch((error) => {
            console.error('Failed to connect to MongoDB:');

            // Check for common MongoDB Atlas issues and provide helpful guidance
            if (error.name === 'MongoNetworkError' || error.message.includes('ENOTFOUND')) {
                console.error('❌ NETWORK ERROR (ENOTFOUND / MongoNetworkError):');
                console.error('  - Verify that your DNS SRV resolution is working if using a mongodb+srv:// URI.');
                console.error('  - Confirm your MongoDB Atlas cluster is NOT paused or sleeping.');
                console.error('  - Confirm the IP whitelist in Atlas Network Access allows your current IP (or 0.0.0.0/0 for anywhere).');
                console.error('  - Check if your local firewall or ISP blocks port 27017.');
            } else if (error.message.includes('Authentication failed') || error.code === 8000) {
                console.error('❌ AUTHENTICATION ERROR:');
                console.error('  - Confirm the database user credentials (username and password) match the URI exactly.');
                console.error('  - Ensure password special characters are URL-encoded in the connection string.');
            } else if (error.message.includes('bad auth Authentication failed')) {
                console.error('❌ AUTHENTICATION ERROR: Incorrect credentials.');
            } else {
                console.error('❌ UNKNOWN ERROR:', error.message);
            }

            console.error('\nOriginal Error Stack:', error);
            cached.promise = null;
            throw error;
        });
    }

    try {
        cached.conn = await cached.promise;
        console.log('MongoDB connection state connected:', mongoose.connection.readyState === 1);
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}
