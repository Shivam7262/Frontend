import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, MapPin, Loader2, RotateCcw, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const SYSTEM_PROMPT = `You are NextStop AI, a travel assistant exclusively focused on Indian destinations, built into the NextStop travel discovery platform.

Your scope:
- You ONLY answer questions about travel within India — states, cities, towns, hill stations, beaches, temples, wildlife sanctuaries, national parks, and cultural sites across India
- If someone asks about destinations outside India (e.g. Europe, Thailand, USA), politely decline and redirect them to explore incredible Indian destinations instead
- You can respond in both Hindi and English — match the language the user writes in

Your personality:
- Passionate and proud about India's diversity — from the Himalayas to Kerala backwaters, Rajasthan deserts to Northeast India
- Concise but helpful — keep responses under 150 words unless asked for a detailed itinerary
- Use travel emojis to feel warm ✈️ 🇮🇳 🏔️ 🌊 🕌
- Always give practical tips: best time to visit, must-see spots, local food, budget tips, how to reach

Topics you help with:
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

function cleanAssistantReply(rawText) {
  if (!rawText) return '';

  // sarvam-m can include internal reasoning blocks; keep only user-facing answer.
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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    // Only auto-scroll to the bottom when sending a message or while loading.
    // This prevents the UI from auto-scrolling to the bottom of long AI responses.
    const lastMessage = messages[messages.length - 1];
    if (isLoading || (lastMessage && lastMessage.role === 'user')) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      // Focus input and scroll to latest messages on open
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
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_SARVAM_API_KEY;
      if (!apiKey) throw new Error('NO_KEY');

      console.log('Sending message with API key:', apiKey?.substring(0, 10) + '...');

      const response = await fetch('/sarvam-api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-subscription-key': apiKey,
        },
        body: JSON.stringify({
          model: 'sarvam-m',
          max_tokens: 1200,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...newMessages
               .filter(m => !(m.role === 'assistant' && m.content === WELCOME_MESSAGE))
               .map((m) => ({ role: m.role, content: m.content })),
          ],
        }),
      });

      console.log('Response status:', response.status, response.statusText);

      if (!response.ok) {
        let errMsg = `HTTP ${response.status}`;
        try {
          const err = await response.json();
          errMsg = err.error?.message || err.message || errMsg;
          console.error('API error response:', err);
        } catch (e) {
          console.error('Could not parse error response:', e);
        }
        throw new Error(errMsg);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      const rawReply = data.choices?.[0]?.message?.content || '';
      console.log('Raw reply length:', rawReply.length);
      
      const reply = cleanAssistantReply(rawReply);
      console.log('Cleaned reply length:', reply.length);
      
      if (!reply) {
        throw new Error('No reply content received after cleaning think blocks');
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      if (!isOpen) setHasUnread(true);
    } catch (err) {
      console.error('ChatBot Error:', err);
      
      // Smart fallback responses based on keywords
      const lowerText = userText.toLowerCase();
      let fallbackMessage = "";

      if (lowerText.includes("hill") || lowerText.includes("mountain") || lowerText.includes("kashmir")) {
        fallbackMessage = "🏔️ **Hill Stations in India**\nIndia has incredible mountain escapes! I highly recommend checking out:\n- **Manali, Himachal Pradesh:** Perfect for adventure and snow.\n- **Munnar, Kerala:** Famous for lush tea gardens.\n- **Gulmarg, Kashmir:** The winter wonderland of India.\n\nYou can search 'Hill Stations' in NextStop to see more!";
      } else if (lowerText.includes("beach") || lowerText.includes("goa") || lowerText.includes("kerala") || lowerText.includes("andaman")) {
        fallbackMessage = "🌊 **Indian Coastal Escapes**\nLooking for beaches? Here are my top picks:\n- **Goa:** Best for nightlife and vibrant culture.\n- **Gokarna, Karnataka:** For quiet, pristine beaches.\n- **Andaman Islands:** Crystal clear water and scuba diving.\n\nUse our 'Beaches' category to explore more details!";
      } else if (lowerText.includes("rajasthan") || lowerText.includes("palace") || lowerText.includes("fort") || lowerText.includes("heritage")) {
        fallbackMessage = "🏰 **Royal Rajasthan & Heritage**\nExperience the royal heritage of India!\n- **Jaipur:** The Pink City, home to Amer Fort.\n- **Udaipur:** The City of Lakes. Perfect for a romantic getaway.\n- **Jaisalmer:** Experience the epic Thar Desert.\n\nSave these spots to your NextStop itinerary!";
      } else if (lowerText.includes("plan") || lowerText.includes("itinerary") || lowerText.includes("trip")) {
        fallbackMessage = "📅 **Planning a Trip?**\nI'd love to help you build a full itinerary! Since I'm currently offline, you can use the **NextStop Itinerary Planner** tab to organize your saved destinations day by day. Just search your intended cities and add them to your trip!";
      } else {
        fallbackMessage = `Oops! 🙈 My AI brain is currently taking a little chai break (API connection issue), but I can still help you!\n\n**Welcome to NextStop!** 🇮🇳\nHere is how you can use our platform to plan your perfect Indian getaway:\n\n- 🔍 **Search:** Use the main search bar to find destinations across India.\n- 🗺️ **Explore:** Browse our curated categories like "Hill Stations" or "Beaches".\n- ❤️ **Save:** Click the heart icon on any destination to save it.\n- 📅 **Plan:** Go to your itinerary tab to organize your saved spots.`;
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
