
import React, { useState } from 'react';
import { GraduationCap, Lock, User, ArrowRight, X, UserPlus } from 'lucide-react';

interface LoginProps {
  onLogin: (username: string) => void;
  onCancel: () => void;
}

interface StoredUser {
  username: string;
  pin: string;
}

const Login: React.FC<LoginProps> = ({ onLogin, onCancel }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const getStoredUsers = (): StoredUser[] => {
    const data = localStorage.getItem('scholar_users');
    return data ? JSON.parse(data) : [];
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const users = getStoredUsers();
    const cleanUsername = username.trim().toLowerCase();

    if (!cleanUsername) {
      setError('Please enter a username');
      return;
    }
    if (pin.length !== 6) {
      setError('PIN must be exactly 6 digits');
      return;
    }

    if (isRegistering) {
      const exists = users.find(u => u.username.toLowerCase() === cleanUsername);
      if (exists) {
        setError('Username already taken');
        return;
      }
      const newUser = { username: username.trim(), pin };
      localStorage.setItem('scholar_users', JSON.stringify([...users, newUser]));
      onLogin(newUser.username);
    } else {
      const user = users.find(u => u.username.toLowerCase() === cleanUsername && u.pin === pin);
      if (!user) {
        setError('Invalid username or PIN. Please register if you do not have an account.');
        return;
      }
      onLogin(user.username);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl relative">
        <button 
          onClick={onCancel}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">
            {isRegistering ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-gray-500 mt-2">
            {isRegistering 
              ? 'Set your username and 6-digit PIN' 
              : 'Enter your details to access your dashboard'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text"
                placeholder="Future Researcher"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">6-Digit PIN</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="password"
                inputMode="numeric"
                maxLength={6}
                placeholder="••••••"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono tracking-[1em] text-lg"
                value={pin}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  if (val.length <= 6) {
                    setPin(val);
                    setError('');
                  }
                }}
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl animate-shake">
              {error}
            </div>
          )}

          <button 
            type="submit"
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {isRegistering ? (
              <>Register & Start <UserPlus className="w-5 h-5" /></>
            ) : (
              <>Access Dashboard <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
            className="text-xs text-gray-500 font-medium hover:text-blue-600"
          >
            {isRegistering 
              ? 'Already have an account? Sign in' 
              : 'Don\'t have an account? Create one'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
