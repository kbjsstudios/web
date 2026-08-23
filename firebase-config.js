/* ============================================================
   Firebase Configuration — Universal View & Like Counter
   ============================================================
   To enable live cross-user stats:
   1. Go to https://console.firebase.google.com
   2. Create a project (free) → Add Web App
   3. Copy the config object below
   4. Enable "Realtime Database" → Create Database (start in test mode)
   5. Replace the placeholder values below
   ============================================================ */

window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyBYqFpbi7oKYRq8z0Rm71LK-DtHVg9JInE",
  authDomain: "kbjs-studios.firebaseapp.com",
  databaseURL: "https://kbjs-studios-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kbjs-studios",
  storageBucket: "kbjs-studios.firebasestorage.app",
  messagingSenderId: "373801996624",
  appId: "1:373801996624:web:c6607e58529293fefb9c55",
  measurementId: "G-SNDYCJWZRN"
};

// Example config — replace with your own:
// window.FIREBASE_CONFIG = {
//   apiKey: "AIzaSy...",
//   authDomain: "your-project.firebaseapp.com",
//   databaseURL: "https://your-project-default-rtdb.firebaseio.com",
//   projectId: "your-project",
//   storageBucket: "your-project.appspot.com",
//   messagingSenderId: "123456789",
//   appId: "1:123456789:web:abc123"
// };

/* ============================================================
   Contact Form Webhook (Discord)
   ============================================================
   1. Discord Server Settings → Integrations → Webhooks → New
   2. Copy the webhook URL and paste it below
   3. Contact form submissions will post straight to your channel
   Leave empty to keep the current local-storage behaviour.
   ============================================================ */
window.CONTACT_WEBHOOK_URL = "";

/* ============================================================
   If Firebase is not configured, stats fall back to localStorage
   (per-device only, not shared across users).
   ============================================================ */
