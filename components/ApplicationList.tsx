
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  GraduationCap, 
  Calendar, 
  ExternalLink,
  ArrowUpRight,
  Trophy,
  Tag
} from 'lucide-react';
import { ScholarshipApplication, FundingType, ApplicationStatus } from '../types';

interface ListProps {
  applications: ScholarshipApplication[];
  onStatusChange: (id: string, status: ApplicationStatus) => void;
}

const ApplicationList: React.FC<ListProps> = ({ applications, onStatusChange }) => {
  const navigate = useNavigate();

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-gray-300">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <Trophy className="w-10 h-10 text-gray-300" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Your Journey Starts Here</h3>
        <p className="text-gray-500 mb-8 max-w-sm text-center">Start tracking your first graduate scholarship application to unlock your future.</p>
        <button 
          onClick={() => navigate('/new')}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          Get Started
        </button>
      </div>
    );
  }

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.PLANNING: return 'bg-gray-100 text-gray-600';
      case ApplicationStatus.IN_PROGRESS: return 'bg-blue-50 text-blue-600';
      case ApplicationStatus.SUBMITTED: return 'bg-amber-50 text-amber-600';
      case ApplicationStatus.INTERVIEW: return 'bg-purple-50 text-purple-600';
      case ApplicationStatus.ACCEPTED: return 'bg-emerald-50 text-emerald-600';
      case ApplicationStatus.REJECTED: return 'bg-rose-50 text-rose-600';
      default: return 'bg-gray-50 text-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {applications.map((app) => {
        const progress = Math.round((app.documents.filter(d => d.status !== 'Pending').length / (app.documents.length || 1)) * 100);
        
        return (
          <div key={app.id} className="group bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                app.fundingType === FundingType.FULL ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
              }`}>
                {app.fundingType}
              </div>
              <div className="relative">
                <select 
                  className={`appearance-none px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer outline-none border-none pr-6 ${getStatusColor(app.status)}`}
                  value={app.status}
                  onChange={(e) => onStatusChange(app.id, e.target.value as ApplicationStatus)}
                >
                  {Object.values(ApplicationStatus).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <Tag className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-40" />
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{app.title}</h3>
              <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                <Building2 className="w-4 h-4" />
                <span>{app.university}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded-2xl">
                <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Level</p>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-bold text-gray-700">{app.degreeLevel}</span>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-2xl">
                <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Deadline</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-rose-500" />
                  <span className="text-sm font-bold text-gray-700">
                    {new Date(app.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-gray-500">Document Completion</span>
                <span className="font-bold text-blue-600">{progress}%</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button 
                onClick={() => navigate(`/applications/${app.id}`)}
                className="flex-1 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                Manage Docs <ArrowUpRight className="w-4 h-4" />
              </button>
              {app.websiteUrl && (
                <a 
                  href={app.websiteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-50 text-gray-400 hover:text-blue-600 rounded-xl transition-all"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ApplicationList;
