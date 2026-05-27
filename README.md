# Crush Website — Customization Guide

A highly interactive digital scrapbook + compatibility experience built with React, Tailwind CSS, and Framer Motion.

---

## Quick Start

```bash
# Frontend
cd crush-website
npm install
npm run dev
# → opens at http://localhost:5173

# Backend (separate terminal)
cd crush-website/backend
npm install
npm run dev
# → API at http://localhost:3001
# → Admin dashboard at http://localhost:3001/admin
```

---

## Project Structure

```
crush-website/
├── src/
│   ├── App.jsx                      # Main app — controls section order
│   ├── components/
│   │   ├── Landing.jsx              # Entry page with typewriter animation
│   │   ├── CompatibilityScanner.jsx # Fake scan + metrics
│   │   ├── PreferenceQuestions.jsx   # Two-person preference comparison
│   │   ├── GuessMyAnswer.jsx        # "Guess what I'd pick" game
│   │   ├── OneWordPrompts.jsx       # Quick-fire text prompts
│   │   ├── MiniGames.jsx            # Would You Rather + Rate My Traits
│   │   ├── Scrapbook.jsx            # Polaroid photo cards
│   │   ├── ThingsINeverSent.jsx     # Unlockable vault of unsent messages
│   │   ├── VibeCheck.jsx            # Emergency vibe check + deep question
│   │   ├── DevConsole.jsx           # Fake developer terminal
│   │   ├── CTA.jsx                  # Final vibe check buttons
│   │   ├── SpotifyWrapped.jsx       # Wrapped-style ending slides
│   │   ├── HiddenEnding.jsx         # Secret ending (click to reveal)
│   │   ├── EasterEggs.jsx           # Hidden stars + konami code
│   │   ├── AchievementPopup.jsx     # Floating achievement notifications
│   │   ├── FloatingBackground.jsx   # Animated background orbs/particles
│   │   ├── Typewriter.jsx           # Typewriter text effect
│   │   ├── SectionDivider.jsx       # Animated divider between sections
│   │   └── Footer.jsx               # Footer text
│   ├── hooks/
│   │   ├── useAchievements.js       # Achievement unlock logic
│   │   └── useVisitAwareness.js     # Revisit tracking
│   ├── utils/
│   │   ├── analytics.js             # Backend communication + tracking
│   │   └── constants.js             # ⭐ NAMES + shared animation variants
│   └── index.css                    # Global styles + utility classes
├── backend/
│   ├── server.js                    # Express + SQLite API + admin dashboard
│   ├── package.json
│   └── .gitignore
├── index.html                       # HTML entry point (font loading)
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## ⭐ STEP 1: Change Names

**File:** `src/utils/constants.js`

```js
export const userName = "Aanchal";       // ← Person receiving the website
export const creatorName = "Prateek";    // ← You (the creator)
```

These variables are used throughout the site automatically.

---

## ⭐ STEP 2: Add Your Photos

**File:** `src/components/Scrapbook.jsx`

The scrapbook currently shows emoji placeholders. To add real photos:

1. Place your images in `public/photos/` (create the folder):
   ```
   public/photos/photo1.jpg
   public/photos/photo2.jpg
   public/photos/photo3.jpg
   ```

2. Edit `src/components/Scrapbook.jsx` — find the `photos` array near the top and update accordingly. Replace the emoji placeholder in the card's front face with an `<img>` tag:

   Find this block inside `PolaroidCard` (the front face content):
   ```jsx
   <div className={`w-full aspect-square bg-gradient-to-br ${photo.color} rounded-xl flex items-center justify-center...`}>
     <motion.span ...>{photo.emoji}</motion.span>
   ```

   Replace with:
   ```jsx
   <div className="w-full aspect-square rounded-xl overflow-hidden">
     <img src={photo.src} alt="" className="w-full h-full object-cover" />
   ```

   And update the `photos` array:
   ```js
   const photos = [
     {
       src: "/photos/photo1.jpg",
       caption: "your caption here",
       backText: "text shown when flipped",
       rotation: -3,
       color: "from-rose-500/20 to-pink-500/10",  // fallback if no image
     },
     // ... more photos
   ];
   ```

---

## ⭐ STEP 3: Customize Questions & Answers

### Preference Questions
**File:** `src/components/PreferenceQuestions.jsx`

Edit the `preferences` array. Each question object:
```js
{
  question: "Your question? 😄",
  options: ["Option A", "Option B", "Option C"],
  myAnswer: "Option B",                    // Must exactly match one option
  matchReaction: "shown if they pick same", 
  mismatchReaction: "shown if different",
  myNote: "small personal note shown below your answer",
  // Optional:
  hasFollowUp: true,                       // Shows text input after answer
  followUpPrompt: "prompt text",
  followUpPlaceholder: "placeholder...",
  hasOtherInput: true,                     // Shows text input if "Other" picked
  otherPlaceholder: "placeholder...",
}
```

### Guess My Answer
**File:** `src/components/GuessMyAnswer.jsx`

Edit the `guesses` array:
```js
{
  question: "Question? 🎧",
  options: ["A", "B", "C", "D"],
  answer: "B",                             // Must exactly match one option
  revealText: "explanation shown after reveal",
  correctReaction: "if they guessed right",
  wrongReaction: "if they guessed wrong",
}
```

### One Word Prompts
**File:** `src/components/OneWordPrompts.jsx`

Edit the `prompts` array:
```js
{ question: "Your prompt? 👀", placeholder: "hint...", myResponse: "your response after they answer" }
```

### Would You Rather
**File:** `src/components/MiniGames.jsx`

Edit the `wouldYouRather` array:
```js
{ a: "Option A text", b: "Option B text", myPick: "a", myReason: "why you'd pick this" }
```

### Rate My Traits
**File:** `src/components/MiniGames.jsx`

Edit the `traitRatings` array:
```js
{ trait: "Trait Name", emoji: "🧠", tooltip: "hover description" }
```

---

## ⭐ STEP 4: Customize The Vault (Unsent Messages)

**File:** `src/components/ThingsINeverSent.jsx`

Edit the `vault` array. Types: `unsent`, `deleted`, `observation`, `joke`, `almost-said`, `thought`
```js
{ type: "unsent", text: "Your message here" }
```

---

## ⭐ STEP 5: Customize Dev Console Logs

**File:** `src/components/DevConsole.jsx`

Edit the `logs` array. Types: `system`, `error`, `success`, `warn`
```js
{ type: "error", text: "✗ your funny log message" }
```

---

## ⭐ STEP 6: Customize Hidden Ending

**File:** `src/components/HiddenEnding.jsx`

Edit the `endingLines` array — these appear one by one with dramatic timing:
```js
const endingLines = [
  "first line...",
  "the important line.",
  "more context...",
];
```

---

## ⭐ STEP 7: Customize Spotify Wrapped

**File:** `src/components/SpotifyWrapped.jsx`

Edit the `slides` array. Each slide:
```js
{ bg: "from-pink-600 to-rose-700", metric: "97%", title: "Slide Title", detail: "description text" }
```

The first slide uses `content: "intro"` for the intro card.

---

## ⭐ STEP 8: Customize Compatibility Scanner

**File:** `src/components/CompatibilityScanner.jsx`

- `scanMessages` array — loading messages shown during scan
- `metrics` array — the final results:
```js
{ label: "Metric Name", value: 89, emoji: "✨", color: "from-purple-500 to-pink-500" }
```

---

## ⭐ STEP 9: Customize Landing Page Text

**File:** `src/components/Landing.jsx`

Find the `<Typewriter text={...} />` component and change the text string.
Also edit the subtitle text and button label below it.

---

## ⭐ STEP 10: Customize Final Vibe Check

**File:** `src/components/CTA.jsx`

Edit the `options` array:
```js
{ label: "button text", reaction: "response shown after picking" }
```

---

## Backend: Admin Credentials

**File:** `backend/server.js` (lines 9-10)

```js
const ADMIN_USER = "prateek";    // ← change this
const ADMIN_PASS = "crush2024";  // ← change this
```

Admin dashboard: `http://localhost:3001/admin`

---

## Backend: Connecting to Production

When you deploy the frontend, set the backend URL:

**Option A — Environment variable:**
Create `.env` in the project root:
```
VITE_API_URL=https://your-backend-url.com
```

**Option B — Edit directly:**
`src/utils/analytics.js` line 5:
```js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
```

---

## Section Order

To reorder, add, or remove sections, edit `src/App.jsx`. The sections render in the order they appear:

```jsx
<CompatibilityScanner />
<PreferenceQuestions />
<GuessMyAnswer />
<OneWordPrompts />
<MiniGames />
<Scrapbook />
<ThingsINeverSent />
<VibeCheck />
<DevConsole />
<CTA />
<SpotifyWrapped />
<HiddenEnding />
```

Remove a line to hide that section. Reorder lines to change flow.

---

## Achievements

**File:** `src/hooks/useAchievements.js`

Edit `ACHIEVEMENT_DEFS` to add/change achievements:
```js
achievement_id: { title: "Display Title", icon: "🏆", sub: "subtitle text" }
```

---

## Deploying

### Frontend (Vercel / Netlify / any static host)
```bash
npm run build
# Deploy the `dist/` folder
```

### Backend (Railway / Render / any Node host)
```bash
cd backend
# Deploy — just needs Node.js
# The SQLite db file is created automatically
```

Remember to:
1. Set `VITE_API_URL` in your frontend deployment to point to the deployed backend
2. Change admin credentials in `backend/server.js` before deploying

---

## Tips

- All tracking works even if backend is offline (falls back to localStorage)
- Photos should be under 500KB each for best performance
- Test on mobile — the site is mobile-first
- The Easter Egg stars appear after ~8 seconds and every ~6 seconds after
- Konami code (↑↑↓↓←→) triggers a hidden achievement
- Double-clicking scrapbook cards flips them
