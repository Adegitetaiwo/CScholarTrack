
import React, { useState } from 'react';
import { 
  Plus, 
  Files, 
  Upload, 
  ExternalLink, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  X,
  FileText
} from 'lucide-react';
import { Document, DocStatus, UserSettings } from '../types';

interface DocumentLibraryProps {
  documents: Document[];
  onAdd: (name: string) => void;
  onUpdate: (doc: Document) => void;
  onDelete: (id: string) => void;
  settings: UserSettings;
}

const DocumentLibrary: React.FC<DocumentLibraryProps> = ({ 
  documents, 
  onAdd, 
  onUpdate, 
  onDelete, 
  settings 
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newDocName, setNewDocName] = useState('');

  const handleAdd = () => {
    if (!newDocName.trim()) return;
    onAdd(newDocName.trim());
    setNewDocName('');
    setIsAdding(false);
  };

  const handleFileUpload = async (doc: Document, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (settings.useLocalStorage) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        onUpdate({ ...doc, fileUrl: base64, status: DocStatus.UPLOADED });
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
        onUpdate({ ...doc, fileUrl: data.secure_url, status: DocStatus.UPLOADED });
      } catch (err) {
        console.error("Upload failed", err);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Document Library</h1>
          <p className="text-gray-500 mt-2">Manage global documents like Passports and Transcripts used across all applications.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 whitespace-nowrap"
        >
          <Plus className="w-5 h-5" /> Add New Asset
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-3xl border-2 border-blue-100 shadow-sm animate-in slide-in-from-top-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">New Reusable Document</h3>
            <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex gap-3">
            <input 
              type="text"
              autoFocus
              placeholder="e.g. IELTS Results, Recommendation Letter..."
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              value={newDocName}
              onChange={(e) => setNewDocName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
            <button 
              onClick={handleAdd}
              className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
            >
              Create
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <div key={doc.id} className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                doc.status === DocStatus.UPLOADED ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
              }`}>
                {doc.status === DocStatus.UPLOADED ? <CheckCircle2 className="w-6 h-6" /> : <Files className="w-6 h-6" />}
              </div>
              <button 
                onClick={() => onDelete(doc.id)}
                className="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                title="Remove from library"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <h3 className="font-bold text-gray-900 text-lg">{doc.name}</h3>
            
            <div className="flex items-center gap-2 mt-2">
              <span className={`w-2 h-2 rounded-full ${
                doc.status === DocStatus.UPLOADED ? 'bg-emerald-500' : 
                doc.status === DocStatus.OBTAINED ? 'bg-blue-500' : 'bg-amber-500'
              }`}></span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{doc.status}</span>
            </div>

            <div className="mt-8 flex gap-2">
              {doc.fileUrl ? (
                <a 
                  href={doc.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View
                </a>
              ) : null}
              <label className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5" /> {doc.fileUrl ? 'Update' : 'Upload File'}
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={(e) => handleFileUpload(doc, e)}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </label>
            </div>
          </div>
        ))}

        {documents.length === 0 && !isAdding && (
          <div className="col-span-full py-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[40px] flex flex-col items-center justify-center text-center px-6">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
              <FileText className="w-8 h-8 text-gray-300" />
            </div>
            <h4 className="text-gray-900 font-bold text-lg">No Global Assets</h4>
            <p className="text-gray-500 text-sm max-w-xs mt-1">Add documents that you'll need for multiple scholarship applications here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentLibrary;
