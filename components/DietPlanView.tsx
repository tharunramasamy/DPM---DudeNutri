
import React, { useState, useEffect } from 'react';
import { UserProfile, DietPlan } from '../types';
import { generateDietPlan } from '../services/geminiService';

interface DietPlanViewProps {
  user: UserProfile;
  isPremium: boolean;
  onUpgrade: () => void;
}

const DietPlanView: React.FC<DietPlanViewProps> = ({ user, isPremium, onUpgrade }) => {
  const [plans, setPlans] = useState<DietPlan[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPlan = async () => {
    if (!isPremium) return;
    setLoading(true);
    try {
      const result = await generateDietPlan(user);
      setPlans(result);
    } catch (error) {
      alert("Failed to generate plan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, [isPremium]);

  if (!isPremium) {
    return (
      <div className="py-12 px-4 animate-in fade-in duration-700">
        <div className="text-center mb-10">
          <span className="premium-shimmer text-[10px] font-black text-white px-3 py-1 rounded-full uppercase tracking-[0.2em] shadow-lg inline-block mb-4">
            DudeNutri Pro
          </span>
          <h2 className="text-4xl font-black text-slate-900 mb-2">Unlock Your Elite <span className="text-amber-500">Plan</span></h2>
          <p className="text-slate-500 font-medium">Get personalized AI meal plans, shopping lists, and 24/7 bro-coaching.</p>
        </div>

        <div className="glass-card rounded-[3rem] p-10 relative overflow-hidden text-center group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full -ml-16 -mb-16 blur-3xl"></div>
          
          <div className="relative z-10 space-y-8">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-amber-50 rounded-[2rem] flex items-center justify-center text-4xl shadow-inner animate-float">
                💎
              </div>
            </div>
            
            <div className="space-y-4 max-w-sm mx-auto">
              <div className="flex items-center gap-3 text-sm font-bold text-slate-700 bg-white/50 p-3 rounded-2xl">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">✓</div>
                7-Day Personalized Meal Cycle
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-slate-700 bg-white/50 p-3 rounded-2xl">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">✓</div>
                Disease-Specific Nutrition Guard
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-slate-700 bg-white/50 p-3 rounded-2xl">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">✓</div>
                Smart Grocery Auto-Generator
              </div>
            </div>

            <div className="pt-6">
              <p className="text-4xl font-black text-slate-900">$9.99<span className="text-lg text-slate-400">/mo</span></p>
              <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">No Commitment • Cancel Anytime</p>
            </div>

            <button 
              onClick={onUpgrade}
              className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-xl shadow-2xl hover:bg-black hover:scale-[1.02] transition-all"
            >
              Start My Transformation
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="inline-block animate-bounce bg-emerald-100 p-4 rounded-full text-4xl">
          👨‍🍳
        </div>
        <p className="text-emerald-600 font-black text-xl">Chef Dude is Cooking...</p>
        <p className="text-slate-400 font-medium italic">Building the ultimate fuel guide for your goals.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-100 text-amber-600 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter">Pro Access</span>
            <h2 className="text-3xl font-black text-slate-900 italic">Elite Fuel Plan</h2>
          </div>
          <p className="text-sm text-slate-500 font-medium">Curated strictly for {user.name}'s gains.</p>
        </div>
        <button 
          onClick={fetchPlan}
          className="text-xs font-black text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-2xl transition-colors"
        >
          Regenerate Plan
        </button>
      </div>

      <div className="space-y-8">
        {plans.map((day, idx) => (
          <div key={idx} className="glass-card rounded-[2.5rem] p-8 animate-in fade-in slide-in-from-bottom-8 duration-500" style={{ animationDelay: `${idx * 150}ms` }}>
            <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-2 h-8 dude-gradient rounded-full"></span>
              {day.day}
            </h3>
            <div className="grid gap-6">
              {day.meals.map((meal, mIdx) => (
                <div key={mIdx} className="flex gap-5 p-5 rounded-[2rem] bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all border border-transparent hover:border-slate-100 group">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 text-3xl group-hover:rotate-6 transition-transform">
                    {meal.type === 'Breakfast' ? '🍳' : meal.type === 'Lunch' ? '🥙' : meal.type === 'Dinner' ? '🍝' : '🍎'}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">{meal.type}</p>
                      <span className="text-xs font-bold text-slate-400 bg-slate-100/50 px-2 py-1 rounded-lg">{meal.calories} kcal</span>
                    </div>
                    <p className="text-lg font-bold text-slate-800 mb-2 leading-tight">{meal.name}</p>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-500 text-lg">“</span>
                      <p className="text-xs font-medium text-slate-500 leading-relaxed italic">{meal.reason}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DietPlanView;
