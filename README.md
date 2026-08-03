<!-- Glowing Footer -->
<p align="center">
  <img src="https://i.imgur.com/dBaSKWF.gif" height="40" width="100%">
</p>
<div align="center">
<a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.demolab.com?font=Black+Ops+One&size=50&pause=1000&color=1BAFBAFF&center=true&width=910&height=100&lines=HI+THIS+IS+ACCINEX-M;A+MULTI+DEVICE+WHATSAPP+BOT;SCRIPTED+BY+JINWIIL+TECH;STAR+AND+FORK+OUR+REPO" alt="Typing SVG" /></a>
  </p>

> WhatsApp Multi-Device Bot  
<p align="center">
<a href="#"><img title="Creator" src="https://img.shields.io/badge/Creator- Aciinex-blue.svg?style=for-the-badge&logo=github"></a>
</p>

---

## ⚡ Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Get a Session ID (so the bot doesn't need to scan QR on every restart)

**Option A — Gifted-Session website (recommended)**
1. Open the gifted-session website (deploy the included gifted-session code or use a public deployment)
2. Click **Pair via Code**
3. Enter your WhatsApp number (with country code, no +)
4. WhatsApp will send you an 8-digit pairing code
5. Enter it in WhatsApp → **Linked Devices → Link a Device → Link with phone number**
6. Copy the `SESSION_ID` shown on the website

**Option B — QR Code**
Leave `SESSION` empty in `.env` and scan the QR code that appears in the terminal.

### 3. Configure
```bash
cp .env.example .env
# Then edit .env with your SESSION and other settings
```

Set the `SESSION` variable to your session ID from the gifted-session website.

### 4. Run
```bash
npm start
# or
node index.js
```

---

## 🔧 Environment Variables

| Variable | Default | Description |
|---|---|---|
| `SESSION` | _(empty)_ | Session ID from gifted-session |
| `PREFIX` | `.` | Command prefix |
| `MODE` | `PUBLIC` | `PUBLIC` or `PRIVATE` |
| `BOTNAME` | `BLACK-DEMON` | Bot display name |
| `DEV` | `254769365617` | Owner number (no +) |
| `AUTOBIO` | `FALSE` | Auto-update WhatsApp bio |
| `AUTOVIEW_STATUS` | `TRUE` | Auto-view status updates |
| `AUTOLIKE_STATUS` | `TRUE` | Auto-like status updates |
| `AUTOREJECT_CALL` | `TRUE` | Reject all incoming calls |
| `ANTIDELETE` | `TRUE` | Send deleted messages to bot DM |
| `ANTILINK` | `TRUE` | Remove WA group links |
| `ANTILINK_ALL` | `FALSE` | Remove all URLs |
| `ANTIFOREIGN` | `FALSE` | Remove foreign-country numbers |
| `CODE` | `254` | Country code for anti-foreign |
| `WELCOMEGOODBYE` | `TRUE` | Welcome/goodbye messages |
| `ANTITAG` | `TRUE` | Prevent mass-tagging |
| `ANTIBOT` | `FALSE` | Remove other bots from group |
| `MENU_TYPE` | `IMAGE` | `IMAGE`, `VIDEO`, `TEXT`, or `LINK` |
| `WA_PRESENCE` | `online` | `online`, `typing`, `recording`, `unavailable` |

 
***[![Tap to deploy on heroku](https://www.herokucdn.com/deploy/button.svg)](https://dashboard.heroku.com/new?button-url=https://github.com/Finjohns/Black-Hencill&template=https://github.com/Finjohns/Black-Hencill.git)***
 
 
  
  <!-- Glowing Footer -->
<p align="center">
  <img src="https://i.imgur.com/dBaSKWF.gif" height="40" width="100%">
</p>

## License

[MIT License]((https://github.com/Finjohns/Black-Demon)/LICENSE)
## ⚠️ Disclaimer

This bot is for educational purposes. Use responsibly.  

<!-- Glowing Footer -->
<p align="center">
  <img src="https://i.imgur.com/dBaSKWF.gif" height="40" width="100%">
</p>

Do not use for spam or any activity that violates WhatsApp's Terms of Service.
