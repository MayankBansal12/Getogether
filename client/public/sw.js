self.addEventListener('push', (e) => {
  const payload = e.data.json()
  const options = {
    body: payload.body,
    icon: 'images/example.png', // Check the image path
    vibrate: [100, 50, 100], // Adjust the vibration pattern
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2',
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore world',
        icon: 'images/checkmark.png',
      },
      { action: 'close', title: 'Close', icon: 'images/xmark.png' },
    ],
  }

  e.waitUntil(
    self.registration
      .showNotification(payload.title, options)
      .catch((error) => {
        console.error('Error while displaying notification:', error)
      }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close() // Close the notification

  const action = event.action // Get the action clicked
  if (action === 'explore') {
    // Perform the action for "explore"
    // eslint-disable-next-line no-undef
    clients.openWindow('https://example.com/explore')
  } else if (action === 'close') {
    // Perform the action for "close"
    // No specific action needed as the notification is already closed
  } else {
    // Default action for clicking on the notification body
    // eslint-disable-next-line no-undef
    clients.openWindow('https://example.com')
  }
})
