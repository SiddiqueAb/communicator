# Communicator

A real-time peer-to-peer communication app supporting text chat, voice calls, and video calls. No login or account required.

Built with Vue 3, Node.js, Socket.io, and WebRTC.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vue 3 (Composition API), Vite, TailwindCSS |
| Backend | Node.js, Express, Socket.io |
| P2P Media | WebRTC (with Google STUN servers) |
| Signaling | Socket.io events |

---

## Project Structure

```
communicator/
├── server.js             # Signaling server (Express + Socket.io)
├── package.json          # Backend dependencies
└── client/
    ├── index.html        # App entry point
    ├── vite.config.js    # Vite config with Socket.io proxy
    ├── package.json      # Frontend dependencies
    └── src/
        ├── main.js       # Vue app mount
        ├── style.css     # Global base styles
        └── App.vue       # Full application component
```

---

## Requirements

- Node.js v18 or later
- npm v9 or later
- A modern browser (Chrome or Edge recommended for WebRTC)
- A working microphone and/or webcam for calls

---

## Installation

**1. Install backend dependencies**

```bash
cd communicator
npm install
```

**2. Install frontend dependencies**

```bash
cd communicator/client
npm install
```

---

## Running in Development

You need two terminals running at the same time.

**Terminal 1 — Backend (port 3000)**

```bash
cd communicator
npm run dev
```

You should see:

```
Signaling server listening on http://localhost:3000
```

**Terminal 2 — Frontend (port 5173)**

```bash
cd communicator/client
npm run dev
```

You should see:

```
VITE ready in ...ms
Local: http://localhost:5173/
```

Then open `http://localhost:5173` in your browser.

---

## How to Use

### 1. Get your ID

When you open the app, a unique 6-digit ID is automatically assigned and displayed in the top-right corner of the header. Click it to copy it to your clipboard.

### 2. Connect to a friend

Share your 6-digit ID with the person you want to communicate with (via any external channel — message, email, etc.).

Enter their 6-digit ID in the "Enter Friend's ID" field and click **Connect**.

Both users must be connected to the same signaling server for this to work.

### 3. Text chat

Once connected, the chat panel appears at the bottom. Type a message and press **Enter** or click the send button. Messages are delivered in real time.

### 4. Voice call

Click the **Voice** button in the connection bar. The other person will see an incoming call notification and can accept or decline.

During the call:
- **Mute / Unmute** — toggles your microphone
- **End call** — hangs up for both parties

### 5. Video call

Click the **Video** button. Both sides will have their cameras activated.

During the call:
- **Mute / Unmute** — toggles your microphone
- **Hide cam / Show cam** — toggles your camera (the other person sees a placeholder when your camera is off)
- **End call** — hangs up for both parties

### 6. Disconnect

Click **Disconnect** in the connection bar to end the session. Any active call is ended automatically.

---

## Running in Production

**1. Build the frontend**

```bash
cd communicator/client
npm run build
```

This outputs static files to `communicator/client/dist/`.

**2. Serve the frontend from the backend**

Add the following lines to `server.js` before `server.listen(...)`:

```js
const path = require('path');
app.use(express.static(path.join(__dirname, 'client/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});
```

**3. Start the server**

```bash
cd communicator
npm start
```

The app will be available at `http://localhost:3000`.

---

## Notes on Cross-Network Calls

The app uses Google STUN servers (`stun.l.google.com:19302`) for P2P connection negotiation. This works when both users are on the same local network or both have public IP addresses.

For calls across different home or office networks (behind NAT), a TURN server is required. You can add one to the `RTC_CONFIG` object in `client/src/App.vue`:

```js
const RTC_CONFIG = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    {
      urls: 'turn:your-turn-server.com:3478',
      username: 'your-username',
      credential: 'your-password',
    },
  ],
};
```

Free TURN servers are available at [https://www.metered.ca/tools/openrelay](https://www.metered.ca/tools/openrelay).

---

## Browser Support

| Browser | Text Chat | Voice | Video |
|---|---|---|---|
| Chrome 90+ | Yes | Yes | Yes |
| Edge 90+ | Yes | Yes | Yes |
| Firefox 90+ | Yes | Yes | Yes |
| Safari 15+ | Yes | Yes | Partial |
| Mobile Chrome | Yes | Yes | Yes |

Safari has known limitations with certain WebRTC features. Chrome or Edge is recommended for the best experience.
