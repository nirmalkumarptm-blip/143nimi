# Accept My 143

A romantic, interactive proposal microsite. Plain HTML, CSS and JavaScript. No build step, no backend, no tracking, nothing stored about the visitor.

## Folder structure

```
accept-my-143/
├── index.html      Page structure (landing, letter, 143, proposal, celebration)
├── style.css       All styling, animations, reduced-motion rules
├── script.js       CONFIG at the top (edit this) + the interaction engine
├── README.md       This file
└── assets/         Optional: put music.mp3 here
```

## Run it locally

**Easiest:** double-click `index.html`. It opens in your browser and works.

**Recommended (closest to the real thing):** run a tiny local server from inside the folder.

```bash
cd accept-my-143
python3 -m http.server 8000
```

Then open <http://localhost:8000>. (Node alternative: `npx serve`.)

To preview on your phone, connect it to the same Wi-Fi and open `http://YOUR-COMPUTER-IP:8000`.

The fonts (Fraunces and DM Sans) load from Google Fonts. If they can't load, the site falls back to Georgia and your system font and still works.

## Personalize it

Open `script.js`. The `CONFIG` object at the very top is the only part you need to edit.

| Field | What it does |
|---|---|
| `senderName` | Your name. Shown in the letter signature. Empty → "Someone special". |
| `recipientName` | Their name. Used in the letter greeting, landing heading and proposal question. Empty → "You". |
| `siteTitle` | Browser tab title and the glowing title on the first screen. |
| `message` | The letter. Blank line = new paragraph. Use `{recipient}` and `{sender}` anywhere. |
| `proposalQuestion` | The big question. The recipient's name is added automatically. |
| `proposalSubtitle` | The gentle line under the question. |
| `acceptTitle`, `acceptMessage` | The celebration after "Yes". |
| `thinkMessage` | The kind reply after "Let Me Think". Keep it pressure-free. |
| `musicUrl` | Optional music file. Empty hides the music button. |
| `typewriterSpeed` | Milliseconds per letter (8–80). |

Example:

```js
senderName: "Alex",
recipientName: "Sam",
message: `Hey {recipient},

I've been wanting to tell you something...`,
```

Tips: use `’` instead of `'` inside text, or keep the message inside backticks like the example. Text is inserted as plain text, so special characters can't break the page.

## Add background music (optional)

1. Put your file in `assets/`, for example `assets/music.mp3`.
2. In `script.js`, set `musicUrl: "assets/music.mp3"`.
3. Open the site. A small speaker button appears at the top right.

Music never autoplays. It starts only when the visitor taps that button, and they can pause it again. Only use music you have the right to use (your own, or royalty-free / properly licensed).

## Publish free with GitHub Pages

1. Create a GitHub account and click **New repository**. Name it, for example, `accept-my-143`. Choose **Public** (free Pages hosting needs public on a free account).
2. Click **uploading an existing file**, drag in `index.html`, `style.css`, `script.js` (and the `assets` folder if you added music), then **Commit changes**.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**.
5. Wait about a minute. Your link will be `https://YOUR-USERNAME.github.io/accept-my-143/`.
6. Open the link on your phone before sharing it.

Notes:
- The page includes `noindex`, so search engines are asked not to list it. A public repository's files are still visible to anyone who finds the repo, so don't put anything in `script.js` you wouldn't want others to read.
- File names are case-sensitive on GitHub Pages. Keep them lowercase exactly as above.
- Updating later: edit the file on GitHub, commit, and wait a minute.

## Test checklist

**Buttons and flow**
- [ ] "Open My Heart" plays the transition and reveals the letter.
- [ ] The letter types out; "Show the whole letter" reveals all of it at once.
- [ ] "Continue…" appears after the letter and reveals the 143 section.
- [ ] 1, 4, 3 appear in turn with I / Love / You, then "143 — I LOVE YOU" and the tagline.
- [ ] "One last thing…" reveals the proposal.
- [ ] "Let Me Think 💌" shows the gentle message; both buttons still work afterwards.
- [ ] "Yes, I Accept Your Love ❤️" shows heart confetti and the celebration card.
- [ ] Celebration: Close button, Escape key, and tapping outside the card all close it.
- [ ] "Replay Our Little Story" and the footer "Replay the story" return to a fresh start.
- [ ] Music button is hidden with no URL; with a URL it plays only after a tap and pauses on the second tap.

**Layout (resize the browser or use device mode)**
- [ ] 320 px wide: no sideways scrolling, text readable, buttons fully visible.
- [ ] A long custom letter scrolls normally on a phone.
- [ ] Phone in landscape, tablet, laptop and a wide desktop look balanced.

**Accessibility**
- [ ] Tab key reaches every button in a sensible order and a lavender focus ring is visible.
- [ ] Keyboard only: Enter/Space work on every button; focus stays inside the celebration card while it's open.
- [ ] With "Reduce motion" turned on in your OS: no confetti, floating hearts or typing; everything appears immediately and still works.

**Browsers**
- [ ] Chrome (desktop + Android), Safari (Mac + iPhone), Firefox, Edge.
- [ ] Glass blur and glows look right; if a very old browser lacks blur, the cards fall back to a solid dark background.

## What was actually tested while building this

Run in headless Chromium (Playwright), loading the files directly:

- Full flow at 320, 390 and 1280 px wide: open → letter (skip) → 143 → proposal → "Let Me Think" → "Yes" → confetti drew pixels → Escape closes and returns focus → Replay resets everything. No horizontal overflow and no JavaScript errors at any width.
- Natural typewriter finishes and shows Continue.
- Reduced-motion mode: everything appears instantly, no confetti drawn; keyboard-only run works and focus stays trapped inside the open dialog.
- Personalization with names set: names appear in the heading, greeting, signature and question.
- Music: button hidden without a URL; no `<audio>` element exists until tapped; a missing file shows a friendly message instead of failing silently.
- Screenshots reviewed on mobile widths.

**Not tested:** real iPhone Safari, real Android Chrome, Firefox, Edge, touch gestures on real devices, screen readers, or actual audio playback with a real file. The Google Fonts could not be loaded in the test environment, so the fallback fonts were what got reviewed. Please run through the checklist above on your own phone before sending the link.
