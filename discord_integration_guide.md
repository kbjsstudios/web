# KBJS Studios | Discord & External Integrations Guide

This guide details how to link your new showcase website with Discord and other core automation pipelines. Setting up these pipelines ensures that you receive instant lead alerts in your server and establish a premium, automated customer onboarding system.

---

## 1. Setting Up Instant Form Alerts (Discord Webhooks)
Whenever a user fills out the booking form on your website, you can have their submission details (Name, Email, Discord tag, chosen services, price estimate, and notes) sent directly to a private channel on your Discord server in a clean, professional **Rich Embed** layout.

### Step 1: Create a Discord Webhook
1. Open Discord and navigate to your server.
2. Right-click the channel where you want alerts to arrive (e.g., `#💼-client-leads` or `#🛠-moderator-logs`) and click **Edit Channel**.
3. Go to the **Integrations** tab in the sidebar.
4. Click **Webhooks** and select **Create Webhook** (or **New Webhook**).
5. Name the webhook (e.g., `KBJS Lead Bot`), choose your preferred channel, and click **Copy Webhook URL**.

### Step 2: Integrate Webhook into Website Forms
To transmit contact data directly to Discord without needing a complex backend, you can modify the form submission listener inside `app.js` to dispatch a secure HTTP POST request containing a formatted JSON payload directly to your Webhook URL.

Open your `app.js` and locate the form submission block (`contactForm.addEventListener('submit', ...)`). Replace the simulated timer logic with the following active network fetch:

```javascript
// Secure Webhook Deployment (Replace within app.js form listener)
const webhookURL = "YOUR_DISCORD_WEBHOOK_URL_HERE";

const payload = {
  username: "KBJS Lead Sentinel",
  avatar_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80",
  embeds: [{
    title: "🚀 New Project Booking Transmitted",
    color: 0x00f2fe, // Neon Cyan hex matching style.css
    timestamp: new Date().toISOString(),
    fields: [
      { name: "👤 Full Name", value: nameVal, inline: true },
      { name: "📧 Email Address", value: emailVal, inline: true },
      { name: "🤖 Discord Handle", value: discordVal || "Not Provided", inline: true },
      { name: "🎯 Project Subject", value: subjectVal, inline: false },
      { name: "💰 Selected Package / Estimate", value: `$${totalPriceElement.textContent} USD`, inline: true },
      { name: "📝 Detailed Requirements", value: msgVal }
    ],
    footer: {
      text: "KBJS Studios System Portal",
      icon_url: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=150&q=80"
    }
  }]
};

// Transmit to Discord Gateway
fetch(webhookURL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})
.then(response => {
  if (response.ok) {
    showToast('Proposal transmitted successfully directly to Discord!', 'success');
    contactForm.reset();
  } else {
    showToast('Server transmission failure. Please check webhooks.', 'error');
  }
})
.catch(err => {
  showToast('Network timeout. Please try again.', 'error');
});
```

---

## 2. Setting Up Member Syncing & Role Access (Discord OAuth2)
If you want to let clients log in with their Discord accounts to verify purchases or assign Discord roles dynamically:

1. **Register a Discord Application**:
   - Visit the [Discord Developer Portal](https://discord.com/developers/applications).
   - Click **New Application** and call it `KBJS Studio Portal`.
   - Go to the **OAuth2** tab, add your domain URL under **Redirects** (e.g., `https://kbjsstudios.com/callback`), and copy your **Client ID** and **Client Secret**.

2. **Authenticate Scopes**:
   - Request the `identify` and `guilds.join` scopes so that your site can securely identify who logged in and optionally add them to your guild.
   - Use standard backend libraries (like Express.js/Next.js with Passport.js or NextAuth.js) to manage exchange codes and securely authorize user tokens.

---

## 3. Minecraft Server & Custom Bot Database Sync
If you are developing Minecraft servers and want them connected with Discord:

1. **Use a Shared Database (MySQL / PostgreSQL)**:
   - Ensure your Minecraft Paper/Spigot server plugins use MySQL databases.
   - Ensure your Discord Bot script (running on Node.js/Python) connects to the *same* database host.
   - Example flow: When a user makes a purchase on your site or verified Discord server channel, write their UUID and Role to the database. The Spigot plugin periodically polls this table, instantly triggering `/minecraft:give` or allocating rank nodes (`/lp user <name> parent add vip`) using asynchronous threads.

2. **Establish Direct WebSockets**:
   - Utilize a WebSocket server to link Spigot plugins and your Discord bot in real-time. Whenever a player joins the Minecraft server, a socket message is instantly piped to the Discord bot, which updates a live `#💬-mc-chat-sync` channel or alters the bot's status activity layout.
