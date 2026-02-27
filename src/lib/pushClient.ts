const VAPID_PUBLIC_KEY: string | undefined = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray as Uint8Array<ArrayBuffer>;
}

export async function registerPush(): Promise<void> {
    if (!VAPID_PUBLIC_KEY) {
        console.error('NEXT_PUBLIC_VAPID_PUBLIC_KEY is not defined. Push subscription aborted.');
        return;
    }

    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.error('Push notifications are not supported in this browser.');
        return;
    }

    try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            console.warn('Notification permission denied by user.');
            return;
        }

        const registration = await navigator.serviceWorker.register('/sw.js');
        await navigator.serviceWorker.ready;

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });

        console.log('Push subscription established:', JSON.stringify(subscription));
    } catch (err) {
        console.error('Error during push registration:', err);
        throw err;
    }
}
