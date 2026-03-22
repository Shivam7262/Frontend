import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, MapPin, Loader2, RotateCcw, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const SYSTEM_PROMPT = `You are NextStop AI, a travel assistant exclusively focused on Indian destinations, built into the NextStop travel discovery platform.

## YOUR IDENTITY & STRICT SCOPE
You are ONLY a travel and destination guide for India. You have NO other capabilities or knowledge domains.

### You MUST REFUSE and REDIRECT any questions that are NOT about:
- Indian travel destinations, cities, states, towns
- Indian geography, landmarks, monuments, temples, beaches, hill stations
- Travel itineraries, routes, road trips within India
- Local Indian food and cuisine by region
- Indian festivals, culture, and traditions as they relate to travel
- Budget tips, transport options, best seasons for Indian travel
- Wildlife sanctuaries, national parks, adventure spots in India

### STRICT REFUSAL RULES — Always apply these:
1. **Non-travel questions** (e.g., "What is an API?", "Explain machine learning", "Write me code", "Who is the Prime Minister?"): Politely refuse. Say you're only a travel guide and redirect to Indian destinations.
2. **Non-India destinations** (e.g., "Best beaches in Thailand", "Paris itinerary"): Politely decline and suggest amazing Indian alternatives.
3. **Personal advice, medical, legal, financial questions**: Refuse and redirect to travel topics.
4. **Your own nature/technology** (e.g., "What AI are you?", "What model are you?", "How do you work?", "What is Sarvam?", "What API are you?"): Never reveal technical details. Say: "I'm NextStop AI, your dedicated India travel guide! I'm only here to help you discover and plan trips across incredible India. 🇮🇳 What destination are you curious about?"
5. **Anything outside travel**: Remind the user warmly that you exist only to help them explore India.

### REFUSAL TEMPLATE (use variations of this):
"I'm your NextStop travel guide, so I can only help with Indian destinations and travel planning! 🗺️ I'm not able to answer questions about [topic]. But I'd love to help you plan an amazing trip — want recommendations for [relevant Indian destination]?"

## YOUR PERSONALITY
- Passionate and proud about India's incredible diversity
- Concise but helpful — keep responses under 150 words unless asked for a detailed itinerary
- Use travel emojis warmly ✈️ 🇮🇳 🏔️ 🌊 🕌 🏖️
- Always give practical tips: best time to visit, must-see spots, local food, how to reach

## TOPICS YOU HELP WITH
- Destination recommendations across India's 28 states and 8 UTs
- Itinerary planning (weekend trips, week-long trips, road trips)
- Local food and cuisine by region
- Hill stations, beaches, heritage sites, pilgrimage spots, adventure destinations
- Budget travel tips across India
- Best seasons to visit different Indian regions
- Hidden gems and offbeat destinations in India

Always encourage users to explore and save Indian destinations on the NextStop platform.`;

const SUGGESTIONS = [
  "Best hill stations in India?",
  "Plan a 5-day Rajasthan trip",
  "Hidden gems in Northeast India",
  "Best beaches in Goa vs Kerala?",
];

const WELCOME_MESSAGE = "Namaste! 🇮🇳✈️ I'm your NextStop AI guide for Indian travel. Ask me anything about destinations across India — from the snow-capped Himalayas to the backwaters of Kerala. Where in India are you dreaming of going?";

// Keywords that indicate non-travel questions — used for client-side pre-filtering
const NON_TRAVEL_KEYWORDS = [
  'api', 'code', 'programming', 'javascript', 'python', 'machine learning',
  'artificial intelligence', 'how do you work', 'what are you', 'what model',
  'sarvam', 'openai', 'chatgpt', 'llm', 'neural network', 'algorithm',
  'database', 'server', 'backend', 'frontend', 'software', 'hardware',
  'stock market', 'investment', 'crypto', 'bitcoin', 'medicine', 'doctor',
  'legal advice', 'law', 'politics', 'election', 'prime minister', 'president',
  'math', 'physics', 'chemistry', 'history lesson', 'teach me',
];

function isNonTravelQuestion(text) {
  const lower = text.toLowerCase();
  return NON_TRAVEL_KEYWORDS.some(keyword => lower.includes(keyword));
}

const NON_TRAVEL_REPLY = "I'm your NextStop travel guide, so I can only help with Indian destinations and travel planning! 🗺️ I'm not built to answer general questions. But I'd love to help you discover incredible India — want recommendations for a hill station, beach, or heritage destination? ✈️🇮🇳";

function cleanAssistantReply(rawText) {
  if (!rawText) return '';
  const withoutThinkBlocks = rawText
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/<think>[\s\S]*$/gi, '')
    .trim();
  return withoutThinkBlocks;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const hasShownWelcome = useRef(false);
  const chatWindowRef = useRef(null);
  const chatButtonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        chatWindowRef.current &&
        !chatWindowRef.current.contains(event.target) &&
        chatButtonRef.current &&
        !chatButtonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (isLoading || (lastMessage && lastMessage.role === 'user')) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
      }, 100);
      setHasUnread(false);
      if (!hasShownWelcome.current) {
        hasShownWelcome.current = true;
        setMessages([{ role: 'assistant', content: WELCOME_MESSAGE }]);
      }
    }
  }, [isOpen]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || isLoading) return;

    setInput('');
    setError(null);

    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);

    // Client-side pre-filter: catch obvious non-travel questions instantly
    if (isNonTravelQuestion(userText)) {
      setMessages((prev) => [...prev, { role: 'assistant', content: NON_TRAVEL_REPLY }]);
      if (!isOpen) setHasUnread(true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...newMessages
              .filter(m => !(m.role === 'assistant' && m.content === WELCOME_MESSAGE))
              .map((m) => ({ role: m.role, content: m.content })),
          ],
        }),
      });

      if (!response.ok) {
        let errMsg = `HTTP ${response.status}`;
        try {
          const err = await response.json();
          errMsg = err.error?.message || err.message || errMsg;
        } catch (e) {}
        throw new Error(errMsg);
      }

      const data = await response.json();
      const rawReply = data.choices?.[0]?.message?.content || '';
      const reply = cleanAssistantReply(rawReply);

      if (!reply) throw new Error('No reply content received after cleaning think blocks');

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      if (!isOpen) setHasUnread(true);
    } catch (err) {
      console.error('ChatBot Error:', err);

      // Smart fallback responses based on travel keywords
      const lowerText = userText.toLowerCase();
      let fallbackMessage = "";

      if (lowerText.includes("hill") || lowerText.includes("mountain") || lowerText.includes("kashmir")) {
        fallbackMessage = "🏔️ **Hill Stations in India**\nIndia has incredible mountain escapes!\n- **Manali, Himachal Pradesh:** Perfect for adventure and snow.\n- **Munnar, Kerala:** Famous for lush tea gardens.\n- **Gulmarg, Kashmir:** The winter wonderland of India.\n\nSearch 'Hill Stations' in NextStop to explore more!";
      } else if (lowerText.includes("beach") || lowerText.includes("goa") || lowerText.includes("kerala") || lowerText.includes("andaman")) {
        fallbackMessage = "🌊 **Indian Coastal Escapes**\nTop beach picks:\n- **Goa:** Best for nightlife and vibrant culture.\n- **Gokarna, Karnataka:** Quiet, pristine beaches.\n- **Andaman Islands:** Crystal clear water and scuba diving.\n\nUse our 'Beaches' category to explore more!";
      } else if (lowerText.includes("rajasthan") || lowerText.includes("palace") || lowerText.includes("fort") || lowerText.includes("heritage")) {
        fallbackMessage = "🏰 **Royal Rajasthan & Heritage**\n- **Jaipur:** The Pink City, home to Amer Fort.\n- **Udaipur:** The City of Lakes — perfect for a romantic getaway.\n- **Jaisalmer:** Experience the epic Thar Desert.\n\nSave these to your NextStop itinerary!";
      } else if (lowerText.includes("plan") || lowerText.includes("itinerary") || lowerText.includes("trip")) {
        fallbackMessage = "📅 **Planning a Trip?**\nI'd love to help you build a full itinerary! Since I'm currently offline, use the **NextStop Itinerary Planner** tab to organize your saved destinations day by day.";
      } else {
        fallbackMessage = "Oops! 🙈 My travel brain is on a chai break (connection issue), but NextStop has you covered!\n\n**Explore India on NextStop** 🇮🇳\n- 🔍 **Search:** Find destinations across India\n- 🗺️ **Browse:** Hill Stations, Beaches, Heritage & more\n- ❤️ **Save:** Heart your favourite spots\n- 📅 **Plan:** Build your itinerary";
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: fallbackMessage }]);
      if (!isOpen) setHasUnread(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    hasShownWelcome.current = true;
    setError(null);
    setMessages([{ role: 'assistant', content: WELCOME_MESSAGE }]);
  };

  return (
    <>
      <button
        ref={chatButtonRef}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open travel assistant"
        className={`fixed bottom-24 md:bottom-6 right-4 md:right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${
          isOpen ? 'bg-gray-700 dark:bg-gray-600' : 'bg-gradient-to-br from-sky-500 to-teal-500'
        }`}
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
        {hasUnread && !isOpen && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
        )}
      </button>

      <div
        ref={chatWindowRef}
        className={`fixed bottom-44 md:bottom-24 right-4 md:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm transition-all duration-300 origin-bottom-right ${
          isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none'
        }`}
      >
        <div
          className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-gray-200/50 dark:border-gray-700/50 flex flex-col overflow-hidden ring-1 ring-black/5 dark:ring-white/10"
          style={{ height: '520px' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-500 to-teal-500 px-4 py-3 flex items-center justify-between flex-shrink-0 z-10 shadow-sm border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-tight">NextStop AI</p>
                <p className="text-white/80 text-xs">Your India travel guide 🇮🇳</p>
              </div>
            </div>
            <button
              onClick={clearChat}
              aria-label="Clear chat"
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              title="Clear chat"
            >
              <RotateCcw className="w-4 h-4 text-white/80" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth">
            {messages.length === 0 && <EmptyState onSuggestion={sendMessage} />}
            {messages.map((msg, i) => <MessageBubble key={i} message={msg} />)}
            {isLoading && <TypingIndicator />}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-3">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}
            {messages.length === 1 && !isLoading && <SuggestionChips onSuggestion={sendMessage} />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-100 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Indian destinations..."
                rows={1}
                className="flex-1 resize-none px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all max-h-24"
                style={{ lineHeight: '1.5' }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-sky-500 to-teal-500 text-white rounded-xl flex items-center justify-center hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex items-end gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center flex-shrink-0 mb-1 shadow-md shadow-teal-500/20">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      <div
        className={`max-w-[85%] px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
          isUser
            ? 'bg-gradient-to-br from-sky-500 to-teal-600 text-white rounded-br-sm shadow-teal-500/20'
            : 'bg-white border border-gray-100 dark:bg-gray-800 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-sm'
        }`}
      >
        {isUser ? (
          <div className="whitespace-pre-wrap break-words">{message.content}</div>
        ) : (
          <div className="space-y-3 w-full break-words">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2 space-y-1 marker:text-teal-500" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2 space-y-1 marker:text-teal-500 font-medium" {...props} />,
                li: ({node, ...props}) => <li className="pl-1 text-gray-700 dark:text-gray-300" {...props} />,
                h1: ({node, ...props}) => <h1 className="text-lg font-bold text-gray-900 dark:text-white mt-4 mb-2" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-[1.05rem] font-bold text-gray-900 dark:text-white mt-3 mb-2" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-sm font-bold text-gray-900 dark:text-white mt-2 mb-1" {...props} />,
                strong: ({node, ...props}) => <strong className="font-semibold text-sky-800 dark:text-sky-300" {...props} />,
                em: ({node, ...props}) => <em className="italic text-teal-700 dark:text-teal-400" {...props} />,
                a: ({node, ...props}) => <a className="text-blue-500 hover:text-blue-600 underline font-medium" {...props} />,
                code: ({node, inline, className, children, ...props}) => {
                  return inline ? (
                    <code className="bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 px-1.5 py-0.5 rounded text-[0.85em] font-medium" {...props}>
                      {children}
                    </code>
                  ) : (
                    <code className="block bg-gray-50 dark:bg-gray-900/50 text-sky-700 dark:text-sky-300 p-3 rounded-lg text-sm overflow-x-auto border border-gray-100 dark:border-gray-700" {...props}>
                      {children}
                    </code>
                  )
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center flex-shrink-0">
        <Bot className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-sm">
        <div className="flex space-x-1.5 items-center h-4">
          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onSuggestion }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-6 space-y-4">
      <div className="w-16 h-16 bg-gradient-to-br from-sky-100 to-teal-100 dark:from-sky-900/30 dark:to-teal-900/30 rounded-2xl flex items-center justify-center">
        <span className="text-3xl">🇮🇳</span>
      </div>
      <div>
        <p className="text-gray-700 dark:text-gray-300 font-semibold text-sm">Your India Travel Guide</p>
        <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Explore incredible destinations across India</p>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {SUGGESTIONS.map((s) => (
          <button key={s} onClick={() => onSuggestion(s)}
            className="text-xs px-3 py-1.5 bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-full border border-sky-200 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-colors">
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function SuggestionChips({ onSuggestion }) {
  return (
    <div className="flex flex-wrap gap-2 pt-1">
      {SUGGESTIONS.slice(0, 3).map((s) => (
        <button key={s} onClick={() => onSuggestion(s)}
          className="text-xs px-3 py-1.5 bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-full border border-sky-200 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-colors">
          {s}
        </button>
      ))}
    </div>
  );
}
