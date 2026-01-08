
import React from 'react';
import { UserProfile, MealLog } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DashboardProps {
  user: UserProfile;
  logs: MealLog[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, logs }) => {
  const today = new Date().setHours(0, 0, 0, 0);
  const todayLogs = logs.filter(log => log.timestamp >= today);
  
  const consumed = todayLogs.reduce((acc, curr) => ({
    calories: acc.calories + curr.macros.calories,
    protein: acc.protein + curr.macros.protein,
    carbs: acc.carbs + curr.macros.carbs,
    fat: acc.fat + curr.macros.fat,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const calorieProgress = Math.min((consumed.calories / user.dailyCalorieTarget) * 100, 100);

  const macroData = [
    { name: 'Protein', value: consumed.protein, color: '#10b981' },
    { name: 'Carbs', value: consumed.carbs, color: '#3b82f6' },
    { name: 'Fat', value: consumed.fat, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Daily Progress Card */}
      <div className="glass-card rounded-[2.5rem] p-8 shadow-xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight italic">Daily Vitals</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{user.goal.replace('-', ' ')} mode active</p>
          </div>
          <div className="text-right">
            <span className="text-4xl font-black text-emerald-600 tracking-tighter">{consumed.calories}</span>
            <span className="text-slate-400 font-bold ml-1">/ {user.dailyCalorieTarget}</span>
            <p className="text-[10px] font-black text-slate-400 uppercase mt-1">kcal consumed</p>
          </div>
        </div>
        
        <div className="w-full bg-slate-100/50 rounded-full h-4 mb-8 p-1 shadow-inner">
          <div 
            className="h-full rounded-full dude-gradient transition-all duration-1000 ease-out shadow-lg shadow-emerald-200" 
            style={{ width: `${calorieProgress}%` }}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          {macroData.map((macro) => (
            <div key={macro.name} className="bg-slate-50/50 rounded-3xl p-4 border border-slate-100/50 text-center shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{macro.name}</p>
              <p className="text-xl font-black text-slate-800 tracking-tighter">{Math.round(macro.value)}<span className="text-xs text-slate-400 ml-0.5">g</span></p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Macro Chart */}
        <div className="glass-card rounded-[2.5rem] p-8 shadow-lg h-[400px]">
          <h3 className="text-lg font-black text-slate-900 italic mb-6">Macro Split</h3>
          <div className="h-full pb-12">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="45%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontWeight: 'bold', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Logs */}
        <div className="glass-card rounded-[2.5rem] p-8 shadow-lg">
          <h3 className="text-lg font-black text-slate-900 italic mb-6">Recent Fuel</h3>
          <div className="space-y-4">
            {todayLogs.length === 0 ? (
              <div className="text-center py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
                <p className="text-4xl mb-4">🍽️</p>
                <p className="text-slate-400 font-bold italic">Empty tank, bro.</p>
                <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mt-2">Scan something delicious</p>
              </div>
            ) : (
              todayLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 rounded-[1.5rem] bg-white border border-slate-50 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center shadow-inner overflow-hidden flex-shrink-0">
                      {log.imageUrl ? <img src={log.imageUrl} className="w-full h-full object-cover" /> : <div className="text-2xl">🥗</div>}
                    </div>
                    <div>
                      <p className="text-md font-black text-slate-800 leading-tight">{log.foodName}</p>
                      <p className="text-[10px] font-bold text-slate-400">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-emerald-600 tracking-tighter">+{log.macros.calories}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">KCAL</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Health Disclaimer */}
      <div className="bg-amber-50/50 border border-amber-100/50 rounded-[2rem] p-6 flex gap-4 backdrop-blur-sm">
        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-black text-amber-700 uppercase tracking-widest">Bro-Science Warning</p>
          <p className="text-xs text-amber-800/70 leading-relaxed font-medium">
            DudeNutri is for education and fun vibes. We're not doctors. If you have serious health issues, please talk to a real medical pro before changing your diet!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
