import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { broadcastNotification } from '@/lib/services/notificationService';

const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET!;

export async function POST(req: Request) {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get('x-hub-signature-256');

        if (!signature || !GITHUB_WEBHOOK_SECRET) {
            return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 401 });
        }

        // Verify signature
        const hmac = crypto.createHmac('sha256', GITHUB_WEBHOOK_SECRET);
        const digest = 'sha256=' + hmac.update(rawBody).digest('hex');

        if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest)) === false) {
            return NextResponse.json({ error: 'Signature verification failed' }, { status: 401 });
        }

        const payload = JSON.parse(rawBody);

        // Only process pushes mapped to the main branch
        if (req.headers.get('x-github-event') === 'push' && payload.ref === 'refs/heads/main') {
            type GitHubCommit = {
                added?: string[];
            };
            const addedFiles: string[] = payload.commits?.flatMap((commit: GitHubCommit) => commit.added ?? []) || [];
            const newProgramFiles = addedFiles.filter((file: string) => file.startsWith('data/programs/') && (file.endsWith('.yaml') || file.endsWith('.yml')));

            for (const file of newProgramFiles) {
                // Extract a displayable title from the filename (e.g. data/programs/google-summer.yaml -> Google Summer)
                const slug = file.replace('data/programs/', '').replace('.yaml', '').replace('.yml', '');
                const title = slug.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

                await broadcastNotification({
                    title: `New Opportunity: ${title}`,
                    body: `A new program profile has been added to the directory.`,
                    url: `/?slug=${slug}`
                });
            }
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('GitHub Webhook processing error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
