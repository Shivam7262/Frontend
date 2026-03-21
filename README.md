# NextStop AI - Intelligent Travel Chatbot 🤖✈️

[![React](https://img.shields.io/badge/React-19.1-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.1-purple.svg)](https://vitejs.dev/)
[![Sarvam AI](https://img.shields.io/badge/Sarvam%20AI-Powered-orange.svg)](https://www.sarvam.ai/)

> An intelligent AI-powered travel chatbot for discovering and exploring Indian destinations. Your personal AI travel guide available 24/7 that speaks your language.

---

## Overview

**NextStop AI** is a modern travel discovery platform with a cutting-edge **AI Chatbot** as its core feature. The chatbot, powered by **Sarvam AI** (an advanced Indian LLM), provides personalized travel recommendations, itinerary planning, and expert travel guidance exclusively for Indian destinations.

### Why NextStop AI?
- 🤖 **AI-First Design**: Chatbot is the primary user interaction point
- 🇮🇳 **India Specialist**: Deep knowledge of 28 states & 8 Union Territories
- 💬 **Bilingual**: Responds fluently in English and Hindi
- ⚡ **Lightning Fast**: Built with React 19 and Vite
- 🎨 **Beautiful UI**: Modern, responsive design with dark mode support
- 🔄 **Smart Fallbacks**: Helpful responses even when API is offline

---

## 🤖 NextStop AI Chatbot - The Star Feature

### What Can It Do?

The chatbot is your intelligent travel companion that helps with:

#### 🎯 Destination Discovery
```
User: "Best beaches in India?"
Bot: Comprehensive recommendations with Goa, Maldives 
     alternatives, Kerala backwaters...
```

#### 📅 Itinerary Planning
```
User: "Plan a 7-day trip to Rajasthan"
Bot: Day-by-day itinerary with Jaipur, Jodhpur, Udaipur
     including travel times, attractions, local tips...
```

#### 🏔️ Regional Expertise
```
User: "What's special about Northeast India?"
Bot: Cultural insights, attractions, best seasons, 
     hidden gems, practical travel advice...
```

#### 🎭 Cultural & Practical Guidance
- Local customs and etiquette
- Best time to visit regions
- Budget planning and cost estimates
- Food recommendations by region
- Safety tips and travel hacks
- Hidden gems and offbeat destinations
- Festival and celebration information

#### 💰 Travel Budget & Planning
- Cost estimates for different budgets
- Transportation options
- Accommodation recommendations
- Daily expenses breakdown
- Money-saving tips

### Real-World Examples

| Query | Chatbot Response |
|-------|-----------------|
| "Cool places near Bangalore?" | Hill stations, coastal escapes, heritage forts with detailed guides |
| "Romantic trip ideas?" | Honeymoon destinations, best seasons, romantic experiences |
| "Adventure activities in India?" | Trekking routes, water sports, paragliding, rock climbing locations |
| "Solo travel tips?" | Safe destinations for solo travelers, budget options, communities |
| "Weekend getaway?" | Nearby options from major cities with quick travel guides |

### Key Features

#### 💬 Smart Conversation
- Understands context and follow-up questions
- Remembers conversation history within session
- Provides contextual recommendations
- Handles complex multi-part queries

#### 🌐 Bilingual Support
- Automatically detects user language (English/Hindi)
- Responds in same language for better engagement
- Cultural context and local terminology preserved
- Code-switching support for mixed-language queries

#### 📱 Beautiful Chat Interface
- Floating widget (bottom-right corner)
- Smooth animations and transitions
- Dark mode compatible
- Mobile-responsive design
- One-click conversation reset
- Unread message notifications

#### 🎨 Enhanced User Experience
- Welcome greeting with quick suggestions
- Typing indicators while processing
- Auto-scrolling to latest messages
- Message bubbles with markdown formatting
- Emoji support for warm, engaging responses
- Clear visual distinction between user/bot messages

#### 🚀 Smart Fallback System
When Sarvam API is temporarily offline, chatbot provides intelligent responses based on keywords:

```
Keywords: "hill, mountain, kashmir"
Response: Hill station recommendations (Manali, Shimla, Gulmarg)

Keywords: "beach, goa, kerala"
Response: Coastal destination guides with water sports

Keywords: "rajasthan, palace, heritage"
Response: Historical and architectural gems

Keywords: "plan, itinerary, trip"
Response: Platform feature guidance and planning tips
```

---

## Tech Stack

### ChatBot Technology
- **Sarvam AI Model**: `sarvam-m` (Advanced Indian LLM)
- **API Integration**: OpenAI-compatible endpoints
- **Max Tokens**: 1200 (detailed, comprehensive responses)
- **Language**: Multi-lingual (English, Hindi, more coming)

### Frontend Stack
- **React 19.1**: Latest React with concurrent features
- **Vite 7.1**: Ultra-fast build tool
- **Tailwind CSS 3.3**: Utility-first styling
- **Framer Motion 11.0**: Smooth animations
- **Lucide React 0.400**: Beautiful icons

### Content & Markdown
- **React Markdown**: Parse and display formatted responses
- **Remark GFM**: GitHub-flavored markdown support
- **Emoji Support**: Rich visual communication

### Additional Libraries
- **React Router 6.26**: Navigation
- **React Hot Toast 2.4**: Notifications
- **Swiper 11.0**: Image carousels
- **React Hook Form 7.47**: Form handling

---

## Installation & Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Setup

**1. Clone & Install**
```bash
git clone <repository-url>
cd frontend
npm install
```

**2. Configure Sarvam AI API**

Create `.env` file:
```env
VITE_SARVAM_API_KEY=sk_your_api_key_here
```

**Get your API Key**:
1. Visit https://www.sarvam.ai/
2. Sign up for developer account
3. Generate API key
4. Add to `.env`

**3. Start Development Server**
```bash
npm run dev
```

Open `http://localhost:5173` - Chat widget appears in bottom-right corner!

---

## ChatBot Architecture

### File Location
`src/components/ChatBot.jsx` (400+ lines, fully commented)

### Component Structure
```
ChatBot (Main Container)
├── Chat Button (Fixed Widget)
│   └── Notification badge for unread messages
├── Chat Window
│   ├── Header with NextStop AI branding
│   ├── Messages Container
│   │   ├── Welcome message on first open
│   │   ├── User & Assistant message bubbles
│   │   ├── Quick suggestion chips
│   │   ├── Typing indicator
│   │   └── Error messages
│   └── Input Area
│       ├── Textarea with auto-expand
│       ├── Send button
│       └── Loading state indicator
```

### State Management
```javascript
const [isOpen, setIsOpen] = useState(false);           // Chat visibility
const [messages, setMessages] = useState([]);          // Conversation history
const [input, setInput] = useState('');                // User input
const [isLoading, setIsLoading] = useState(false);     // API loading state
const [error, setError] = useState(null);              // Error messages
const [hasUnread, setHasUnread] = useState(false);     // Notification badge
```

### API Integration

**Request to Sarvam AI**:
```javascript
POST /sarvam-api/v1/chat/completions

Headers:
{
  'Content-Type': 'application/json',
  'api-subscription-key': VITE_SARVAM_API_KEY
}

Body:
{
  model: 'sarvam-m',
  max_tokens: 1200,
  messages: [
    {
      role: 'system',
      content: SYSTEM_PROMPT  // Constrains AI to Indian travel guidance
    },
    {
      role: 'user',
      content: userMessage
    }
  ]
}
```

### System Prompt (Core Intelligence)
The chatbot operates under a carefully crafted prompt that:
- ✅ Restricts responses to Indian destinations ONLY
- ✅ Ensures accurate, travel-focused information
- ✅ Maintains enthusiastic but concise communication
- ✅ Provides practical tips (costs, seasons, transport)
- ✅ Encourages platform exploration
- ✅ Uses warm emojis (✈️ 🏔️ 🌊 🕌)

---

## Quick Feature Walkthrough

### 1. Open Chat
Click the blue chat button in the bottom-right corner

### 2. See Welcome Message
```
"Namaste! 🇮🇳✈️ I'm your NextStop AI guide for Indian travel. 
Ask me anything about destinations across India — from the 
snow-capped Himalayas to the backwaters of Kerala. 
Where in India are you dreaming of going?"
```

### 3. Click Suggestions or Type
Quick suggestions appear for common queries:
- "Best hill stations in India?"
- "Plan a 5-day Rajasthan trip"
- "Hidden gems in Northeast India"
- "Best beaches in Goa vs Kerala?"

### 4. Get Smart Responses
- Markdown formatted text
- Lists and bullet points
- Emojis and visual emphasis
- Context-aware recommendations

### 5. Continue Conversation
Ask follow-ups, get elaborations, refine recommendations

---

## Conversation Examples

### Example 1: Destination Discovery
```
User: "Best hill stations for honeymoon?"

Bot: 🏔️ **Perfect Hill Stations for Honeymoon**

Shimla - Romance in the Mountains
- Stunning views, colonial architecture
- Best time: April-June, September-October
- Activities: Trekking, local cuisine, scenic walks
- Budget: Moderate to mid-range
- Nearest major city: Delhi (340 km)

Manali - Adventure & Love
[Similar detailed response...]

Pro Tips:
• Visit during shoulder seasons for fewer crowds
• Book accommodations in advance
• Try local Himachali cuisine
• Take the scenic toy train if visiting Shimla
```

### Example 2: Itinerary Planning
```
User: "5-day South India tour budget breakdown"

Bot: 💰 **5-Day South India Budget Itinerary**

Day 1: Bangalore
- Accommodation: $30-50
- Food: $20
- Activities: Botanical Gardens

[Day-by-day breakdown...]

**Total Budget Estimates**:
🟢 Budget Traveler: $300-350
🟡 Mid-Range: $450-600
🔴 Luxury: $800-1200

**Tips**:
- Travel by bus for savings
- Stay in homestays or budget hotels
- Eat at local eateries
```

### Example 3: Practical Guidance
```
User: "Solo female travel safety in India?"

Bot: 🛡️ **Safe Solo Travel Tips for Women**

✅ Safest Destinations for Solo Women
- Goa (beach culture, touristy)
- Kerala (peaceful, organized)
- Himachal Pradesh (adventure-friendly)

⚠️ Practical Safety Tips
[Detailed guidance...]
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Send message |
| `Shift+Enter` | New line in input |
| `Esc` | Close chat (when focused) |
| Click outside | Close chat window |

---

## Destinations (Overview)

While the chatbot is the main feature, the frontend includes a destinations browsing interface for Indian locations with:

- **Browse Destinations**: Search and filter by category
- **Detailed Guides**: Information on how to reach, attractions, tips
- **User Reviews**: Community feedback and ratings
- **Save Favorites**: Create personalized collections
- **Quick Reference**: Best season, entry fees, opening hours

**Note**: Destination data comes from hardcoded sample destinations (4 Indian locations). Full backend integration will expand this significantly.

---

## Development

### Code Quality
- ESLint configuration for consistency
- React best practices (hooks, functional components)
- Modular component architecture
- Responsive design (mobile-first)

### Building for Production
```bash
npm run build    # Creates optimized dist/
npm run preview  # Test production build locally
npm run lint     # Check code quality
```

### Project Structure
```
src/
├── components/
│   └── ChatBot.jsx           # ⭐ Main chatbot component
├── pages/
│   ├── Home.jsx
│   ├── Destinations.jsx
│   ├── DestinationDetail.jsx
│   ├── Login.jsx / Signup.jsx
│   └── [other pages]
├── contexts/
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── config/
│   └── api.js
└── [css, assets, etc.]
```

---

## Configuration

### Environment Variables
```env
# Required - Get from https://www.sarvam.ai/
VITE_SARVAM_API_KEY=sk_xxxxxxxxxxxxx

# Optional - Backend URL (for future integration)
VITE_API_BASE_URL=http://localhost:8080
```

---

## ChatBot Best Practices

### ✅ Do Ask
- Specific destination recommendations
- Itinerary planning with dates/budget
- Cultural insights and local customs
- Best times to visit regions
- Budget breakdowns and travel costs
- Hidden gems and offbeat places

### ❌ Don't Ask
- Bookings or reservations
- Medical or legal advice
- Non-Indian destinations
- Real-time pricing or flight bookings
- Personal financial advice

---

## Performance

### ChatBot Optimizations
- Lazy loading of chat component
- Efficient message rendering
- Memory-efficient conversation history
- Optimized markdown parsing
- Smart fallback system (no API blocking)

### Response Quality
- Typical response time: 2-5 seconds
- Max response length: 1200 tokens
- Markdown formatting: Automatic
- Think block removal: Automatic

---

## Browser Support
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Troubleshooting

### Chat Not Responding?
1. Check internet connection
2. Verify `VITE_SARVAM_API_KEY` in `.env`
3. Check browser console for errors
4. Refresh the page

### API Key Issues?
1. Ensure key starts with `sk_`
2. Verify key is from https://www.sarvam.ai/
3. Check key isn't expired
4. Add exact key to `.env` (no extra spaces)

### Dark Mode Not Working?
1. Check ThemeContext setup
2. Verify Tailwind `dark:` classes
3. Test in browser DevTools dark mode

---

## Roadmap

### Next ChatBot Features
- [ ] Voice input & text-to-speech
- [ ] Multi-language expansion (Tamil, Telugu, Marathi)
- [ ] Conversation memory (multi-session)
- [ ] Integration with booking APIs
- [ ] Real-time destination availability
- [ ] Personalized recommendations based on history
- [ ] Group trip planning

### Frontend Features
- [ ] Mobile app (React Native)
- [ ] User profile with saved itineraries
- [ ] Community reviews and forums
- [ ] Real-time weather integration
- [ ] Travel alerts and notifications

---

## Support

For issues or questions:
- 📧 Email: support@nextstop.com
- 💬 Use the chatbot itself for recommendations
- 🐛 GitHub Issues for bug reports
- 💡 Feature requests welcome

---

**Start chatting with NextStop AI now! Click the blue chat button and ask anything about traveling in India.** 🚀🇮🇳
