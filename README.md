# BLACK DEMON Bot v3.0 🖤

> WhatsApp Multi-Device Bot — Merged with GAAJU-XMD commands  
> Gifted-Session compatible | Anti-ban browser fingerprint | Stable reconnection

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

---

## 📋 Command List

### 📥 Downloads
`.video`, `.ytmp4`, `.ytv`, `.ytmp3`, `.yta`, `.yts`, `.song`, `.song2`, `.play`, `.play2`, `.spotify`, `.tiktok`, `.facebook`, `.fbdl`, `.insta`, `.twitter`, `.pinterest`, `.lyrics`, `.lyrics2`, `.web2zip`

### 🎭 Media / Edit
`.sticker`, `.attp`, `.photo`, `.take`, `.vv`, `.vv2`, `.mix`, `.mp4`, `.smeme`, `.tweet`, `.screenshots`, `.simage`, `.blur`

### 👥 Group Management
`.approve`, `.promote`, `.demote`, `.kick`, `.remove`, `.ban`, `.unban`, `.mute`, `.unmute`, `.open`, `.close`, `.add`, `.leave`, `.join`, `.tagall`, `.hidetag`, `.revoke`, `.resetlink`, `.desc`, `.subject`, `.icon`, `.gcprofile`, `.groupinfo`, `.warn`, `.warnings`, `.staff`, `.welcome`, `.goodbye`, `.antilink`, `.antitag`, `.antiforeign`, `.antibot`, `.antibadword`

### 🤖 AI / Chatbot
`.ai`, `.ai2`, `.gemini`, `.gpt`, `.gpt2`, `.gpt3`, `.gpt4`, `.vision`, `.define`, `.chatbot`, `.generate`, `.aivideo`, `.code`, `.gpt`

### 🛠️ Tools & Utilities
`.ping`, `.alive`, `.menu`, `.help`, `.tts`, `.translate`, `.trt`, `.weather`, `.news`, `.github`, `.url`, `.facts`, `.fact`, `.quotes`, `.quote`, `.advice`, `.joke`, `.meme`, `.dice`, `.coinflip`, `.8ball`, `.poll`, `.trivia`, `.hangman`, `.tictactoe`, `.emojimix`, `.ship`, `.pair`, `.compliment`, `.insult`, `.flirt`, `.dare`, `.truth`, `.simp`, `.wasted`, `.character`, `.anime`, `.roseday`, `.poet`, `.goodnight`, `.zodiac`

### 👑 Owner Commands
`.restart`, `.cast`, `.broadcast`, `.broadcast`, `.join`, `.block`, `.unblock`, `.setpp`, `.botpp`, `.save`, `.kill`, `.kickall`, `.setvar`, `.getvar`, `.redeploy`, `.update`, `.cleartemp`, `.clearsession`, `.sudo`, `.settings`, `.premium`, `.setpremium`, `.rmpremium`

### ⚙️ Settings (GAAJU)
`.autostatus`, `.autoread`, `.autotyping`, `.autorecord`, `.antidelete`, `.anticall`, `.pmblocker`, `.setprefix`, `.menustyle`, `.menufont`

---

## 🔗 Gifted-Session Website

The gifted-session code is in the `gifted-session-main/` folder (from the zip you uploaded).  
You can deploy it to Vercel, Render, or any Node.js host and use it to pair your bot.

---

## ⚠️ Disclaimer

This bot is for educational purposes. Use responsibly.  
Do not use for spam or any activity that violates WhatsApp's Terms of Service.
