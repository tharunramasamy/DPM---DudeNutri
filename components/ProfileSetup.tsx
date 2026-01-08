
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface ProfileSetupProps {
  onSave: (profile: UserProfile) => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onSave }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    age: 25,
    weight: 70,
    height: 175,
    goal: 'maintenance',
    conditions: [],
    allergies: [],
    dietPreference: 'omnivore',
    dailyCalorieTarget: 2000
  });

  const next = () => setStep(step + 1);
  const back = () => setStep(step - 1);

  const calculateCalories = () => {
    // Basic estimation
    let base = 2000;
    if (formData.goal === 'weight-loss') base = 1600;
    if (formData.goal === 'muscle-gain') base = 2600;
    if (formData.goal === 'diabetes-control') base = 1800;
    return base;
  };

  const handleFinish = () => {
    const finalProfile = {
      ...formData,
      dailyCalorieTarget: calculateCalories()
    } as UserProfile;
    onSave(finalProfile);
  };

  const toggleItem = (list: string[], item: string) => {
    return list.includes(item) ? list.filter(i => i !== item) : [...list, item];
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-6 max-w-lg mx-auto">
      <div className="flex-1">
        <div className="mb-10 mt-10">
          <div className="flex gap-2 mb-2">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1.5 flex-1 rounded-full ${step >= i ? 'bg-emerald-500' : 'bg-slate-100'}`} />
            ))}
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Step {step} of 3</p>
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h1 className="text-4xl font-black text-slate-900 leading-tight">Tell us about <span className="text-emerald-500 underline decoration-emerald-200">yourself</span>.</h1>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">What's your name?</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Alex"
                  className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-lg font-bold focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Weight (kg)</label>
                  <input 
                    type="number" 
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: parseInt(e.target.value)})}
                    className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-lg font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Age</label>
                  <input 
                    type="number" 
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
                    className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-lg font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h1 className="text-4xl font-black text-slate-900 leading-tight">What's your <span className="text-blue-500 underline decoration-blue-200">goal</span>?</h1>
            <div className="grid grid-cols-1 gap-3">
              {[
                { id: 'weight-loss', label: 'Lose Weight', icon: '🔥' },
                { id: 'muscle-gain', label: 'Build Muscle', icon: '💪' },
                { id: 'maintenance', label: 'Eat Healthy', icon: '🥗' },
                { id: 'diabetes-control', label: 'Manage Diabetes', icon: '🩸' },
                { id: 'heart-health', label: 'Heart Health', icon: '❤️' },
              ].map(g => (
                <button 
                  key={g.id}
                  onClick={() => setFormData({...formData, goal: g.id as any})}
                  className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all ${
                    formData.goal === g.id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-2xl">{g.icon}</span>
                  <span className="font-bold text-slate-800">{g.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h1 className="text-4xl font-black text-slate-900 leading-tight">Health <span className="text-amber-500 underline decoration-amber-200">Conditions</span>.</h1>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">Conditions & Allergies</label>
              <div className="flex flex-wrap gap-2">
                {['Diabetes', 'High BP', 'High Cholesterol', 'Gluten Free', 'Nut Allergy', 'Lactose Intolerant', 'Shellfish'].map(item => (
                  <button 
                    key={item}
                    onClick={() => {
                      if (item.includes('Allergy') || item.includes('Free') || item.includes('Intolerant')) {
                        setFormData({...formData, allergies: toggleItem(formData.allergies || [], item)});
                      } else {
                        setFormData({...formData, conditions: toggleItem(formData.conditions || [], item)});
                      }
                    }}
                    className={`px-4 py-2 rounded-full border-2 font-medium text-sm transition-all ${
                      (formData.conditions?.includes(item) || formData.allergies?.includes(item))
                        ? 'bg-amber-500 border-amber-500 text-white' 
                        : 'border-slate-100 text-slate-600 hover:border-amber-200'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">Diet Preference</label>
              <div className="grid grid-cols-2 gap-2">
                {['omnivore', 'vegetarian', 'vegan', 'keto'].map(diet => (
                  <button 
                    key={diet}
                    onClick={() => setFormData({...formData, dietPreference: diet as any})}
                    className={`p-4 rounded-2xl border-2 font-bold text-sm capitalize transition-all ${
                      formData.dietPreference === diet ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-100 text-slate-600'
                    }`}
                  >
                    {diet}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-10 flex gap-4">
        {step > 1 && (
          <button 
            onClick={back}
            className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold"
          >
            Back
          </button>
        )}
        <button 
          onClick={step === 3 ? handleFinish : next}
          disabled={step === 1 && !formData.name}
          className="flex-[2] bg-emerald-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-200 disabled:opacity-50"
        >
          {step === 3 ? 'Get Started' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default ProfileSetup;
