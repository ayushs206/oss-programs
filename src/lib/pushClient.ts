function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export async function registerPush() {
    console.log('Starting push registration process...');

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
        console.log('Notification permission granted.');

        console.log('Registering service worker at /sw.js...');
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service worker registered successfully:', registration);

        await navigator.serviceWorker.ready;

        const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!vapidKey) {
            console.error('VAPID public key is missing from environment variables.');
            return;
        }

        console.log('Subscribing to PushManager...');
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidKey),
        });
        console.log('Push subscription established:', JSON.stringify(subscription));

    } catch (err) {
        console.error('Error during push registration:', err);
    }
}
