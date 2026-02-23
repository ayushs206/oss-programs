import webpush from '@/lib/webpush';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Subscription, ISubscription } from '@/lib/models/Subscription';

export interface NotificationPayload {
    title: string;
    body: string;
    url?: string;
}

export async function broadcastNotification(payload: NotificationPayload) {
    await connectToDatabase();

    const subscriptions: ISubscription[] = await Subscription.find({});
    const stringifiedPayload = JSON.stringify(payload);

    const notificationPromises = subscriptions.map((sub) => {
        return webpush
            .sendNotification(
                {
                    endpoint: sub.endpoint,
                    keys: sub.keys,
                },
                stringifiedPayload
            )
            .catch(async (error) => {
                // Automatically remove invalid or expired subscriptions (404 Not Found, 410 Gone)
                if (error.statusCode === 404 || error.statusCode === 410) {
                    console.log(`Removing expired subscription: ${sub.endpoint}`);
                    await Subscription.deleteOne({ _id: sub._id });
                } else {
                    console.error('Failed to send notification via web-push:', error);
                }
            });
    });

    await Promise.allSettled(notificationPromises);
}
