import React, { useState } from 'react';
import { Sparkles, ArrowRight, AlertCircle } from 'lucide-react';

const CATEGORIES = [
  { id: 'ration card', label: 'Ration Card', icon: '🌾' },
  { id: 'pension', label: 'Pension', icon: '👴' },
  { id: 'passport delay', label: 'Passport Delay', icon: '✈️' },
  { id: 'land records', label: 'Land Records', icon: '🗺️' },
  { id: 'police complaint', label: 'Police Complaint', icon: '👮' },
  { id: 'municipal/civic issue', label: 'Municipal/Civic Issue', icon: '🏘️' },
  { id: 'other', label: 'Other', icon: '❓' }
];

export default function LandingScreen({ onSubmit, isLoading }) {
  const [problem, setProblem] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!problem.trim()) {
      setError('Please describe your problem before submitting.');
      return;
    }
    if (problem.trim().length < 10) {
      setError('Please provide a bit more detail about the problem (at least 10 characters).');
      return;
    }
    setError('');
    onSubmit(problem, category);
  };

  const handleChipClick = (catId) => {
    setCategory(prev => prev === catId ? '' : catId);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12 md:py-16 max-w-4xl mx-auto w-full">
      {/* Brand Hero Section */}
      <div className="text-center mb-8 md:mb-12 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-700 text-xs sm:text-sm mb-4 font-semibold">
          <Sparkles size={14} className="text-orange-600 animate-pulse" />
          Department of Administrative Reforms & Public Grievances
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-4 leading-tight sm:leading-none">
          Citizen Redressal Engine
        </h1>
        <p className="text-slate-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
          Describe any administrative delay or public utility issue, and receive structured legal redressal paths, suggestions, and instant RTI drafts.
        </p>
      </div>

      {/* Main Form Box */}
      <form 
        onSubmit={handleSubmit}
        className="w-full bg-white border border-slate-200 rounded-2xl p-5 sm:p-8 shadow-md relative overflow-hidden group hover:shadow-lg transition-all duration-300"
      >
        {/* Glow decorative overlays */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-all duration-500" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all duration-500" />

        {/* Text Area Input */}
        <div className="mb-6 relative">
          <label htmlFor="problem" className="block text-slate-700 text-sm font-semibold mb-2">
            What is the grievance or delay you are facing? <span className="text-orange-600">*</span>
          </label>
          <textarea
            id="problem"
            value={problem}
            onChange={(e) => {
              setProblem(e.target.value);
              if (error) setError('');
            }}
            placeholder="E.g., I applied for my old age pension plan 4 months ago at the municipal ward office, but I haven't received any confirmation or disbursement logs..."
            className="w-full min-h-[140px] sm:min-h-[180px] bg-slate-50/50 border border-slate-350 rounded-xl p-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all duration-300 text-sm sm:text-base resize-y font-light leading-relaxed"
            disabled={isLoading}
          />
          {error && (
            <div className="flex items-center gap-2 mt-2 text-rose-600 text-xs sm:text-sm animate-shake">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Category Selection */}
        <div className="mb-8">
          <label className="block text-slate-700 text-sm font-semibold mb-3">
            Select a category to help target the appropriate department:
          </label>
          <div className="flex flex-wrap gap-2.5">
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleChipClick(cat.id)}
                  className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg border text-xs sm:text-sm font-medium transition-all duration-300 active:scale-95 ${
                    isSelected
                      ? 'bg-orange-600 border-orange-500 text-white shadow-md shadow-orange-500/20'
                      : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800'
                  }`}
                  disabled={isLoading}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white px-6 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 text-sm sm:text-base group/btn"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing Grievance...
              </>
            ) : (
              <>
                Analyze Grievance
                <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Info Card footer */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full text-center sm:text-left text-slate-500 text-xs font-light px-2 border-t border-slate-200/60 pt-6">
        <div className="flex flex-col gap-1 items-center sm:items-start">
          <span className="font-semibold text-slate-700">1. Describe Grievance</span>
          <span>Detail the delays, dates, and locations of service failure.</span>
        </div>
        <div className="flex flex-col gap-1 items-center sm:items-start">
          <span className="font-semibold text-slate-700">2. Review Legal Advice</span>
          <span>Check statutory timelines, suggestions, and officer directives.</span>
        </div>
        <div className="flex flex-col gap-1 items-center sm:items-start">
          <span className="font-semibold text-slate-700">3. Save & Track RTIs</span>
          <span>Compile formal applications and monitor responses on the tracker.</span>
        </div>
      </div>
    </div>
  );
}
