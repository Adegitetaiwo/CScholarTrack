
import React, { useState } from 'react';
import { Shield, Cloud, Bell, Save, HardDrive } from 'lucide-react';
import { UserSettings } from '../types';

interface SettingsProps {
  settings: UserSettings;
  onSave: (newSettings: UserSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSave }) => {
  const [formData, setFormData] = useState<UserSettings>(settings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold">Storage Settings</h2>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div className="flex items-center gap-3">
              <HardDrive className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-bold">Local Browser Storage</p>
                <p className="text-xs text-gray-500">Store files directly in your browser (limited size)</p>
              </div>
            </div>
            <input 
              type="checkbox" 
              className="w-5 h-5 text-blue-600 rounded"
              checked={formData.useLocalStorage}
              onChange={e => setFormData({...formData, useLocalStorage: e.target.checked})}
            />
          </div>

          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-4 text-sm font-bold text-gray-900">
              <Cloud className="w-4 h-4 text-blue-400" />
              Cloudinary Configuration (Recommended)
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">Cloud Name</label>
                <input 
                  type="text"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.cloudinaryCloudName || ''}
                  onChange={e => setFormData({...formData, cloudinaryCloudName: e.target.value})}
                  placeholder="Enter your cloud name"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">Upload Preset</label>
                <input 
                  type="text"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.cloudinaryUploadPreset || ''}
                  onChange={e => setFormData({...formData, cloudinaryUploadPreset: e.target.value})}
                  placeholder="Enter upload preset"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <Bell className="w-6 h-6 text-amber-500" />
          <h2 className="text-xl font-bold">Notifications</h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Email for Reminders</label>
            <input 
              type="email"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.emailReminderAddress || ''}
              onChange={e => setFormData({...formData, emailReminderAddress: e.target.value})}
              placeholder="hello@example.com"
            />
          </div>
        </div>
      </div>

      <button 
        onClick={handleSave}
        className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
          saved ? 'bg-emerald-500 text-white' : 'bg-gray-900 text-white hover:bg-black'
        }`}
      >
        {saved ? 'Settings Saved!' : <><Save className="w-5 h-5" /> Save Changes</>}
      </button>
    </div>
  );
};

export default Settings;
