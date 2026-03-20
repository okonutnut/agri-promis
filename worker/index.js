self.addEventListener('push', function (event) {
  if (event.data) {
    let data;
    try {
      data = event.data.json()
    } catch (e) {
      data = { title: 'Notification', body: event.data.text() }
    }
    
    const options = {
      body: data.body,
      icon: data.icon || '/icon.png',
      badge: '/badge.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '2',
      },
    }
    event.waitUntil(self.registration.showNotification(data.title, options))
  }
})
 
self.addEventListener('notificationclick', function (event) {
  event.notification.close()
  // Use the current origin instead of hardcoded localhost
  event.waitUntil(clients.openWindow(self.location.origin))
})

// Handle messages from the client to skip waiting
self.addEventListener('message', function (event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})