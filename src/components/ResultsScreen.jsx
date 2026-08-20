import React from 'react';
import { ArrowLeft, ShieldCheck, HelpCircle, FileText } from 'lucide-react';

export default function ResultsScreen({ result, originalProblem, category, onBack, onDraftRTI }) {
  if (!result) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-md mx-auto text-center">
        <HelpCircle size={48} className="text-slate-400 mb-4 animate-bounce" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">No Analysis Available</h2>
        <p className="text-slate-500 text-sm mb-6 font-light">
          It looks like you haven't submitted a problem yet or the analysis was interrupted.
        </p>
        <button
          onClick={onBack}
          className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 animate-fade-in">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 text-sm font-semibold transition-all group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Intake Form
      </button>

      {/* Header Info */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-orange-700 font-bold">
            Analysis Completed
          </span>
          {category && (
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-650 border border-slate-200 font-bold">
              Category: {category}
            </span>
          )}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
          Redressal Recourse Analysis
        </h1>
        <p className="text-slate-500 text-sm sm:text-base font-light">
          Review the parsed analysis of your issue, along with recommended resolution steps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Restatement & Solutions */}
        <div className="md:col-span-2 space-y-6">
          {/* AI Restatement Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm">
            <h2 className="text-orange-650 text-xs font-semibold uppercase tracking-wider mb-2">
              Understanding of the Issue
            </h2>
            <p className="text-slate-800 text-base sm:text-lg font-light leading-relaxed">
              {result.restatement}
            </p>
          </div>

          {/* Solutions List */}
          <div className="space-y-4">
            <h2 className="text-slate-700 text-xs font-semibold uppercase tracking-wider pl-1">
              Recommended Recourse Pathways
            </h2>
            {result.solutions && result.solutions.map((sol, index) => (
              <div 
                key={index}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-orange-500/30 transition-all duration-300 flex items-start gap-4 shadow-sm group"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-600 font-bold text-sm">
                  {index + 1}
                </div>
                <div className="space-y-1">
                  <h3 className="text-slate-900 font-semibold text-base group-hover:text-orange-600 transition-colors">
                    {sol.title}
                  </h3>
                  <p className="text-slate-600 text-sm font-light leading-relaxed">
                    {sol.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Quick Action & Eligibility */}
        <div className="space-y-6">
          {/* RTI Eligibility Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl" />
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-600">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="text-slate-800 font-bold text-sm">RTI Viability</h3>
                <span className="text-[10px] text-slate-500 font-medium">Statutory Clause</span>
              </div>
            </div>

            <div className="mb-4">
              {result.rtiEligible ? (
                <div className="space-y-3">
                  <span className="inline-block px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 text-xs font-bold">
                    ✓ RTI ELIGIBLE
                  </span>
                  <p className="text-slate-650 text-xs sm:text-sm font-light leading-relaxed">
                    This administrative query is suitable for a formal query under Section 6(1) of the RTI Act, 2005.
                  </p>
                  
                  {/* Saffron/Orange highlighted Draft Button */}
                  <button
                    onClick={onDraftRTI}
                    className="w-full mt-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-md shadow-orange-500/25 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] group/btn"
                  >
                    <FileText size={16} className="text-orange-100 group-hover/btn:scale-110 transition-transform" />
                    Draft my RTI Application
                  </button>
                </div>
              ) : (
                <div>
                  <span className="inline-block px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-500 text-xs font-semibold mb-2">
                    ✗ NOT ELIGIBLE
                  </span>
                  <p className="text-slate-550 text-xs sm:text-sm font-light leading-relaxed">
                    This dispute falls outside the parameters of a public registry/government authority.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Original Problem Snippet */}
          <div className="bg-slate-100/50 border border-slate-200 rounded-xl p-5 text-xs">
            <h4 className="text-slate-500 font-semibold uppercase tracking-wider mb-2">
              Your Submitted Text:
            </h4>
            <p className="text-slate-600 font-mono line-clamp-6 italic leading-relaxed">
              "{originalProblem}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
