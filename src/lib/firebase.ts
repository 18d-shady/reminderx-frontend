// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPH-zHyrAlMqXsbUFfdmRa7N4klFJlclE",
  authDomain: "naikas-4b46c.firebaseapp.com",
  projectId: "naikas-4b46c",
  storageBucket: "naikas-4b46c.firebasestorage.app",
  messagingSenderId: "373267196152",
  appId: "1:373267196152:web:7682349b74f283a99f330d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const getMessagingIfSupported = async () => {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    const { getMessaging } = await import("firebase/messaging");
    return getMessaging(app);
  }
  return null;
};