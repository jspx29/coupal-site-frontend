import React, { useState } from 'react';
import { Heart, Lock } from 'lucide-react';
import cat_bg_1 from '../assets/cat-bg-1.png';
import cat_bg_2 from '../assets/cat-bg-2.png';

export default function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = onLogin(password);

    if (!success) {
      setError('Incorrect password 💔');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 backdrop-blur-xl">
      <div className="absolute inset-0 overflow-hidden opacity-30 blur-sm">
        <img
          src={cat_bg_1}
          className="absolute top-24 left-10 w-24 h-24 opacity-40"
          alt=""
        />
        <img
          src={cat_bg_2}
          className="absolute top-1/2 right-10 w-16 h-16 opacity-40"
          alt=""
        />
        <img
          src={cat_bg_1}
          className="absolute bottom-1/3 left-20 w-16 h-16 opacity-30"
          alt=""
        />
        <img
          src={cat_bg_2}
          className="absolute bottom-10 right-24 w-24 h-24 opacity-40"
          alt=""
        />
      </div>

      <div
        className={`relative z-10 w-full max-w-md mx-4 ${
          isShaking ? 'animate-shake' : ''
        }`}
      >
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 sm:p-10 border-4 border-purple-200">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <Heart className="text-white fill-white" size={36} />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
              Welcome Back
            </h1>
            <p className="text-purple-700 text-sm sm:text-base">
              Enter password to access our memories 💕
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400"
                  size={20}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter password..."
                  className="w-full pl-11 pr-4 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  autoFocus
                />
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600 animate-fade-in">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Heart size={20} className="fill-white" />
              <span>Unlock Our Story</span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Made with 💜 for Jasper & Gianne
            </p>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 text-pink-400 text-3xl animate-float opacity-40">
          💕
        </div>
        <div
          className="absolute top-40 right-20 text-purple-400 text-2xl animate-float opacity-40"
          style={{ animationDelay: '1s' }}
        >
          💜
        </div>
        <div
          className="absolute bottom-32 left-20 text-pink-300 text-3xl animate-float opacity-40"
          style={{ animationDelay: '2s' }}
        >
          💖
        </div>
        <div
          className="absolute bottom-20 right-32 text-purple-300 text-2xl animate-float opacity-40"
          style={{ animationDelay: '1.5s' }}
        >
          💕
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-10px);
          }
          75% {
            transform: translateX(10px);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-shake {
          animation: shake 0.5s;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
