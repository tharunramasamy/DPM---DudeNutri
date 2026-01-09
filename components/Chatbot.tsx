import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, ChatMessage } from '../types';
import { getNutritionChatResponse } from '../services/geminiService';

interface ChatbotProps {
  user: UserProfile;
}

const Chatbot: React.FC<ChatbotProps> = ({ user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const aiResponse = await getNutritionChatResponse([...messages, userMessage], user);
      // Ensure aiResponse is a string to satisfy TypeScript
      const modelMessage: ChatMessage = { role: 'model', text: aiResponse || "Sorry bro, I'm drawing a blank. Try again? 💪" };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting right now. 🥗" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[70vh] bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-emerald-50">
        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">AI</div>
        <div>
          <p className="text-sm font-bold text-slate-900">NutriCoach AI</p>
          <p className="text-[10px] text-emerald-600 font-medium">Ready to help with your {user.goal.replace('-', ' ')} goal</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-10 px-6 space-y-4">
            <p className="text-3xl">👋</p>
            <p className="text-slate-900 font-bold text-lg">Hi {user.name}!</p>
            <p className="text-slate-500 text-sm">Ask me anything about your diet, macros, or healthier swaps.</p>
            <div className="flex flex-wrap justify-center gap-2">
              {["Best snack for high cholesterol?", "Is white rice okay for me?", "Swap for potato chips?"].map(q => (
                <button key={q} onClick={() => setInput(q)} className="bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl text-xs text-slate-600 hover:bg-emerald-50 hover:border-emerald-200 transition-all">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
              m.role === 'user' 
                ? 'bg-emerald-500 text-white rounded-tr-none' 
                : 'bg-slate-100 text-slate-800 rounded-tl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none text-slate-400 text-xs animate-pulse">
              Coaching is typing...
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 border-t border-slate-100">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your question..."
            className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-emerald-500 text-white p-3 rounded-2xl shadow-lg shadow-emerald-100 disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;