
import React from 'react';
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
  FileWarning
} from 'lucide-react';
import { ScholarshipApplication } from '../types';

interface DashboardProps {
  applications: ScholarshipApplication[];
}

const Dashboard: React.FC<DashboardProps> = ({ applications }) => {
  const stats = [
    { label: 'Active Apps', value: applications.length, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Docs Pending', value: applications.reduce((acc, app) => acc + app.documents.filter(d => d.status === 'Pending').length, 0), icon: Files, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Upcoming App Deadlines', value: applications.filter(a => new Date(a.deadline) > new Date()).length, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  // Extract documents that have deadlines and are still pending
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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900">Application Completion</h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tick={{ fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{ fill: '#9ca3af' }} unit="%" />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }} 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="progress" radius={[4, 4, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FileWarning className="w-5 h-5 text-rose-500" />
            Document Deadlines
          </h2>
          <div className="space-y-4 flex-1 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
            {pendingDocDeadlines.map((doc, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-blue-100 transition-all">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-bold text-gray-900">{doc.name}</h4>
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                    {new Date(doc.deadline!).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{doc.appTitle}</p>
              </div>
            ))}
            {pendingDocDeadlines.length === 0 && (
              <div className="text-center py-12 flex flex-col items-center gap-4">
                <CheckCircle2 className="w-10 h-10 text-emerald-100" />
                <p className="text-sm text-gray-400 italic">All set! No upcoming document deadlines.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
