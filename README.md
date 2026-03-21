# NextStop AI - Travel Chatbot 🤖

AI-powered travel chatbot for Indian destinations. Ask, get recommendations, plan trips instantly!

---

## Quick Setup

### 1. Install
```bash
git clone <repo>
cd frontend
npm install
```

### 2. Add API Key
Create `.env`:
```env
VITE_SARVAM_API_KEY=sk_your_key_from_sarvam.ai
```

### 3. Run
```bash
npm run dev
```

Chat widget appears bottom-right! 🚀

---

## What It Does

**Ask the chatbot anything about India travel:**
- 🎯 Destination recommendations
- 📅 Itinerary planning
- 💰 Budget breakdowns
- 🏔️ Best seasons & travel tips
- 🎭 Cultural insights

---

## Examples

```
You: "Best hill stations for honeymoon?"
Bot: Shimla, Manali, Gulmarg... [with details]

You: "Plan 5-day Rajasthan trip"
Bot: Day-by-day itinerary... [with costs & tips]

You: "Solo travel tips?"
Bot: Safe routes, budget options... [practical advice]
```

---

## Features

✅ **Bilingual** (English & Hindi)  
✅ **Smart Fallbacks** (works offline too)  
✅ **Markdown Formatted** responses  
✅ **Dark Mode** compatible  
✅ **Mobile Responsive**  
✅ **Typing Indicators** & suggestions  

---

## Tech Stack

- React 19 + Vite
- Sarvam AI (`sarvam-m` model)
- Tailwind CSS
- React Markdown

---

## How It Works

1. Click blue chat button
2. See welcome message + suggestions
3. Ask anything about Indian travel
4. Get AI responses in 2-5 seconds
5. Follow up for more details

---

## Commands

| Action | Shortcut |
|--------|----------|
| Send message | `Enter` |
| New line | `Shift+Enter` |
| Close chat | Click outside |

---

## Troubleshooting

**Chat not working?**
- Check API key in `.env`
- Verify internet connection
- Check browser console for errors

**API Key issues?**
- Get from https://www.sarvam.ai/
- Ensure it starts with `sk_`
- No spaces in `.env`

---

## Project Structure

```
src/
├── components/ChatBot.jsx    ⭐ Main chat component
├── pages/                    (Home, Destinations, etc)
├── contexts/                 (Auth, Theme)
└── config/                   (API setup)
```

---

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # Check code quality
```

---

**That's it! Start exploring India with NextStop AI Chatbot 🇮🇳**
