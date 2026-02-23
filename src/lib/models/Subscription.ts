import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
    endpoint: string;
    expirationTime: number | null;
    keys: {
        p256dh: string;
        auth: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
    {
        endpoint: {
            type: String,
            required: true,
            unique: true,
        },
        expirationTime: {
            type: Number,
            default: null,
        },
        keys: {
            p256dh: { type: String, required: true },
            auth: { type: String, required: true },
        },
    },
    { timestamps: true }
);

export const Subscription =
    mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
