import React, { useState } from 'react';
import MovieTracker from './MovieTracker';
import CallsTracker from './CallsTracker';
import PeriodTracker from './PeriodTracker';
import GymTracker from './GymTracker';

export default function Tracker() {
  const [activeTracker, setActiveTracker] = useState('movies');

  const trackers = [
    { id: 'movies', name: 'Movie Nights', shortName: 'Movies', icon: '🎬' },
    { id: 'calls', name: 'Night Calls', shortName: 'Calls', icon: '📞' },
    { id: 'period', name: 'Monthly Period', shortName: 'Period', icon: '💜' },
    { id: 'gym', name: 'Gym Progress', shortName: 'Gym', icon: '🏋️‍♂️' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100">
      <div className="lg:flex">
        <div className="hidden lg:block w-64 min-h-screen bg-white shadow-lg p-6">
          <h2 className="text-2xl font-bold text-purple-900 mb-6">Trackers</h2>
          <div className="space-y-2">
            {trackers.map((tracker) => {
              return (
                <button
                  key={tracker.id}
                  onClick={() => setActiveTracker(tracker.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                    activeTracker === tracker.id
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
                  }`}
                >
                  <span className="text-2xl flex items-center justify-center">
                    {tracker.icon}
                  </span>
                  <span className="font-medium">{tracker.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 pb-20 lg:pb-0">
          {activeTracker === 'movies' && <MovieTracker />}
          {activeTracker === 'calls' && <CallsTracker />}
          {activeTracker === 'period' && <PeriodTracker />}
          {activeTracker === 'gym' && <GymTracker />}{' '}
        </div>
      </div>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-purple-200 shadow-lg z-50">
        <div className="flex items-center justify-around h-16">
          {trackers.map((tracker) => {
            const isActive = activeTracker === tracker.id;
            return (
              <button
                key={tracker.id}
                onClick={() => setActiveTracker(tracker.id)}
                className={`flex flex-col items-center justify-center gap-1 px-4 py-2 flex-1 transition-all duration-200 relative ${
                  isActive ? 'text-purple-600' : 'text-gray-500'
                }`}
              >
                <span className="text-2xl">{tracker.icon}</span>
                <span
                  className={`text-xs font-medium ${
                    isActive ? 'font-semibold' : ''
                  }`}
                >
                  {tracker.shortName}
                </span>
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-purple-600 rounded-b-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
