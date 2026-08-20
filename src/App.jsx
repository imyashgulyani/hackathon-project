import React, { useState, useEffect } from 'react';
import LandingScreen from './components/LandingScreen';
import ResultsScreen from './components/ResultsScreen';
import RTIDraftScreen from './components/RTIDraftScreen';
import DashboardScreen from './components/DashboardScreen';
import { analyzeProblem, listRTIs, saveRTI } from './api/api';
import { Shield, LayoutDashboard, Layers, Menu, X, AlertTriangle, RefreshCw, FileText, Loader2 } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('landing'); // 'landing' | 'results' | 'rti-draft' | 'dashboard'
  const [problemText, setProblemText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [rtisList, setRtisList] = useState([]);

  // Load seeded RTIs on mount
  useEffect(() => {
    const loadRTIs = async () => {
      try {
        const data = await listRTIs();
        setRtisList(data);
      } catch (err) {
        console.error("Error loading RTIs:", err);
      }
    };
    loadRTIs();
  }, []);

  const handleProblemSubmit = async (problem, category) => {
    setIsLoading(true);
    setError(null);
    setProblemText(problem);
    setSelectedCategory(category);
    try {
      const response = await analyzeProblem(problem, category);
      setAnalysisResult(response);
      setCurrentScreen('results');
    } catch (err) {
      console.error('Error analyzing problem:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRTI = async (payload) => {
    const response = await saveRTI(payload);
    const newItem = {
      id: response.id,
      department: payload.department,
      filedDate: response.filedDate,
      dueDate: response.dueDate,
      status: "Awaiting response"
    };
    setRtisList(prev => [newItem, ...prev]);
    setCurrentScreen('dashboard');
  };

  const handleRetry = () => {
    handleProblemSubmit(problemText, selectedCategory);
  };

  const handleBack = () => {
    setCurrentScreen('landing');
    setAnalysisResult(null);
    setError(null);
  };

  const handleGoToRTIDraft = () => {
    setCurrentScreen('rti-draft');
  };

  const handleGoToDashboard = () => {
    setCurrentScreen('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-orange-500/20 selection:text-orange-950">
      {/* Header/Navigation */}
      <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleBack}>
            {/* National Tricolor Brand Icon */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 via-white to-emerald-500 p-0.5 shadow-md flex items-center justify-center border border-slate-200">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Shield size={20} className="text-orange-500" />
              </div>
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-slate-900 block leading-none">Samadhan</span>
              <span className="text-[10px] text-slate-500 tracking-wider uppercase font-semibold">Civic Redressal Portal</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={handleBack}
              className={`text-sm font-semibold px-3 py-2 rounded-lg transition-colors ${currentScreen === 'landing' ? 'text-orange-600 bg-orange-550/5' : 'text-slate-600 hover:text-slate-950'}`}
            >
              Intake Desk
            </button>
            
            <button 
              onClick={handleGoToDashboard}
              className={`text-sm font-semibold px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentScreen === 'dashboard'
                  ? 'text-orange-600 bg-orange-550/5'
                  : 'text-slate-650 hover:text-slate-950'
              }`}
            >
              <LayoutDashboard size={15} />
              Tracker Dashboard
            </button>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-semibold">
              <Layers size={12} />
              PORTAL STATUS: ONLINE
            </span>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-650 hover:text-slate-900 p-1 rounded-lg focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2.5 shadow-inner">
            <button
              onClick={() => {
                handleBack();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left text-sm font-semibold text-slate-700 py-2.5 block border-b border-slate-100"
            >
              Intake Desk
            </button>
            
            <button
              onClick={() => {
                handleGoToDashboard();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left text-sm font-semibold text-slate-700 py-2.5 block flex justify-between items-center"
            >
              <span>Tracker Dashboard</span>
              <span className="text-[10px] bg-slate-150 text-slate-600 border border-slate-200 px-2 py-0.5 rounded font-mono">Open</span>
            </button>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center bg-slate-50">
        {isLoading ? (
          /* Premium Skeleton Loading Screen */
          <div className="w-full max-w-4xl mx-auto px-4 py-16 text-center space-y-8 animate-pulse">
            <div className="flex flex-col items-center">
              <Loader2 size={40} className="text-orange-500 animate-spin mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 font-sans">Analyzing Your Grievance</h2>
              <p className="text-slate-500 text-sm max-w-md mt-2 font-light">
                Running problem classifier and generating resolution pathways...
              </p>
            </div>

            {/* Skeleton Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="md:col-span-2 space-y-6">
                <div className="h-28 bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-sm">
                  <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                  <div className="h-6 bg-slate-200 rounded w-full"></div>
                  <div className="h-6 bg-slate-200 rounded w-5/6"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 bg-white border border-slate-100 rounded-xl p-5 flex gap-4 shadow-sm">
                      <div className="w-8 h-8 rounded bg-slate-250 flex-shrink-0"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                        <div className="h-3 bg-slate-200 rounded w-full"></div>
                        <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-6 h-64 space-y-4 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                <div className="h-3 bg-slate-200 rounded w-full"></div>
                <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                <div className="h-10 bg-slate-200 rounded w-full mt-4"></div>
              </div>
            </div>
          </div>
        ) : error ? (
          /* Premium Error Screen with Retry Option */
          <div className="w-full max-w-lg mx-auto px-4 py-16 text-center">
            <div className="bg-white border border-red-200 rounded-2xl p-8 shadow-xl relative overflow-hidden group">
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-500/5 rounded-full blur-2xl" />
              
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-500 mx-auto mb-6">
                <AlertTriangle size={32} className="animate-pulse" />
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-3">Analysis Failed</h2>
              <p className="text-slate-650 text-sm font-light leading-relaxed mb-6">
                {error}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleRetry}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white px-5 py-3 rounded-xl font-medium transition-all shadow-lg shadow-orange-600/15"
                >
                  <RefreshCw size={16} />
                  Try Again
                </button>
                <button
                  onClick={handleBack}
                  className="bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 px-5 py-3 rounded-xl font-medium transition-all"
                >
                  Edit Input
                </button>
              </div>
            </div>
          </div>
        ) : currentScreen === 'landing' ? (
          <LandingScreen 
            onSubmit={handleProblemSubmit} 
            isLoading={isLoading} 
          />
        ) : currentScreen === 'results' ? (
          <ResultsScreen 
            result={analysisResult} 
            originalProblem={problemText}
            category={selectedCategory}
            onBack={handleBack}
            onDraftRTI={handleGoToRTIDraft}
          />
        ) : currentScreen === 'rti-draft' ? (
          <RTIDraftScreen 
            category={selectedCategory} 
            onBack={() => setCurrentScreen('results')} 
            onSave={handleSaveRTI}
          />
        ) : (
          <DashboardScreen 
            rtis={rtisList} 
            onNewProblem={handleBack} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-100 py-6 text-center text-xs text-slate-500 font-light mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-slate-700 font-medium">
            <span>Samadhan Portal</span>
            <span className="text-slate-350">|</span>
            <span>Government Grievance Resource</span>
          </div>
          <div>
            Design inspired by Government of India digital services. Built with React and Tailwind CSS.
          </div>
        </div>
      </footer>
    </div>
  );
}
