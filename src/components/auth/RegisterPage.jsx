import React, { useState } from 'react';
import { UserPlus, Mail, Lock, Key, Users, Eye, EyeOff, ChevronRight, Shield, LogIn } from 'lucide-react';
import BinaryRain from '../ui/BinaryRain';

const RegisterPage = ({ onRegister, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('PASSWORD_MISMATCH: ACCESS_DENIED');
      return;
    }

    console.log('Registration attempted with:', formData);
    
    const userData = {
      user_id: Math.floor(Math.random() * 1000) + 1,
      username: formData.username,
      email: formData.email,
      full_name: formData.fullName,
      total_points: 0,
      profile_meta: {
        avatar: "🆕",
        rank: "RECRUIT",
        specialization: "TRAINING",
        join_date: new Date().toISOString()
      }
    };
    
    onRegister(userData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4 relative overflow-hidden">
      <BinaryRain />
      
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-gray-900 to-black"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-blue-400 animate-pulse"></div>

      <div className="relative w-full max-w-md">
        <div className="bg-gray-800/90 backdrop-blur-lg rounded-lg shadow-2xl overflow-hidden border border-blue-500/30">
          <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-8 text-center relative overflow-hidden border-b border-blue-500/30">
            <div className="absolute inset-0 bg-blue-500/5"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500/20 backdrop-blur-sm rounded-full mb-4 border border-blue-500/30">
                <UserPlus className="w-10 h-10 text-blue-400" />
              </div>
              <h1 className="text-4xl font-bold text-blue-400 mb-2 font-mono">CYBER_OPS</h1>
              <p className="text-gray-400 font-mono text-sm">// OPERATIVE_REGISTRATION</p>
            </div>
          </div>

          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2 font-mono">NEW_OPERATIVE</h2>
              <p className="text-gray-400 font-mono">ACCOUNT_CREATION</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-400 mb-2 font-mono">
                  [OPERATIVE_CODENAME]
                </label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-700/50 border-2 border-gray-600 rounded-lg text-white placeholder-gray-500 outline-none focus:border-blue-500 focus:bg-gray-700/80 transition-all duration-300 font-mono"
                    placeholder="ghost_operative"
                  />
                </div>
              </div>

              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-400 mb-2 font-mono">
                  [COMMUNICATION_CHANNEL]
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-700/50 border-2 border-gray-600 rounded-lg text-white placeholder-gray-500 outline-none focus:border-blue-500 focus:bg-gray-700/80 transition-all duration-300 font-mono"
                    placeholder="operative@secure.com"
                  />
                </div>
              </div>

              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-400 mb-2 font-mono">
                  [FULL_IDENTITY]
                </label>
                <div className="relative">
                  <UserPlus className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-700/50 border-2 border-gray-600 rounded-lg text-white placeholder-gray-500 outline-none focus:border-blue-500 focus:bg-gray-700/80 transition-all duration-300 font-mono"
                    placeholder="John Smith"
                  />
                </div>
              </div>

              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-400 mb-2 font-mono">
                  [ENCRYPTION_KEY]
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-12 py-4 bg-gray-700/50 border-2 border-gray-600 rounded-lg text-white placeholder-gray-500 outline-none focus:border-blue-500 focus:bg-gray-700/80 transition-all duration-300 font-mono"
                    placeholder="********"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-300 transition"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-400 mb-2 font-mono">
                  [CONFIRM_ENCRYPTION_KEY]
                </label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-12 py-4 bg-gray-700/50 border-2 border-gray-600 rounded-lg text-white placeholder-gray-500 outline-none focus:border-blue-500 focus:bg-gray-700/80 transition-all duration-300 font-mono"
                    placeholder="********"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-300 transition"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-blue-500/20 transform hover:scale-105 transition-all duration-300 relative overflow-hidden border border-blue-500/30"
              >
                <span className="relative z-10 flex items-center justify-center gap-2 font-mono">
                  ACTIVATE_OPERATIVE
                  <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={onSwitchToLogin}
                className="text-blue-400 hover:text-blue-300 font-mono text-sm transition-colors duration-200 flex items-center justify-center gap-2 mx-auto"
              >
                <LogIn className="w-4 h-4" />
                EXISTING_OPERATIVE_ACCESS
              </button>
            </div>

            <div className="mt-6 bg-gray-700/50 backdrop-blur-sm border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <p className="font-semibold text-white text-sm font-mono">SECURE_REGISTRATION</p>
              </div>
              <p className="text-gray-400 text-xs font-mono">ALL_DATA_ENCRYPTED_AND_SECURED</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;