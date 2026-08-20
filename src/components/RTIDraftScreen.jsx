import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, FileText, Download, Printer, ShieldAlert, Sparkles, Check, ShieldCheck, Loader2 } from 'lucide-react';
import { draftRTI } from '../api/api';

const DEFAULT_QUESTIONS = {
  'ration card': [
    "Provide the current processing status and file movement logs of my Ration Card application.",
    "Provide the name and designation of the officials responsible for processing my application since submission.",
    "Provide copies of any field verification or inspection report conducted at my residence for card approval."
  ],
  'pension': [
    "Provide the reason for the delay in monthly pension disbursement since my verification approval.",
    "Provide the dates on which the pension funds for my account were sanctioned and released by the department.",
    "Provide the total number of pending pension applications in my ward/district and the average processing time."
  ],
  'passport delay': [
    "Provide the date on which my passport police verification report was received by the Regional Passport Office.",
    "Provide the official reason for the delay in passport printing or dispatch after successful verification.",
    "Provide the standard operating timeline of the MEA/RPO for passport dispatch after police clearance."
  ],
  'land records': [
    "Provide the current status of my land mutation registry application submitted on the specified date.",
    "Provide copies of the Patwari / Revenue Inspector field verification report concerning my mutation entry.",
    "Provide the official reasons for not updating my property registry records within the standard citizen timeline."
  ],
  'police complaint': [
    "Provide the daily progress reports and investigation logs of the complaint reference listed above.",
    "Provide the name and designation of the Investigating Officer (IO) assigned to my case.",
    "Provide copies of the statement reports or notices sent to the accused/witnesses in this matter."
  ],
  'municipal/civic issue': [
    "Provide details of the budget allocated and funds spent on municipal road/drainage repairs in my ward during the current fiscal year.",
    "Provide the name of the contractor assigned to local ward maintenance and copies of the work completion reports.",
    "Provide the schedule and frequency logs of sanitation/garbage collection vehicles assigned to my lane."
  ],
  'other': [
    "Provide the current status and file movement tracking history of my representation/complaint.",
    "Provide the names and designations of the public officers responsible for resolving my petition.",
    "Provide the official timeline and standard operating procedure for handling this type of public grievance."
  ]
};

export default function RTIDraftScreen({ category, onBack, onSave }) {
  const [formState, setFormState] = useState({
    applicantName: '',
    applicantAddress: '',
    applicantContact: '',
    applicantPlace: 'New Delhi',
    department: '',
  });
  
  const [infoRequested, setInfoRequested] = useState([]);
  const [draftText, setDraftText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [screenState, setScreenState] = useState('form'); // 'form' | 'preview'
  const [errors, setErrors] = useState({});

  const handleSaveAndTrack = async () => {
    setIsSaving(true);
    try {
      await onSave({
        department: formState.department,
        draftText: draftText
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-populate default department and questions based on category
  useEffect(() => {
    let deptName = '';
    switch (category) {
      case 'ration card':
        deptName = 'Food & Civil Supplies Department';
        break;
      case 'pension':
        deptName = 'Social Welfare Department';
        break;
      case 'passport delay':
        deptName = 'Regional Passport Office (RPO) / Ministry of External Affairs';
        break;
      case 'land records':
        deptName = 'Revenue Department / Office of the Tehsildar';
        break;
      case 'police complaint':
        deptName = 'Office of the Superintendent of Police (SP)';
        break;
      case 'municipal/civic issue':
        deptName = 'Municipal Corporation / Ward Commissioner Office';
        break;
      default:
        deptName = 'Public Authority / Department concerned';
    }

    setFormState(prev => ({ ...prev, department: deptName }));
    const defaultQuests = DEFAULT_QUESTIONS[category] || DEFAULT_QUESTIONS['other'];
    setInfoRequested([...defaultQuests]);
  }, [category]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleQuestionChange = (index, value) => {
    const updated = [...infoRequested];
    updated[index] = value;
    setInfoRequested(updated);
  };

  const addQuestionField = () => {
    setInfoRequested(prev => [...prev, '']);
  };

  const removeQuestionField = (index) => {
    if (infoRequested.length <= 1) return;
    setInfoRequested(prev => prev.filter((_, idx) => idx !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formState.applicantName.trim()) newErrors.applicantName = 'Applicant name is required.';
    if (!formState.applicantAddress.trim()) newErrors.applicantAddress = 'Complete postal address is required.';
    if (!formState.applicantContact.trim()) newErrors.applicantContact = 'Contact details are required.';
    if (!formState.department.trim()) newErrors.department = 'Department name is required.';
    
    const filledQuestions = infoRequested.filter(q => q.trim() !== '');
    if (filledQuestions.length === 0) {
      newErrors.questions = 'At least one information request point is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsGenerating(true);
    try {
      const payload = {
        ...formState,
        infoRequested: infoRequested.filter(q => q.trim() !== '')
      };
      const response = await draftRTI(payload);
      setDraftText(response.draftText);
      setScreenState('preview');
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([draftText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    const fileName = `RTI_Application_${formState.applicantName.trim().replace(/\s+/g, '_')}.txt`;
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const printDraft = () => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);
    
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <html>
        <head>
          <title>RTI Application - Samadhan</title>
          <style>
            body {
              font-family: 'Courier New', Courier, monospace;
              white-space: pre-wrap;
              padding: 40px;
              font-size: 13px;
              line-height: 1.5;
              color: #000;
              background-color: #fff;
            }
            .header-label {
              font-family: Arial, sans-serif;
              font-size: 9px;
              color: #666;
              border-bottom: 1px solid #ddd;
              padding-bottom: 8px;
              margin-bottom: 20px;
              text-align: right;
            }
          </style>
        </head>
        <body>
          <div class="header-label">Generated via Samadhan Civic Portal</div>
          <div>${draftText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
        </body>
      </html>
    `);
    doc.close();
    
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 animate-fade-in">
      {/* Navigation Link */}
      <button
        onClick={screenState === 'preview' ? () => setScreenState('form') : onBack}
        className="inline-flex items-center gap-2 text-slate-650 hover:text-slate-900 mb-6 text-sm font-semibold transition-all group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        {screenState === 'preview' ? 'Back to Editor Form' : 'Back to Analysis'}
      </button>

      {/* Screen Title */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-orange-700 font-bold flex items-center gap-1">
            <Sparkles size={11} className="animate-pulse" />
            RTI Draft Engine
          </span>
          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-650 border border-slate-200 font-bold">
            Category: {category || 'General'}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
          {screenState === 'preview' ? 'Review & Export RTI' : 'RTI Application Builder'}
        </h1>
        <p className="text-slate-550 text-sm sm:text-base font-light">
          {screenState === 'preview' 
            ? 'Review the generated public record draft. You can edit the text directly before exporting.' 
            : 'Fill in your details. We have pre-drafted standard information requests based on the selected category.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left/Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {screenState === 'form' ? (
            /* STATE 1: INPUT FORM */
            <form onSubmit={handleGenerate} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-slate-900 font-bold text-lg border-b border-slate-100 pb-3 flex items-center gap-2">
                <FileText size={18} className="text-orange-600" />
                Applicant & Department Details
              </h2>
              
              {/* Form Input Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-slate-700 text-xs sm:text-sm font-semibold mb-2">
                    Applicant Name <span className="text-orange-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="applicantName"
                    value={formState.applicantName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full bg-slate-50/50 border border-slate-300 rounded-lg p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:bg-white transition-all text-sm font-light"
                  />
                  {errors.applicantName && <p className="text-rose-600 text-[11px] mt-1">{errors.applicantName}</p>}
                </div>
                
                <div>
                  <label className="block text-slate-700 text-xs sm:text-sm font-semibold mb-2">
                    Contact Details <span className="text-orange-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="applicantContact"
                    value={formState.applicantContact}
                    onChange={handleInputChange}
                    placeholder="Phone or Email ID"
                    className="w-full bg-slate-50/50 border border-slate-300 rounded-lg p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:bg-white transition-all text-sm font-light"
                  />
                  {errors.applicantContact && <p className="text-rose-600 text-[11px] mt-1">{errors.applicantContact}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 text-xs sm:text-sm font-semibold mb-2">
                    Complete Postal Address <span className="text-orange-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="applicantAddress"
                    value={formState.applicantAddress}
                    onChange={handleInputChange}
                    placeholder="House No, Street, Locality, District, Pin Code"
                    className="w-full bg-slate-50/50 border border-slate-300 rounded-lg p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:bg-white transition-all text-sm font-light"
                  />
                  {errors.applicantAddress && <p className="text-rose-600 text-[11px] mt-1">{errors.applicantAddress}</p>}
                </div>

                <div>
                  <label className="block text-slate-700 text-xs sm:text-sm font-semibold mb-2">
                    Target Government Department <span className="text-orange-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formState.department}
                    onChange={handleInputChange}
                    placeholder="e.g. Municipal Corporation Office"
                    className="w-full bg-slate-50/50 border border-slate-300 rounded-lg p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:bg-white transition-all text-sm font-light"
                  />
                  {errors.department && <p className="text-rose-600 text-[11px] mt-1">{errors.department}</p>}
                </div>

                <div>
                  <label className="block text-slate-700 text-xs sm:text-sm font-semibold mb-2">
                    Application Place
                  </label>
                  <input
                    type="text"
                    name="applicantPlace"
                    value={formState.applicantPlace}
                    onChange={handleInputChange}
                    placeholder="e.g. New Delhi"
                    className="w-full bg-slate-50/50 border border-slate-300 rounded-lg p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:bg-white transition-all text-sm font-light"
                  />
                </div>
              </div>

              {/* Dynamic Information Sought Fields */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <label className="text-slate-800 font-bold text-base flex items-center gap-2">
                    Information Sought Queries
                  </label>
                  <button
                    type="button"
                    onClick={addQuestionField}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-700 hover:bg-orange-500/20 text-xs font-semibold transition-all duration-300"
                  >
                    <Plus size={14} />
                    Add Query Point
                  </button>
                </div>
                
                <p className="text-slate-550 text-xs font-light">
                  Formulate specific inquiries. Clear, detailed points are far less likely to be rejected by the PIO.
                </p>

                {errors.questions && <p className="text-rose-650 text-xs">{errors.questions}</p>}

                <div className="space-y-3">
                  {infoRequested.map((quest, idx) => (
                    <div key={idx} className="flex gap-2.5 items-start">
                      <div className="w-8 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-650 text-xs font-bold font-mono border border-slate-200 flex-shrink-0 mt-0.5 shadow-inner">
                        {idx + 1}
                      </div>
                      <textarea
                        value={quest}
                        onChange={(e) => handleQuestionChange(idx, e.target.value)}
                        placeholder={`Query item ${idx + 1}...`}
                        rows={2}
                        className="w-full bg-slate-550/5 border border-slate-300 rounded-lg p-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 focus:bg-white transition-all text-sm font-light leading-relaxed"
                      />
                      <button
                        type="button"
                        onClick={() => removeQuestionField(idx)}
                        disabled={infoRequested.length <= 1}
                        className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-500/5 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all flex-shrink-0 mt-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Action */}
              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-md shadow-orange-500/25 transition-all duration-350 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none text-sm group"
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Drafting Application...
                    </>
                  ) : (
                    <>
                      Generate RTI Draft
                      <Check size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* STATE 2: DRAFT EDIT PREVIEW */
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h2 className="text-slate-800 font-bold text-lg flex items-center gap-2">
                  <FileText size={18} className="text-orange-600 animate-pulse" />
                  Editable Document Draft
                </h2>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Live Editor</span>
                </div>
              </div>

              <textarea
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                className="w-full min-h-[480px] bg-slate-50 border border-slate-300 rounded-xl p-5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500 focus:bg-white transition-all font-mono text-xs sm:text-sm leading-relaxed resize-y"
              />

              {/* Export Utilities Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={downloadTxt}
                  disabled={isSaving}
                  className="bg-slate-100 border border-slate-300 hover:bg-slate-200 text-slate-700 hover:text-slate-900 px-5 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-sm disabled:opacity-40"
                >
                  <Download size={16} />
                  Download (.txt)
                </button>
                
                <button
                  type="button"
                  onClick={printDraft}
                  disabled={isSaving}
                  className="bg-slate-100 border border-slate-300 hover:bg-slate-200 text-slate-700 hover:text-slate-900 px-5 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-sm disabled:opacity-40"
                >
                  <Printer size={16} />
                  Print / Save PDF
                </button>
                
                <button
                  type="button"
                  onClick={handleSaveAndTrack}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-5 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] text-sm disabled:opacity-40"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={16} />
                      Save & Track Application
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Info & Disclaimer */}
        <div className="space-y-6">
          {/* Legal Disclaimer Box */}
          <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-5 relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl" />
            
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 flex-shrink-0">
                <ShieldAlert size={16} />
              </div>
              <h3 className="text-amber-900 font-bold text-sm">Legal Disclaimer</h3>
            </div>
            
            <p className="text-amber-800 text-xs font-light leading-relaxed">
              This application is an informational utility designed to assist citizens. It does <strong className="text-amber-900 font-medium">not constitute formal legal advice</strong>. Filing procedures and fees may vary depending on local department jurisdictions and specific state regulations.
            </p>
          </div>

          {/* Guidelines Sidebar */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
            <h3 className="text-slate-800 font-bold text-sm">Quick RTI Tips</h3>
            
            <ul className="space-y-3 text-slate-600 text-xs font-light list-disc pl-4 leading-relaxed">
              <li>
                <strong className="text-slate-700 font-medium">Be Specific:</strong> Inquire about documents, timelines, or records instead of asking general questions (e.g. ask "provide logs of Patwari reports" rather than "why is it late?").
              </li>
              <li>
                <strong className="text-slate-700 font-medium">Local Fee Rules:</strong> Ensure you attach a ₹10 Postal Order or equivalent fee matching local department protocols.
              </li>
              <li>
                <strong className="text-slate-700 font-medium">Citizen Right:</strong> RTI applications are solely eligible for citizens of India under Section 6(1) of the Act.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
