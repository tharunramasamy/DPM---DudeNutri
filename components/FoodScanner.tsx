
import React, { useState, useRef } from 'react';
import { UserProfile, FoodAnalysis, MealLog } from '../types';
import { analyzeFoodImage } from '../services/geminiService';

interface FoodScannerProps {
  user: UserProfile;
  onLogMeal: (log: MealLog) => void;
  onComplete: () => void;
}

const FoodScanner: React.FC<FoodScannerProps> = ({ user, onLogMeal, onComplete }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImage(base64);
        performAnalysis(base64.split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  const performAnalysis = async (base64: string) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeFoodImage(base64, user);
      setAnalysis(result);
    } catch (error) {
      alert("Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const confirmMeal = () => {
    if (analysis) {
      onLogMeal({
        id: Date.now().toString(),
        timestamp: Date.now(),
        foodName: analysis.name,
        macros: analysis.macros,
        imageUrl: image || undefined
      });
      onComplete();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
        <div className="aspect-square relative bg-slate-100 flex items-center justify-center">
          {image ? (
            <img src={image} className="w-full h-full object-cover" alt="Captured food" />
          ) : (
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <p className="text-slate-900 font-bold">Snap your meal</p>
              <p className="text-slate-500 text-sm mb-6">AI will estimate calories and safety</p>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-emerald-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all"
              >
                Upload Photo
              </button>
            </div>
          )}

          {isAnalyzing && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-center flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
              <p className="text-emerald-600 font-bold">Analyzing with AI...</p>
              <p className="text-slate-400 text-xs">Checking safety & macros</p>
            </div>
          )}
        </div>
      </div>

      <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />

      {analysis && !isAnalyzing && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className={`p-6 rounded-3xl shadow-sm border ${analysis.isSafe ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-black text-slate-900">{analysis.name}</h3>
                <p className={`text-xs font-bold uppercase tracking-wider ${analysis.isSafe ? 'text-emerald-600' : 'text-red-600'}`}>
                  {analysis.isSafe ? '✅ Safe to consume' : '⚠️ Warning detected'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-slate-900">{analysis.macros.calories}</p>
                <p className="text-xs font-medium text-slate-500">Calories</p>
              </div>
            </div>

            {analysis.safetyWarning && (
              <div className="bg-white/60 rounded-2xl p-3 mb-4 text-sm text-slate-700">
                {analysis.safetyWarning}
              </div>
            )}

            <div className="grid grid-cols-4 gap-2 mb-6">
              {[
                { label: 'Prot', value: analysis.macros.protein, unit: 'g' },
                { label: 'Carb', value: analysis.macros.carbs, unit: 'g' },
                { label: 'Fat', value: analysis.macros.fat, unit: 'g' },
                { label: 'Sug', value: analysis.macros.sugar, unit: 'g' },
              ].map(m => (
                <div key={m.label} className="bg-white rounded-xl p-2 text-center shadow-sm">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{m.label}</p>
                  <p className="text-sm font-bold text-slate-800">{Math.round(m.value)}{m.unit}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button 
                onClick={confirmMeal}
                className="flex-1 bg-emerald-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-100"
              >
                Log Meal
              </button>
              <button 
                onClick={() => { setImage(null); setAnalysis(null); }}
                className="bg-slate-200 text-slate-700 px-6 rounded-2xl font-bold"
              >
                Discard
              </button>
            </div>
          </div>

          {analysis.alternatives.length > 0 && (
            <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6">
              <h4 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Healthier Alternatives
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.alternatives.map(alt => (
                  <span key={alt} className="bg-white px-3 py-1.5 rounded-full text-xs font-medium text-blue-600 shadow-sm">
                    {alt}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FoodScanner;
