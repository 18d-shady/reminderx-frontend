importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBPH-zHyrAlMqXsbUFfdmRa7N4klFJlclE",
  authDomain: "naikas-4b46c.firebaseapp.com",
  projectId: "naikas-4b46c",
  storageBucket: "naikas-4b46c.firebasestorage.app",
  messagingSenderId: "373267196152",
  appId: "1:373267196152:web:7682349b74f283a99f330d"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
}); 