
import React, { useState, useEffect } from 'react';
import { UserProfile, MealLog } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import FoodScanner from './components/FoodScanner';
import DietPlanView from './components/DietPlanView';
import ProfileSetup from './components/ProfileSetup';
import Chatbot from './components/Chatbot';
import Login from './components/Login';
import PaymentView from './components/PaymentView';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [logs, setLogs] = useState<MealLog[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'scan' | 'plan' | 'chat'>('dashboard');
  const [isPremium, setIsPremium] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem('dudenutri_auth');
    const savedUser = localStorage.getItem('dudenutri_user');
    const savedLogs = localStorage.getItem('dudenutri_logs');
    const premium = localStorage.getItem('dudenutri_premium');
    
    if (auth === 'true') {
      setIsLoggedIn(true);
      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedLogs) setLogs(JSON.parse(savedLogs));
      if (premium === 'true') setIsPremium(true);
    }
    
    setLoading(false);
  }, []);

  const handleLogin = () => {
    localStorage.setItem('dudenutri_auth', 'true');
    setIsLoggedIn(true);
  };

  const handleSaveProfile = (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem('dudenutri_user', JSON.stringify(profile));
  };

  const handleSubscription = () => {
    setIsPremium(true);
    localStorage.setItem('dudenutri_premium', 'true');
    setShowPayment(false);
    setActiveTab('plan');
  };

  const addMealLog = (log: MealLog) => {
    const newLogs = [log, ...logs];
    setLogs(newLogs);
    localStorage.setItem('dudenutri_logs', JSON.stringify(newLogs));
  };

  const handleLogout = () => {
    // 1. Clear Local Storage
    localStorage.removeItem('dudenutri_auth');
    localStorage.removeItem('dudenutri_user');
    localStorage.removeItem('dudenutri_premium');
    
    // 2. Reset All States
    setIsLoggedIn(false);
    setUser(null);
    setIsPremium(false);
    setShowPayment(false);
    setActiveTab('dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // If not logged in, return Login view immediately
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  // If logged in but no profile, show Profile Setup
  if (!user) {
    return <ProfileSetup onSave={handleSaveProfile} />;
  }

  // If choosing to pay, show Payment overlay
  if (showPayment) {
    return <PaymentView onComplete={handleSubscription} onCancel={() => setShowPayment(false)} />;
  }

  return (
    <div className="min-h-screen pb-24 bg-slate-50 text-slate-900 overflow-x-hidden">
      <Header user={user} onReset={handleLogout} />
      
      <main className="max-w-4xl mx-auto px-4 mt-6">
        {activeTab === 'dashboard' && <Dashboard user={user} logs={logs} />}
        {activeTab === 'scan' && <FoodScanner user={user} onLogMeal={addMealLog} onComplete={() => setActiveTab('dashboard')} />}
        {activeTab === 'plan' && <DietPlanView user={user} isPremium={isPremium} onUpgrade={() => setShowPayment(true)} />}
        {activeTab === 'chat' && <Chatbot user={user} />}
      </main>

      {/* Persistent Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 glass-card border-t border-slate-200 px-6 py-4 flex justify-between items-center z-50 rounded-t-[32px]">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'dashboard' ? 'text-emerald-600 scale-110 font-bold' : 'text-slate-400'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          <span className="text-[10px]">Home</span>
        </button>
        <button 
          onClick={() => setActiveTab('scan')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'scan' ? 'text-emerald-600' : 'text-slate-400'}`}
        >
          <div className="dude-gradient text-white p-4 rounded-full -mt-14 shadow-xl shadow-emerald-200 ring-4 ring-white">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <span className="text-[10px] font-bold">Scan Food</span>
        </button>
        <button 
          onClick={() => setActiveTab('plan')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'plan' ? 'text-emerald-600 scale-110 font-bold' : 'text-slate-400'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
          <span className="text-[10px]">Planner</span>
        </button>
        <button 
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'chat' ? 'text-emerald-600 scale-110 font-bold' : 'text-slate-400'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          <span className="text-[10px]">Coach</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
