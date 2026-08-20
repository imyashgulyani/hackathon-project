import React, { useState } from 'react';
import { Search, Plus, Calendar, FileText, AlertTriangle, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

export default function DashboardScreen({ rtis, onNewProblem }) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Static reference date from local metadata: August 20, 2026
  const REFERENCE_DATE = new Date("2026-08-20");

  const calculateDaysElapsed = (filedDateStr) => {
    const filedDate = new Date(filedDateStr);
    const diffTime = REFERENCE_DATE.getTime() - filedDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const filteredRtis = rtis.filter(item => 
    item.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Statistics calculations
  const totalRtis = rtis.length;
  const awaitingRtis = rtis.filter(item => {
    const elapsed = calculateDaysElapsed(item.filedDate);
    return elapsed < 30;
  }).length;
  const overdueRtis = rtis.filter(item => {
    const elapsed = calculateDaysElapsed(item.filedDate);
    return elapsed >= 30;
  }).length;

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 sm:py-12 animate-fade-in space-y-8">
      {/* Header and Action Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
            RTI Redressal Dashboard
          </h1>
          <p className="text-slate-500 text-sm font-light">
            Monitor filed Right to Information applications and track statutory response timelines.
          </p>
        </div>
        
        <button
          onClick={onNewProblem}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white px-5 py-3 rounded-xl font-semibold text-sm transition-all shadow-md shadow-orange-500/20 hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus size={16} />
          File New Grievance
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/25 flex items-center justify-center text-orange-600">
            <FileText size={20} />
          </div>
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider block font-bold">Total Filed RTIs</span>
            <span className="text-2xl font-extrabold text-slate-950 block">{totalRtis}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-650">
            <Clock size={20} />
          </div>
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider block font-bold">Awaiting Response</span>
            <span className="text-2xl font-extrabold text-slate-950 block">{awaitingRtis}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
          <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-600">
            <AlertTriangle size={20} />
          </div>
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider block font-bold">Overdue (File Appeal)</span>
            <span className="text-2xl font-extrabold text-slate-950 block">{overdueRtis}</span>
          </div>
        </div>
      </div>

      {/* Filter and List Container */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-slate-800 font-bold text-lg flex items-center gap-2 self-start">
            Tracked Applications
            <span className="text-xs bg-slate-200/50 border border-slate-300 text-slate-600 px-2 py-0.5 rounded font-mono font-normal">
              {filteredRtis.length} list items
            </span>
          </h2>
          
          {/* Search Box */}
          <div className="w-full sm:w-80 relative">
            <input
              type="text"
              placeholder="Search by ID or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg py-2 pl-9 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/15 focus:border-orange-500 focus:bg-white transition-all font-light"
            />
            <Search size={14} className="text-slate-400 absolute left-3 top-3" />
          </div>
        </div>

        {/* RTI List */}
        {filteredRtis.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 font-light shadow-sm">
            <FileText size={40} className="mx-auto text-slate-350 mb-3" />
            No applications match your search query or none have been saved yet.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRtis.map((item) => {
              const elapsedDays = calculateDaysElapsed(item.filedDate);
              const progressPercentage = Math.min(100, (elapsedDays / 30) * 100);
              const isOverdue = elapsedDays >= 30;
              const remainingDays = Math.max(0, 30 - elapsedDays);

              return (
                <div 
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm hover:border-slate-350 transition-all duration-300 relative group overflow-hidden"
                >
                  {/* Subtle hover background highlight */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/1 to-amber-500/1 opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Header Row */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 relative">
                    <div className="space-y-1">
                      <span className="text-[10px] sm:text-xs font-mono font-bold text-orange-700 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                        {item.id}
                      </span>
                      <h3 className="text-slate-900 font-semibold text-base sm:text-lg block pt-1 leading-snug">
                        {item.department}
                      </h3>
                    </div>
                    
                    {/* Status Badge */}
                    <div>
                      {isOverdue ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-700 text-xs font-bold">
                          <AlertTriangle size={12} />
                          Overdue — File Appeal
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 text-xs font-bold">
                          <Clock size={12} className="animate-spin-slow" />
                          Awaiting Response
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stat Dates row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-500 font-light mb-5 relative border-t border-slate-100 pt-4">
                    <div className="flex flex-col gap-0.5">
                      <span>FILED DATE</span>
                      <span className="font-semibold text-slate-700 flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(item.filedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span>DUE DATE</span>
                      <span className="font-semibold text-slate-700 flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(item.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span>ELAPSED TIME</span>
                      <span className={`font-semibold ${isOverdue ? 'text-rose-600' : 'text-slate-700'}`}>
                        {elapsedDays} / 30 Days
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span>STATUS SUMMARY</span>
                      {isOverdue ? (
                        <span className="font-semibold text-rose-600">
                          Overdue by {elapsedDays - 30} days
                        </span>
                      ) : (
                        <span className="font-semibold text-emerald-600">
                          {remainingDays} days remaining
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar Component */}
                  <div className="space-y-2 relative">
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div 
                        style={{ width: `${progressPercentage}%` }}
                        className={`h-full rounded-full transition-all duration-500 ${
                          isOverdue 
                            ? 'bg-gradient-to-r from-rose-600 to-red-500' 
                            : progressPercentage > 80
                            ? 'bg-gradient-to-r from-amber-600 to-amber-400'
                            : 'bg-gradient-to-r from-orange-500 to-amber-500'
                        }`}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                      <span>Filed (Day 0)</span>
                      <span>Statutory Response Limit (Day 30)</span>
                    </div>
                  </div>

                  {/* Action Link Footer for Overdue Appeal */}
                  {isOverdue && (
                    <div className="mt-4 pt-4 border-t border-slate-150 flex items-center justify-between text-xs font-light">
                      <span className="text-slate-500">No response received within the statutory 30 days limit?</span>
                      <button className="inline-flex items-center gap-1 text-orange-650 hover:text-orange-500 font-bold transition-all">
                        Prepare First Appeal
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
