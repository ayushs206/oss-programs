import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Subscription } from '@/lib/models/Subscription';

export async function POST(req: Request) {
    try {
        const subscription = await req.json();

        if (!subscription || !subscription.endpoint || !subscription.keys) {
            return NextResponse.json(
                { error: 'Invalid subscription object provided' },
                { status: 400 }
            );
        }
        try {
            await connectToDatabase();
        } catch (dbError) {
            console.error('Database connection failed in /api/push/subscribe:', dbError);
            return NextResponse.json(
                { error: 'Database connection failed' },
                { status: 500 }
            );
        }

        await Subscription.findOneAndUpdate(
            { endpoint: subscription.endpoint },
            {
                endpoint: subscription.endpoint,
                expirationTime: subscription.expirationTime || null,
                keys: subscription.keys,
            },
            { upsert: true, new: true, runValidators: true }
        );

        return NextResponse.json(
            { message: 'Subscription successfully saved' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error saving subscription:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
