
import React, { useState } from 'react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen dude-gradient flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-700">
        <div className="flex flex-col items-center mb-12 animate-float">
          <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center shadow-2xl mb-6 rotate-12">
            <svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter italic">DudeNutri</h1>
          <p className="text-emerald-100 font-medium mt-2">Your AI Health Bro 🥗</p>
        </div>

        <div className="glass-card rounded-[2.5rem] p-8 space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 text-center">Welcome Back!</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Email</label>
              <input 
                type="email" 
                placeholder="yo@dudenutri.ai"
                className="w-full bg-slate-50 border-0 rounded-2xl p-4 focus:ring-2 focus:ring-emerald-400 transition-all font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-slate-50 border-0 rounded-2xl p-4 focus:ring-2 focus:ring-emerald-400 transition-all font-medium"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            onClick={onLogin}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:bg-black transition-all transform active:scale-95"
          >
            Enter the Lab
          </button>

          <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
            <button className="hover:text-emerald-600 transition-colors">Forgot Password?</button>
            <button className="text-emerald-600 hover:text-emerald-700 transition-colors">Join the Squad</button>
          </div>
        </div>
        
        <p className="mt-8 text-center text-emerald-50/50 text-xs font-medium">
          Powered by Gemini 2.5 Flash • Non-diagnostic education only
        </p>
      </div>
    </div>
  );
};

export default Login;
