import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Phone, Shield, Info } from 'lucide-react';

export const Login = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  
  const { login, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (isAdmin) {
      const success = await login('admin', { username, password });
      if (success) navigate('/admin');
      else setError('Invalid Admin Credentials');
    } else {
      if (step === 'credentials') {
        await login('user', { email, phone });
        setStep('otp');
      } else {
        const success = await verifyOtp(otp);
        if (success) navigate('/home');
        else setError('Invalid OTP');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              {isAdmin ? 'Admin Portal' : 'Library Login'}
            </h1>
            <p className="text-slate-500">
              {isAdmin ? 'Restricted Access' : 'Welcome back, book lover!'}
            </p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-lg mb-8">
            <button
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${!isAdmin ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}
              onClick={() => setIsAdmin(false)}
            >
              User Login
            </button>
            <button
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${isAdmin ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}
              onClick={() => setIsAdmin(true)}
            >
              Admin Login
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isAdmin ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Username</label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Admin Username"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                
                {/* Helper for Demo */}
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800 flex gap-3">
                  <Info className="flex-shrink-0 mt-0.5" size={16} />
                  <div>
                    <p className="font-bold text-xs uppercase mb-1">Demo Credentials</p>
                    <div className="grid grid-cols-[auto_1fr] gap-x-2 text-xs">
                      <span className="text-blue-600">User:</span> <span className="font-mono">admin</span>
                      <span className="text-blue-600">Pass:</span> <span className="font-mono">Admin@1234!</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {step === 'credentials' ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="you@example.com"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="+91 98765 43210"
                          required
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Enter OTP</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-center text-2xl tracking-widest"
                      placeholder="1234"
                      maxLength={4}
                    />
                    <p className="text-xs text-center text-slate-500">Use '1234' for demo</p>
                  </div>
                )}
              </>
            )}

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
            >
              {isAdmin ? 'Access Dashboard' : (step === 'credentials' ? 'Send OTP' : 'Verify & Login')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
