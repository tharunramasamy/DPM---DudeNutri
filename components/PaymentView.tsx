
import React, { useState } from 'react';

interface PaymentViewProps {
  onComplete: () => void;
  onCancel: () => void;
}

const PaymentView: React.FC<PaymentViewProps> = ({ onComplete, onCancel }) => {
  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <button onClick={onCancel} className="mb-6 flex items-center gap-2 text-slate-400 font-bold hover:text-slate-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>

        <div className="glass-card rounded-[3rem] p-8 space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-black text-slate-900 italic">Checkout</h2>
            <p className="text-slate-500 font-medium">DudeNutri Pro Monthly</p>
          </div>

          <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-12">
                <div className="w-12 h-8 bg-amber-400 rounded-md"></div>
                <svg className="w-10 h-10 text-white/20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg>
              </div>
              <p className="text-xl font-mono tracking-widest mb-6">•••• •••• •••• 4242</p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[8px] uppercase tracking-widest text-white/50">Card Holder</p>
                  <p className="text-xs font-bold uppercase tracking-widest">Active Bro</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] uppercase tracking-widest text-white/50">Expires</p>
                  <p className="text-xs font-bold">04/28</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between px-2 text-sm font-bold">
              <span className="text-slate-400">Monthly Sub</span>
              <span className="text-slate-800">$9.99</span>
            </div>
            <div className="flex justify-between px-2 text-sm font-bold">
              <span className="text-slate-400">Gains Tax (0%)</span>
              <span className="text-slate-800">$0.00</span>
            </div>
            <div className="h-px bg-slate-100"></div>
            <div className="flex justify-between px-2 text-xl font-black">
              <span className="text-slate-900">Total</span>
              <span className="text-emerald-600">$9.99</span>
            </div>
          </div>

          <button 
            onClick={handlePay}
            disabled={processing}
            className="w-full dude-gradient text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-emerald-200 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            {processing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Verifying Gains...
              </>
            ) : (
              'Confirm Subscription'
            )}
          </button>
        </div>

        <p className="mt-8 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
          Secure Encrypted Transaction 🛡️
        </p>
      </div>
    </div>
  );
};

export default PaymentView;
