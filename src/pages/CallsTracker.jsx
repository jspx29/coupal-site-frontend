import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Phone, Clock, Flame, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CallsTracker() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calls, setCalls] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    startTime: '',
    duration: '00:00',
  });

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  useEffect(() => {
    fetchCalls();
  }, [currentYear, currentMonth]);

  const fetchCalls = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL
          ? `${import.meta.env.VITE_API_URL}/api/calls`
          : 'http://localhost:5000/api/calls',
        {
          params: { year: currentYear, month: currentMonth + 1 },
        }
      );
      setCalls(response.data);
    } catch (error) {
      console.error('Error fetching calls:', error);
    }
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    // Set to noon to avoid timezone issues
    clickedDate.setHours(12, 0, 0, 0);
    setSelectedDate(clickedDate);

    const existingCall = calls.find((c) => {
      const callDate = new Date(c.date);
      callDate.setHours(0, 0, 0, 0);
      const compareDate = new Date(currentYear, currentMonth, day);
      compareDate.setHours(0, 0, 0, 0);
      return callDate.getTime() === compareDate.getTime();
    });

    if (existingCall) {
      setFormData({
        startTime: existingCall.startTime,
        duration: existingCall.duration,
      });
    } else {
      setFormData({ startTime: '', duration: '00:00' });
    }

    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        import.meta.env.VITE_API_URL
          ? `${import.meta.env.VITE_API_URL}/api/calls`
          : 'http://localhost:5000/api/calls',
        {
          date: selectedDate.toISOString(),
          ...formData,
        }
      );
      setShowModal(false);
      fetchCalls();
      setFormData({ startTime: '', duration: '00:00' });
    } catch (error) {
      console.error('Error saving call:', error);
    }
  };

  const getCallForDate = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    date.setHours(0, 0, 0, 0);
    return calls.find((c) => {
      const callDate = new Date(c.date);
      callDate.setHours(0, 0, 0, 0);
      return callDate.getTime() === date.getTime();
    });
  };

  const getDaysInMonth = () => {
    return new Date(currentYear, currentMonth + 1, 0).getDate();
  };

  const getFirstDayOfMonth = () => {
    return new Date(currentYear, currentMonth, 1).getDay();
  };

  const changeMonth = (direction) => {
    const newDate = new Date(currentYear, currentMonth + direction, 1);
    setCurrentDate(newDate);
  };

  const totalCalls = calls.length;

  const parseDuration = (duration) => {
    const [hours, minutes] = duration.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const longestCall = () => {
    if (calls.length === 0) return '0h 0m';
    const longest = calls.reduce((max, call) => {
      const currentDuration = parseDuration(call.duration);
      const maxDuration = parseDuration(max.duration);
      return currentDuration > maxDuration ? call : max;
    });
    const [hours, minutes] = longest.duration.split(':');
    return `${hours}h ${minutes}m`;
  };

  const longestStreak = () => {
    if (calls.length === 0) return 0;

    const sortedCalls = [...calls].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    let maxStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < sortedCalls.length; i++) {
      const prevDate = new Date(sortedCalls[i - 1].date);
      const currDate = new Date(sortedCalls[i].date);
      const diffTime = Math.abs(currDate - prevDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    return maxStreak;
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
            <Phone className="text-purple-600" size={32} />
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-purple-900">
              Night Calls Tracker
            </h1>
          </div>
          <p className="text-sm sm:text-base text-purple-700">
            Track our precious call moments 📞💕
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-6 border-l-4 border-purple-500">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Phone className="text-purple-600" size={20} />
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800">
                Total Calls
              </h3>
            </div>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-600">
              {totalCalls}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">this month</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-6 border-l-4 border-pink-500">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Clock className="text-pink-600" size={20} />
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800">
                Longest Call
              </h3>
            </div>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-pink-600">
              {longestCall()}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">this month</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-6 border-l-4 border-indigo-500">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Flame className="text-indigo-600" size={20} />
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800">
                Longest Streak
              </h3>
            </div>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-indigo-600">
              {longestStreak()}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              consecutive days
            </p>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <button
              onClick={() => changeMonth(-1)}
              className="p-1.5 sm:p-2 hover:bg-purple-100 rounded-full transition-colors"
            >
              <ChevronLeft className="text-purple-600" size={20} />
            </button>

            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-purple-900">
              {currentDate.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </h2>

            <button
              onClick={() => changeMonth(1)}
              className="p-1.5 sm:p-2 hover:bg-purple-100 rounded-full transition-colors"
            >
              <ChevronRight className="text-purple-600" size={20} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="text-center font-semibold text-purple-700 py-1 sm:py-2 text-xs sm:text-sm"
              >
                {day}
              </div>
            ))}

            {[...Array(getFirstDayOfMonth())].map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {[...Array(getDaysInMonth())].map((_, i) => {
              const day = i + 1;
              const call = getCallForDate(day);
              const isToday =
                new Date().toDateString() ===
                new Date(currentYear, currentMonth, day).toDateString();

              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className={`aspect-square relative rounded-md sm:rounded-lg border-2 transition-all hover:scale-105 hover:shadow-lg group ${
                    isToday
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-purple-200 hover:border-purple-400'
                  } ${call ? 'bg-purple-100' : 'bg-white'}`}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <span
                      className={`text-xs sm:text-sm md:text-base font-semibold ${
                        isToday ? 'text-pink-600' : 'text-gray-700'
                      }`}
                    >
                      {day}
                    </span>

                    {call && (
                      <div className="relative">
                        <Phone
                          className="text-purple-600 mt-0.5 sm:mt-1"
                          size={16}
                        />

                        <div className="hidden sm:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap">
                            <p className="font-semibold">
                              Started: {call.startTime}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock size={12} />
                              <span>Duration: {call.duration}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {totalCalls === 0 && (
            <div className="text-center py-8 sm:py-12 text-gray-400">
              <Phone size={48} className="mx-auto mb-3 sm:mb-4 opacity-50" />
              <p className="text-lg sm:text-xl font-semibold">
                No calls yet this month...
              </p>
              <p className="text-xs sm:text-sm mt-2">
                Click on a date to add your first night call! 📞
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-purple-900 mb-3 sm:mb-4">
              {selectedDate?.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Call Start Time 🕐
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  className="w-full px-3 sm:px-4 py-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Call Duration ⏱️
                </label>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Hours
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="23"
                      value={parseInt(formData.duration.split(':')[0]) || 0}
                      onChange={(e) => {
                        const hours = Math.max(
                          0,
                          Math.min(23, parseInt(e.target.value) || 0)
                        );
                        const minutes = formData.duration.split(':')[1] || '00';
                        setFormData({
                          ...formData,
                          duration: `${String(hours).padStart(
                            2,
                            '0'
                          )}:${minutes}`,
                        });
                      }}
                      className="w-full px-2 sm:px-4 py-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Minutes
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={parseInt(formData.duration.split(':')[1]) || 0}
                      onChange={(e) => {
                        const hours = formData.duration.split(':')[0] || '00';
                        const minutes = Math.max(
                          0,
                          Math.min(59, parseInt(e.target.value) || 0)
                        );
                        setFormData({
                          ...formData,
                          duration: `${hours}:${String(minutes).padStart(
                            2,
                            '0'
                          )}`,
                        });
                      }}
                      className="w-full px-2 sm:px-4 py-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1.5 sm:mt-2">
                  How long did the call last? (e.g., 2 hours 30 minutes)
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-3 sm:p-4">
                <p className="text-center text-xs sm:text-sm text-gray-600">
                  Call Summary
                </p>
                <div className="flex flex-col items-center gap-1.5 sm:gap-2 mt-2">
                  {formData.startTime && formData.duration ? (
                    <>
                      <div className="flex items-center gap-2">
                        <Phone className="text-purple-600" size={18} />
                        <span className="text-sm sm:text-base md:text-lg font-semibold text-purple-600">
                          Started at {formData.startTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="text-pink-600" size={18} />
                        <span className="text-sm sm:text-base md:text-lg font-semibold text-pink-600">
                          Duration: {formData.duration.split(':')[0]}h{' '}
                          {formData.duration.split(':')[1]}m
                        </span>
                      </div>
                    </>
                  ) : (
                    <span className="text-sm text-gray-400">
                      Fill in the details
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!formData.startTime || !formData.duration}
                  className="flex-1 px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  Save Call
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
