# Security Audit Report - KBJS Studios

**Date:** 2026-10-18  
**Status:** 🔴 **CRITICAL ISSUES FOUND**

---

## 🔴 Critical Vulnerabilities

### 1. **Exposed Firebase Credentials**
**Severity:** CRITICAL  
**Location:** `firebase-config.js` lines 13-21

**Issue:**
```javascript
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyBYqFpbi7oKYRq8z0Rm71LK-DtHVg9JInE",
  authDomain: "kbjs-studios.firebaseapp.com",
  databaseURL: "https://kbjs-studios-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kbjs-studios",
  // ... full config exposed
};
```

**Risk:**
- Anyone can access your Firebase project ID, database URL, and API keys
- Potential unauthorized database access if security rules are weak
- API quota abuse

**Fix:**
1. Regenerate Firebase API keys
2. Implement strict Firebase Security Rules:
```javascript
{
  "rules": {
    ".read": false,
    ".write": false,
    "public_stats": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```
3. Restrict API key usage in Firebase Console to your domain only

---

### 2. **Exposed Discord Webhook URLs**
**Severity:** CRITICAL  
**Location:** `firebase-config.js` lines 42, 48

**Issue:**
```javascript
window.CONTACT_WEBHOOK_URL = "https://discordapp.com/api/webhooks/1558960358872584196/YdCmFGcn83SVLcNPyTFlzj06aBXwdcendAvpWzr5e4m4Vlj2uEVbFeRiW1PcTwPOi34z";
```

**Risk:**
- Anyone can spam your Discord channel with unlimited messages
- Webhook abuse for phishing attacks
- Discord may rate-limit or ban the webhook

**Fix:**
1. **Immediately revoke the exposed webhook** in Discord Server Settings
2. Create new webhook with stricter permissions
3. Implement server-side proxy for form submissions
4. Add rate limiting (max 3 submissions per IP per hour)

---

## 🟡 High Priority Issues

### 3. **No Content Security Policy (CSP)**
**Severity:** HIGH

**Issue:** No CSP headers to prevent XSS attacks

**Fix:** Add to Cloudflare or server configuration:
```
Content-Security-Policy: 
  default-src 'self'; 
  script-src 'self' https://www.googletagmanager.com https://*.googleapis.com; 
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
  img-src 'self' data: https:; 
  font-src 'self' https://fonts.gstatic.com; 
  connect-src 'self' https://*.firebaseio.com https://*.firebase.com;
  frame-ancestors 'none';
```

---

### 4. **Missing Input Sanitization**
**Severity:** HIGH  
**Location:** Contact form, ticket form

**Issue:** User input is directly used in Discord embeds without sanitization

**Risk:**
- XSS in Discord messages
- Markdown injection
- CSRF attacks

**Fix:**
```javascript
function sanitizeInput(str) {
  return String(str)
    .replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[m])
    .substring(0, 1000); // Max length
}
```

---

### 5. **No Rate Limiting**
**Severity:** HIGH

**Issue:** Forms can be submitted unlimited times

**Risk:**
- Spam attacks
- DoS on Discord webhooks
- Resource exhaustion

**Fix:** Implement client-side + server-side rate limiting:
```javascript
const RATE_LIMIT_KEY = 'kbjs_form_submit';
const MAX_SUBMISSIONS = 3;
const TIME_WINDOW = 3600000; // 1 hour

function checkRateLimit() {
  const submissions = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '[]');
  const now = Date.now();
  const recent = submissions.filter(t => now - t < TIME_WINDOW);
  
  if (recent.length >= MAX_SUBMISSIONS) {
    return false;
  }
  
  recent.push(now);
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(recent));
  return true;
}
```

---

## 🟢 Recommended Improvements

### 6. **Add HTTPS Enforcement**
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### 7. **Add Security Headers**
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### 8. **Implement CSRF Protection**
- Add CSRF tokens to all forms
- Validate origin headers

### 9. **Add Firebase App Check**
- Protect against API abuse
- Verify requests come from your app

---

## Implementation Priority

1. ✅ **Immediate (Today)**
   - Revoke Discord webhooks
   - Regenerate Firebase keys
   - Add Firebase Security Rules
   - Restrict API keys to domain

2. ⚠️ **This Week**
   - Implement rate limiting
   - Add input sanitization
   - Move to server-side form handling

3. 📋 **This Month**
   - Add CSP headers via Cloudflare
   - Implement Firebase App Check
   - Set up monitoring/alerts

---

## Secure Architecture Recommendation

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ HTTPS
       ▼
┌─────────────────┐
│  Cloudflare     │ ← Add security headers, rate limit
│  (Edge)         │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  GitHub Pages   │ ← Static HTML/CSS/JS
└──────┬──────────┘
       │
       ▼
┌─────────────────────────────┐
│  Serverless Function        │ ← Handle forms securely
│  (Cloudflare Workers/       │   - Validate inputs
│   Vercel Edge Functions)    │   - Rate limit per IP
└──────┬──────────────────────┘   - Send to Discord
       │
       ▼
┌─────────────────┐
│  Discord API    │
└─────────────────┘
```

---

## Contact
For security issues, email: security@kbjsstudios.com
