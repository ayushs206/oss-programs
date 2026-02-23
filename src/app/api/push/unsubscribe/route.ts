import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Subscription } from '@/lib/models/Subscription';

export async function POST(req: Request) {
    try {
        const { endpoint } = await req.json();

        if (!endpoint) {
            return NextResponse.json(
                { error: 'Endpoint string is required' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const result = await Subscription.deleteOne({ endpoint });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { message: 'Subscription not found in database' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Successfully removed subscription' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting subscription:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
