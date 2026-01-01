
import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from 'recharts';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Files,
  FileWarning,
  Share2,
  Copy,
  Check
} from 'lucide-react';
import { ScholarshipApplication } from '../types';

interface DashboardProps {
  applications: ScholarshipApplication[];
}

const Dashboard: React.FC<DashboardProps> = ({ applications }) => {
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  const stats = [
    { label: 'Active Apps', value: applications.length, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Docs Pending', value: applications.reduce((acc, app) => acc + app.documents.filter(d => d.status === 'Pending').length, 0), icon: Files, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Upcoming App Deadlines', value: applications.filter(a => new Date(a.deadline) > new Date()).length, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  const pendingDocDeadlines = applications.flatMap(app => 
    app.documents
      .filter(d => d.status === 'Pending' && d.deadline)
      .map(d => ({ ...d, appTitle: app.title }))
  ).sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime());

  const chartData = applications.map(app => ({
    name: app.title.substring(0, 10) + '...',
    progress: Math.round((app.documents.filter(d => d.status !== 'Pending').length / (app.documents.length || 1)) * 100),
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];

  const handleShare = () => {
    const shareData = {
      title: 'CScholarTrack',
      text: 'Check out CScholarTrack! It helps me manage all my graduate school scholarship applications in one place.',
      url: window.location.origin
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => setShowShare(true));
    } else {
      setShowShare(true);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setShowShare(false);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-gray-900">Dashboard Overview</h2>
        <button 
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-blue-600 hover:bg-blue-50 transition-all shadow-sm"
        >
          <Share2 className="w-4 h-4" /> Share App
        </button>
      </div>

      {showShare && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl relative">
            <button 
              onClick={() => setShowShare(false)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
            >
              <AlertCircle className="w-5 h-5 rotate-45" />
            </button>
            <h3 className="text-xl font-black text-gray-900 mb-2">Share CScholarTrack</h3>
            <p className="text-gray-500 text-sm mb-6">Help fellow scholars stay organized by sharing this tool.</p>
            <div className="flex gap-2">
              <input 
                type="text" 
                readOnly 
                value={window.location.origin} 
                className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-xs font-medium text-gray-400"
              />
              <button 
                onClick={copyLink}
                className={`p-3 rounded-xl transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest">{stat.label}</h3>
            <p className="text-3xl font-black text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Application Progress</h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} fontWeight="bold" tick={{ fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} fontSize={10} fontWeight="bold" tick={{ fill: '#9ca3af' }} unit="%" />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }} 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '15px' }}
                />
                <Bar dataKey="progress" radius={[8, 8, 8, 8]} barSize={32}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center">
              <FileWarning className="w-5 h-5 text-rose-500" />
            </div>
            Milestones
          </h2>
          <div className="space-y-4 flex-1 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
            {pendingDocDeadlines.map((doc, i) => (
              <div key={i} className="p-5 bg-gray-50 rounded-[24px] border border-transparent hover:border-blue-100 transition-all group">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors">{doc.name}</h4>
                  <span className="text-[10px] font-black text-rose-600 bg-white border border-rose-100 px-3 py-1 rounded-full uppercase tracking-tighter">
                    {new Date(doc.deadline!).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{doc.appTitle}</p>
                </div>
              </div>
            ))}
            {pendingDocDeadlines.length === 0 && (
              <div className="text-center py-16 flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <p className="text-sm text-gray-400 font-bold italic">All milestones are currently cleared.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
