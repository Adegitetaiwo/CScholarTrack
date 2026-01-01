
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Upload, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Trash2, 
  ExternalLink,
  Save,
  AlertCircle,
  Edit3,
  X,
  Building2,
  Globe,
  Tag,
  Plus
} from 'lucide-react';
import { ScholarshipApplication, Document, DocStatus, ApplicationStatus, UserSettings, FundingType } from '../types';

interface ApplicationDetailsProps {
  application: ScholarshipApplication;
  onBack: () => void;
  onUpdateApplication: (app: ScholarshipApplication) => void;
  settings: UserSettings;
}

const ApplicationDetails: React.FC<ApplicationDetailsProps> = ({ 
  application, 
  onBack, 
  onUpdateApplication,
  settings 
}) => {
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isAddingDoc, setIsAddingDoc] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [editFormData, setEditFormData] = useState<ScholarshipApplication>(application);

  const handleStatusChange = (docId: string, status: DocStatus) => {
    const updatedDocs = application.documents.map(doc => 
      doc.id === docId ? { ...doc, status } : doc
    );
    onUpdateApplication({ ...application, documents: updatedDocs });
  };

  const handleDeadlineChange = (docId: string, deadline: string) => {
    const updatedDocs = application.documents.map(doc => 
      doc.id === docId ? { ...doc, deadline } : doc
    );
    onUpdateApplication({ ...application, documents: updatedDocs });
  };

  const saveInfoEdits = () => {
    onUpdateApplication(editFormData);
    setIsEditingInfo(false);
  };

  const handleFileUpload = async (docId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (settings.useLocalStorage) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const updatedDocs = application.documents.map(doc => 
          doc.id === docId ? { ...doc, fileUrl: base64, status: DocStatus.UPLOADED } : doc
        );
        onUpdateApplication({ ...application, documents: updatedDocs });
      };
      reader.readAsDataURL(file);
    } else if (settings.cloudinaryCloudName && settings.cloudinaryUploadPreset) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', settings.cloudinaryUploadPreset);
      
      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${settings.cloudinaryCloudName}/image/upload`, {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        const updatedDocs = application.documents.map(doc => 
          doc.id === docId ? { ...doc, fileUrl: data.secure_url, status: DocStatus.UPLOADED } : doc
        );
        onUpdateApplication({ ...application, documents: updatedDocs });
      } catch (err) {
        console.error("Upload failed", err);
      }
    }
  };

  const removeDocument = (docId: string) => {
    const updatedDocs = application.documents.filter(d => d.id !== docId);
    onUpdateApplication({ ...application, documents: updatedDocs });
  };

  const addNewDoc = () => {
    if (!newDocName.trim()) return;
    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      name: newDocName.trim(),
      isReusable: false,
      status: DocStatus.PENDING,
      deadline: application.deadline // Default to app deadline
    };
    onUpdateApplication({
      ...application,
      documents: [...application.documents, newDoc]
    });
    setNewDocName('');
    setIsAddingDoc(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-semibold self-start"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Applications
        </button>
        <div className="flex items-center gap-3">
          {!isEditingInfo && (
            <button 
              onClick={() => {
                setEditFormData(application);
                setIsEditingInfo(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
            >
              <Edit3 className="w-4 h-4" /> Edit Program Details
            </button>
          )}
          <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
            application.status === ApplicationStatus.ACCEPTED ? 'bg-emerald-50 text-emerald-600' : 
            application.status === ApplicationStatus.REJECTED ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
          }`}>
            {application.status}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] p-6 md:p-10 border border-gray-100 shadow-sm relative overflow-hidden">
        {/* Subtle background accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/30 rounded-full blur-3xl -mr-32 -mt-32" />

        {isEditingInfo ? (
          <div className="space-y-6 animate-in slide-in-from-top-4 relative z-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-gray-900">Application Settings</h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsEditingInfo(false)}
                  className="px-5 py-2.5 text-gray-400 hover:text-gray-600 font-bold text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={saveInfoEdits}
                  className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95"
                >
                  Save Updates
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Program Title</label>
                <input 
                  type="text"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-900 transition-all"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">University</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text"
                    className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-700 transition-all"
                    value={editFormData.university}
                    onChange={(e) => setEditFormData({...editFormData, university: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Overall Deadline</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="date"
                    className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-900 transition-all"
                    value={editFormData.deadline}
                    onChange={(e) => setEditFormData({...editFormData, deadline: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Official Portal URL</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="url"
                    className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-blue-600 transition-all"
                    value={editFormData.websiteUrl || ''}
                    onChange={(e) => setEditFormData({...editFormData, websiteUrl: e.target.value})}
                    placeholder="https://application-portal.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Funding Scheme</label>
                <select 
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold appearance-none transition-all"
                  value={editFormData.fundingType}
                  onChange={(e) => setEditFormData({...editFormData, fundingType: e.target.value as FundingType})}
                >
                  <option value={FundingType.FULL}>{FundingType.FULL}</option>
                  <option value={FundingType.PARTIAL}>{FundingType.PARTIAL}</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Process Status</label>
                <select 
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold appearance-none transition-all"
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({...editFormData, status: e.target.value as ApplicationStatus})}
                >
                  {Object.values(ApplicationStatus).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative z-10">
            <div className="mb-10">
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 tracking-tight">{application.title}</h1>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-gray-500">
                <p className="flex items-center gap-2.5 font-medium">
                  <Building2 className="w-5 h-5 text-blue-600" /> {application.university}
                </p>
                <span className="text-gray-200 hidden md:inline">•</span>
                <p className="flex items-center gap-2.5 font-medium">
                  <FileText className="w-5 h-5 text-indigo-500" /> {application.degreeLevel}
                </p>
                {application.websiteUrl && (
                  <>
                    <span className="text-gray-200 hidden md:inline">•</span>
                    <a 
                      href={application.websiteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-2.5 text-blue-600 hover:text-blue-800 font-bold transition-colors group"
                    >
                      <Globe className="w-5 h-5" /> 
                      Portal Link
                      <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
              <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Checklist Items</p>
                <p className="text-2xl font-black text-slate-900">{application.documents.length}</p>
              </div>
              <div className="p-5 bg-emerald-50 rounded-3xl border border-emerald-100">
                <p className="text-[10px] font-black text-emerald-600/70 uppercase tracking-widest mb-1">Uploaded</p>
                <p className="text-2xl font-black text-emerald-600">
                  {application.documents.filter(d => d.status === DocStatus.UPLOADED).length}
                </p>
              </div>
              <div className="p-5 bg-rose-50 rounded-3xl border border-rose-100">
                <p className="text-[10px] font-black text-rose-600/70 uppercase tracking-widest mb-1">Main Deadline</p>
                <p className="text-2xl font-black text-rose-600">
                  {new Date(application.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </p>
              </div>
              <div className="p-5 bg-indigo-50 rounded-3xl border border-indigo-100">
                <p className="text-[10px] font-black text-indigo-600/70 uppercase tracking-widest mb-1">Funding</p>
                <p className="text-2xl font-black text-indigo-600">{application.fundingType.split(' ')[0]}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6 mt-10 pt-10 border-t border-gray-100 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
              Document Roadmap
              <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-bold">
                {application.documents.length} Items
              </span>
            </h2>
            <button 
              onClick={() => setIsAddingDoc(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl text-sm font-bold hover:bg-black transition-all shadow-lg active:scale-95"
            >
              <Plus className="w-5 h-5" /> Add New Requirement
            </button>
          </div>

          {isAddingDoc && (
            <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-blue-900 uppercase tracking-wider">Add Custom Requirement</h4>
                <button onClick={() => setIsAddingDoc(false)} className="text-blue-400 hover:text-blue-600"><X className="w-5 h-5"/></button>
              </div>
              <div className="flex gap-3">
                <input 
                  type="text"
                  autoFocus
                  placeholder="e.g. Portfolio, Writing Sample, Portfolio..."
                  className="flex-1 px-5 py-3 rounded-xl border border-blue-200 outline-none focus:ring-2 focus:ring-blue-500"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addNewDoc()}
                />
                <button 
                  onClick={addNewDoc}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {application.documents.map((doc) => (
              <div key={doc.id} className="group flex flex-col lg:flex-row lg:items-center justify-between p-6 bg-slate-50 border border-transparent hover:border-blue-100 hover:bg-white rounded-[24px] transition-all duration-300 gap-6">
                <div className="flex items-start gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm ${
                    doc.status === DocStatus.UPLOADED ? 'bg-emerald-100 text-emerald-600 scale-105' : 
                    doc.status === DocStatus.OBTAINED ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-400'
                  }`}>
                    {doc.status === DocStatus.UPLOADED ? <CheckCircle2 className="w-7 h-7" /> : <FileText className="w-7 h-7" />}
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 text-lg flex flex-wrap items-center gap-2 mb-1">
                      {doc.name}
                      {doc.isReusable && (
                        <span className="text-[10px] bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full uppercase font-black tracking-widest">Global Asset</span>
                      )}
                    </h4>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <div className="relative inline-block">
                        <select 
                          className="appearance-none text-xs bg-transparent border-none p-0 pr-6 font-black text-gray-500 focus:ring-0 cursor-pointer hover:text-blue-600 transition-colors uppercase tracking-widest"
                          value={doc.status}
                          onChange={(e) => handleStatusChange(doc.id, e.target.value as DocStatus)}
                        >
                          {Object.values(DocStatus).map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <Tag className="w-3 h-3 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 text-gray-400" />
                      </div>
                      <span className="text-gray-200 hidden md:inline">|</span>
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span className="text-[10px] uppercase font-black tracking-widest">Internal Target:</span>
                        <input 
                          type="date"
                          className="bg-transparent border-none p-0 text-xs font-black focus:ring-0 cursor-pointer text-gray-700 hover:text-blue-600 transition-colors"
                          value={doc.deadline || ''}
                          onChange={(e) => handleDeadlineChange(doc.id, e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-auto lg:ml-0">
                  {doc.fileUrl && (
                    <a 
                      href={doc.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3.5 bg-white text-blue-600 rounded-2xl border border-blue-50 hover:bg-blue-600 hover:text-white transition-all shadow-sm flex items-center gap-2 text-xs font-black uppercase tracking-widest"
                    >
                      View <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  
                  <label className="p-3.5 bg-white text-slate-500 border border-slate-100 rounded-2xl hover:bg-slate-100 transition-all shadow-sm cursor-pointer flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                    <Upload className="w-4 h-4" />
                    {doc.fileUrl ? 'Replace' : 'Upload'}
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => handleFileUpload(doc.id, e)}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </label>
                  
                  <button 
                    onClick={() => removeDocument(doc.id)}
                    className="p-3.5 bg-white text-gray-400 hover:text-rose-600 hover:bg-rose-50 border border-gray-50 rounded-2xl transition-all shadow-sm"
                    title="Remove requirement"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            
            {application.documents.length === 0 && (
              <div className="text-center py-16 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Plus className="w-8 h-8 text-gray-300" />
                </div>
                <h4 className="text-gray-900 font-bold mb-1">Checklist is Empty</h4>
                <p className="text-gray-400 text-sm italic max-w-xs mx-auto">Start adding specific document requirements for this scholarship above.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-[40px] p-8 border border-amber-100 flex items-start gap-6 shadow-sm">
        <div className="p-4 bg-white rounded-3xl text-amber-600 shadow-sm">
          <Clock className="w-7 h-7" />
        </div>
        <div>
          <h3 className="font-black text-amber-900 text-xl tracking-tight">Timeline Strategy</h3>
          <p className="text-amber-700/80 text-sm mt-2 leading-relaxed font-medium">
            You are aiming for <strong>{new Date(application.deadline).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</strong>. 
            Keep a buffer of 10 days to handle technical glitches or portal heavy traffic. 
            Currently, <strong>{application.documents.filter(d => d.status === DocStatus.PENDING).length}</strong> items are pending your attention.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
