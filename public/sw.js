self.addEventListener('push', function (event) {
    if (!event.data) {
        return;
    }

    try {
        const data = event.data.json();
        const title = data.title || 'New Notification';

        const options = {
            body: data.body || '',
            icon: data.icon || '/favicon.ico',
            badge: '/favicon.ico',
            data: {
                url: data.url || '/',
            },
        };

        event.waitUntil(self.registration.showNotification(title, options));
    } catch (err) {
        console.error('Error parsing push event data:', err);
    }
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    const targetUrl = event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            const targetPathname = new URL(targetUrl, self.location.origin).pathname;

            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                const clientPathname = new URL(client.url).pathname;
                if (clientPathname === targetPathname && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
