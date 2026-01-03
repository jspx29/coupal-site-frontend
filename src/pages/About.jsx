import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Heart } from 'lucide-react';
import cat_bg_1 from '../assets/cat-bg-1.png';
import cat_bg_2 from '../assets/cat-bg-2.png';

export default function About() {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: "Hi babe! I'm Jasper Bot 💜 Ask me anything about you two!",
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const getResponse = (userInput) => {
    const input = userInput.toLowerCase().trim();

    if (/^(hi|hello|hey|sup|yo|hola)/.test(input)) {
      return 'Hello love! 💕 What would you like to know about your special relationship?';
    }

    if (/anniversary|when.*start|when.*together|date.*start/.test(input)) {
      return "Your beautiful journey started on December 10, 2024 💖 That's when everything began!";
    }

    if (/first date|first.*meet|april 12/.test(input)) {
      return 'Your first date was on April 12, 2025 🌹 He was so nervous picking you up at the hotel lobby with flowers and gifts! He even cried that night because he was so happy to finally be with you. So sweet! 😭💕';
    }

    if (/second date|july 2|poison challenge/.test(input)) {
      return "Your second date was July 2, 2025! You two walked so far to get to the hotel, but he said he'd walk any distance as long as he's with you 🥺 You did the poison challenge and had a Netflix date. He fell asleep so fast he didn't even say goodnight! 😴💕";
    }

    if (/love|why.*love|feelings/.test(input)) {
      return "He loves you because you make life so colorful and meaningful 🌈 You've filled his days with joy, laughter, and endless love. Every moment with you is a treasure! 💖";
    }

    if (/ldr|long distance|distance/.test(input)) {
      return "Even though you're in a long-distance relationship, he promises to never leave you 💜 He knows it's tough, but he believes you can overcome any problem as long as you're together. Distance means nothing when someone means everything! 🌍💕";
    }

    if (/memories|remember|special moment/.test(input)) {
      return 'You have so many beautiful memories together! 🎬 Check out the Anniversary page to see all your special moments - from first dates to random adventures. Each one is precious! ✨';
    }

    if (/thank|thanks|appreciate/.test(input)) {
      return "He's the one who's thankful! 🥰 Thank you for being in his life, for being patient, understanding, and for making him believe in love. You make everything easier just by being you! 💕";
    }

    if (/future|marry|wedding|forever/.test(input)) {
      return "He wants to make more memories, more moments, and more years together with you! 💍 Forever isn't long enough when it comes to you. Let's keep building this beautiful future together! 🌟";
    }

    if (/how are you|how.*doing|what.*up/.test(input)) {
      return "I'm doing great! 😊 But more importantly, how are YOU doing, love? I'm here if you want to know anything about your relationship!";
    }

    if (/notes|list|todo|movies|places|things/.test(input)) {
      return "You two have lists of movies to watch, places to visit, and things to do together! 📝 Check out the Notes page to see your shared bucket list. Don't forget to drag items to 'Done' when you complete them! ✅";
    }

    if (/who made|who created|who built/.test(input)) {
      return 'This website was made by your loving boyfriend as a special gift for you! 💝 He coded every bit of it with love. Pretty romantic, right? 🥰';
    }

    if (/tanga|gago|pakyu|tanginamo|bobo|baliw/.test(input)) {
      return 'HAHAHAHAHAHA angas mo ah';
    }

    if (/colors|color|favorite color/.test(input)) {
      return 'Jasper’s favorite color is green, and yours is either pink or purple — the perfect match, just like the two of you.';
    }

    if (/pets|pet|how many pets/.test(input)) {
      return "Jasper doesn’t have pets of his own, but he's currently feeding 3 stray cats — Mochi, Lili, and Miki. As for you, you have 5 cats: Tom, Snow, Jokjok, Inco, and Frankie. And you also have 3 dogs: Chloe, Kimmy, and Diego!";
    }

    if (/food|favorite food|fav food|foods/.test(input)) {
      return 'Your favorite food is shrimp, and Jasper’s favorite food is chicken — perfect combo, seafood + chicken lovers!';
    }

    const responses = [
      "Hmm, I'm not sure about that one! 🤔 Try asking me about your first date, anniversary, memories, or your relationship!",
      "That's an interesting question! 💭 I know a lot about your love story - ask me about dates, memories, or how much he loves you!",
      "I don't have an answer for that yet, but I'm learning! 📚 Try asking about your special moments together!",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const chatBodyRef = useRef(null);

  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      type: 'user',
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setMessages([...messages, userMessage]);
    setInput('');

    setIsTyping(true);

    setTimeout(() => {
      const botResponse = {
        type: 'bot',
        text: getResponse(input),
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages([
      {
        type: 'bot',
        text: "Hi babe! I'm Jasper Bot 💜 Ask me anything about you two!",
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 flex items-center justify-center p-6">
      <img
        src={cat_bg_1}
        className="fixed top-24 left-10 w-20 h-20 lg:w-24 lg:h-24 opacity-40 pointer-events-none"
        alt=""
      />
      <img
        src={cat_bg_2}
        className="fixed top-1/2 right-10 w-14 h-14 lg:w-16 lg:h-16 opacity-40 pointer-events-none"
        alt=""
      />
      <img
        src={cat_bg_1}
        className="fixed bottom-1/3 left-20 w-14 h-14 lg:w-16 lg:h-16 opacity-30 pointer-events-none"
        alt=""
      />
      <img
        src={cat_bg_2}
        className="fixed bottom-10 right-24 w-20 h-20 lg:w-24 lg:h-24 opacity-40 pointer-events-none"
        alt=""
      />

      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">
                🤖
              </div>
              <div>
                <h1 className="text-2xl font-bold">Jasper Bot</h1>
                <p className="text-sm text-purple-100">
                  Your relationship AI assistant
                </p>
              </div>
            </div>
            <button
              onClick={handleClear}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              title="Clear chat"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        <div
          ref={chatBodyRef}
          className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-purple-50/30 to-pink-50/30"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-purple-600 text-white rounded-br-none'
                    : 'bg-white text-gray-800 shadow-md rounded-bl-none'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.type === 'user'
                      ? 'text-purple-100'
                      : 'text-gray-400'
                  }`}
                >
                  {message.time}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 shadow-md px-4 py-3 rounded-2xl rounded-bl-none">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                    style={{ animationDelay: '0.4s' }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-6 bg-white border-t border-purple-100">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your love story... 💕"
              className="flex-1 px-4 py-3 border-2 border-purple-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={handleSend}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-full hover:shadow-lg transition-all flex items-center gap-2 font-medium"
            >
              <Send size={18} />

              <span className="hidden sm:inline">Send</span>
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setInput('Tell me about our first date')}
              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200 transition-colors"
            >
              First Date 💕
            </button>
            <button
              onClick={() => setInput('When is our anniversary?')}
              className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm hover:bg-pink-200 transition-colors"
            >
              Anniversary 🎉
            </button>
            <button
              onClick={() => setInput('Why does he love me?')}
              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200 transition-colors"
            >
              Why me? 💖
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
