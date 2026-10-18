/* ============================================================
   Firebase Configuration — SECURE VERSION
   ============================================================
   This version uses environment variables for sensitive data.
   For static sites (GitHub Pages), you need a build step or
   use a serverless function to proxy requests.
   ============================================================ */

// Option 1: Use environment variables (requires build step)
// Example with Vite, Webpack, or similar:
/*
window.FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};
*/

// Option 2: For GitHub Pages WITHOUT build step
// Firebase web API keys are designed to be public, but you MUST:
// 1. Enable Firebase Security Rules to restrict database access
// 2. Restrict API key usage in Firebase Console to your domain only
// 3. Enable Firebase App Check for additional security

window.FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY_HERE", // Replace from Firebase Console
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
  measurementId: "G-XXXXXXXXXX"
};

/* ============================================================
   Contact Form — SECURE SERVERLESS APPROACH
   ============================================================
   DO NOT expose webhook URLs in client-side code!
   Use a serverless function instead.
   ============================================================ */

// Contact form endpoint (Cloudflare Worker, Vercel Edge Function, etc.)
window.CONTACT_FORM_ENDPOINT = '/api/contact';
window.TICKETS_FORM_ENDPOINT = '/api/tickets';

// Rate limiting configuration
window.RATE_LIMIT = {
  maxSubmissions: 3,
  timeWindow: 3600000, // 1 hour in ms
  storageKey: 'kbjs_form_submissions'
};

/* ============================================================
   Security Utilities
   ============================================================ */

window.SecurityUtils = {
  // Sanitize user input to prevent XSS
  sanitize: function(str) {
    if (typeof str !== 'string') return '';
    return String(str)
      .replace(/[&<>"']/g, function(m) {
        return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        }[m];
      })
      .substring(0, 1000); // Max length
  },

  // Check rate limit
  checkRateLimit: function() {
    try {
      var key = window.RATE_LIMIT.storageKey;
      var stored = localStorage.getItem(key);
      var submissions = stored ? JSON.parse(stored) : [];
      var now = Date.now();
      var timeWindow = window.RATE_LIMIT.timeWindow;
      var maxSubmissions = window.RATE_LIMIT.maxSubmissions;

      // Filter recent submissions
      var recent = submissions.filter(function(timestamp) {
        return now - timestamp < timeWindow;
      });

      if (recent.length >= maxSubmissions) {
        var nextAvailable = new Date(recent[0] + timeWindow);
        throw new Error('Rate limit exceeded. Try again after ' + nextAvailable.toLocaleTimeString());
      }

      // Add current timestamp
      recent.push(now);
      localStorage.setItem(key, JSON.stringify(recent));
      return true;
    } catch (e) {
      if (e.message.includes('Rate limit')) throw e;
      // If localStorage fails, allow submission but log error
      console.warn('Rate limit check failed:', e);
      return true;
    }
  },

  // Validate email format
  validateEmail: function(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  },

  // Generate CSRF token (store in session)
  generateCSRFToken: function() {
    var token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(function(b) { return b.toString(16).padStart(2, '0'); })
      .join('');
    sessionStorage.setItem('csrf_token', token);
    return token;
  },

  // Verify CSRF token
  verifyCSRFToken: function(token) {
    return token === sessionStorage.getItem('csrf_token');
  }
};

/* ============================================================
   Example Serverless Function (Cloudflare Worker)
   ============================================================
   Deploy this to Cloudflare Workers, Vercel, or Netlify Functions
   ============================================================

// worker.js
export default {
  async fetch(request, env) {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': 'https://kbjsstudios.qzz.io',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-CSRF-Token',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const data = await request.json();

      // Verify CSRF token
      const csrfToken = request.headers.get('X-CSRF-Token');
      if (!csrfToken) {
        return new Response('Missing CSRF token', { status: 403 });
      }

      // Rate limiting (use KV storage for production)
      const clientIP = request.headers.get('CF-Connecting-IP');
      // ... implement rate limiting logic

      // Sanitize inputs
      const sanitize = (str) => String(str).replace(/[<>]/g, '').substring(0, 1000);
      const name = sanitize(data.name);
      const email = sanitize(data.email);
      const message = sanitize(data.message);

      // Validate email
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return new Response('Invalid email', { status: 400 });
      }

      // Send to Discord
      const webhookURL = env.DISCORD_WEBHOOK_URL; // From environment variable
      const discordPayload = {
        embeds: [{
          title: '📬 New Contact Form Submission',
          fields: [
            { name: 'Name', value: name },
            { name: 'Email', value: email },
            { name: 'Message', value: message }
          ],
          color: 3066993,
          timestamp: new Date().toISOString()
        }]
      };

      await fetch(webhookURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discordPayload)
      });

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response('Internal error', { status: 500 });
    }
  }
};

============================================================ */
