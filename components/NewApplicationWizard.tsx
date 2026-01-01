
import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Plus, 
  Trash2, 
  Calendar as CalendarIcon,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Files
} from 'lucide-react';
import { ScholarshipApplication, ApplicationStatus, FundingType, Document, DocStatus } from '../types';
import { suggestDocumentsForScholarship } from '../services/geminiService';

interface WizardProps {
  onComplete: (app: ScholarshipApplication) => void;
  reusableDocs: Document[];
}

const NewApplicationWizard: React.FC<WizardProps> = ({ onComplete, reusableDocs }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<ScholarshipApplication>>({
    title: '',
    university: '',
    degreeLevel: 'Masters',
    fundingType: FundingType.FULL,
    deadline: '',
    documents: [],
    status: ApplicationStatus.PLANNING,
    websiteUrl: '',
    notes: '',
  });

  const [docInput, setDocInput] = useState({ name: '', isReusable: false });

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const fetchAISuggestions = async () => {
    if (!formData.title || !formData.university) return;
    setLoading(true);
    const suggestions = await suggestDocumentsForScholarship(
      formData.title,
      formData.university,
      formData.degreeLevel || 'Masters'
    );
    
    const suggestedDocs: Document[] = suggestions.map((s: any, idx: number) => ({
      id: `suggested-${idx}-${Date.now()}`,
      name: s.name,
      description: s.description,
      isReusable: s.isReusable,
      status: DocStatus.PENDING,
    }));

    setFormData(prev => ({
      ...prev,
      documents: [...(prev.documents || []), ...suggestedDocs]
    }));
    setLoading(false);
  };

  const addDocument = () => {
    if (!docInput.name) return;
    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      name: docInput.name,
      isReusable: docInput.isReusable,
      status: DocStatus.PENDING,
    };
    setFormData(prev => ({
      ...prev,
      documents: [...(prev.documents || []), newDoc]
    }));
    setDocInput({ name: '', isReusable: false });
  };

  const removeDoc = (id: string) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents?.filter(d => d.id !== id)
    }));
  };

  const handleSubmit = () => {
    const finalApp: ScholarshipApplication = {
      ...formData,
      id: `app-${Date.now()}`,
      createdAt: new Date().toISOString(),
    } as ScholarshipApplication;
    onComplete(finalApp);
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* Step Progress */}
      <div className="mb-12">
        <div className="flex items-center justify-between px-2 mb-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                step >= s ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-gray-100 text-gray-400'
              }`}>
                {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
              </div>
              <span className={`text-xs mt-2 font-medium ${step >= s ? 'text-blue-600' : 'text-gray-400'}`}>
                {s === 1 ? 'Basic Info' : s === 2 ? 'Required Documents' : 'Deadlines & Finalize'}
              </span>
            </div>
          ))}
        </div>
        <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-500 ease-out" 
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-100 border border-gray-100">
        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
              <p className="text-gray-500">Tell us about the scholarship you're targeting.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Scholarship Name</label>
                <input 
                  type="text"
                  placeholder="e.g. Fulbright Foreign Student Program"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">University/Organization</label>
                <input 
                  type="text"
                  placeholder="e.g. Stanford University"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  value={formData.university}
                  onChange={e => setFormData({...formData, university: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Degree Level</label>
                <select 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  value={formData.degreeLevel}
                  onChange={e => setFormData({...formData, degreeLevel: e.target.value as any})}
                >
                  <option value="Masters">Masters</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Funding Type</label>
                <select 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  value={formData.fundingType}
                  onChange={e => setFormData({...formData, fundingType: e.target.value as any})}
                >
                  <option value={FundingType.FULL}>{FundingType.FULL}</option>
                  <option value={FundingType.PARTIAL}>{FundingType.PARTIAL}</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Official Website URL (Optional)</label>
              <input 
                type="url"
                placeholder="https://..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                value={formData.websiteUrl}
                onChange={e => setFormData({...formData, websiteUrl: e.target.value})}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Document Checklist</h2>
                <p className="text-gray-500">List all required documents. Use AI to get suggestions.</p>
              </div>
              <button 
                onClick={fetchAISuggestions}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-blue-200 disabled:opacity-50 transition-all"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {loading ? 'Analyzing...' : 'Auto-Suggest'}
              </button>
            </div>

            <div className="bg-blue-50 p-4 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <p className="text-sm text-blue-700 leading-relaxed">
                Documents marked as <strong>Reusable</strong> can be linked from your Document Library to save time across multiple applications.
              </p>
            </div>

            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Document name (e.g. Transcript)"
                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={docInput.name}
                onChange={e => setDocInput({...docInput, name: e.target.value})}
                onKeyPress={e => e.key === 'Enter' && addDocument()}
              />
              <label className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer">
                <input 
                  type="checkbox"
                  checked={docInput.isReusable}
                  onChange={e => setDocInput({...docInput, isReusable: e.target.checked})}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs font-medium text-gray-600 whitespace-nowrap">Reusable?</span>
              </label>
              <button 
                onClick={addDocument}
                className="p-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {formData.documents?.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl group transition-all hover:border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${doc.isReusable ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-500'}`}>
                      <Files className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{doc.name}</p>
                      {doc.isReusable && <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider">Reusable Across Apps</span>}
                    </div>
                  </div>
                  <button 
                    onClick={() => removeDoc(doc.id)}
                    className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {formData.documents?.length === 0 && (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-400 text-sm">No documents added yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Dates & Finalize</h2>
              <p className="text-gray-500">Set your application closing date and notes.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Application Deadline</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input 
                    type="date"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                    value={formData.deadline}
                    onChange={e => setFormData({...formData, deadline: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Notes / Reminders</label>
                <textarea 
                  placeholder="Any specific instructions or notes for yourself..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all h-32 resize-none"
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                />
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h4 className="text-sm font-bold text-gray-900 mb-4">Summary</h4>
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <span className="text-gray-500">Title:</span>
                <span className="font-semibold text-gray-900 text-right">{formData.title}</span>
                <span className="text-gray-500">University:</span>
                <span className="font-semibold text-gray-900 text-right">{formData.university}</span>
                <span className="text-gray-500">Level:</span>
                <span className="font-semibold text-gray-900 text-right">{formData.degreeLevel}</span>
                <span className="text-gray-500">Documents:</span>
                <span className="font-semibold text-gray-900 text-right">{formData.documents?.length || 0} items</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-100">
          {step > 1 ? (
            <button 
              onClick={handleBack}
              className="flex items-center gap-2 px-6 py-3 text-gray-600 font-semibold hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" /> Back
            </button>
          ) : <div />}

          {step < 3 ? (
            <button 
              onClick={handleNext}
              className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all"
            >
              Next <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all"
            >
              Create Application
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewApplicationWizard;
