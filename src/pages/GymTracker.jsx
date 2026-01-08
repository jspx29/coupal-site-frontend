import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dumbbell,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Coffee,
  TrendingUp,
  Flame,
  Calendar,
  Camera,
  X,
  ChevronDown,
  Image as ImageIcon,
} from 'lucide-react';

export default function GymTracker() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({
    status: 'completed',
    workoutName: '',
    progressPhoto: null,
  });
  const [progressFilter, setProgressFilter] = useState('latest');
  const [transformationFilter, setTransformationFilter] = useState('latest');

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const API_URL = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api/gym`
    : 'http://localhost:5000/api/gym';

  useEffect(() => {
    fetchSessions();
    fetchStats();
  }, [currentYear, currentMonth]);

  const fetchSessions = async () => {
    try {
      const response = await axios.get(API_URL, {
        params: { year: currentYear, month: currentMonth + 1 },
      });
      setSessions(response.data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/stats/summary`, {
        params: { year: currentYear, month: currentMonth + 1 },
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    clickedDate.setHours(12, 0, 0, 0);
    setSelectedDate(clickedDate);

    const existingSession = sessions.find((s) => {
      const sessionDate = new Date(s.date);
      sessionDate.setHours(0, 0, 0, 0);
      const compareDate = new Date(currentYear, currentMonth, day);
      compareDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === compareDate.getTime();
    });

    if (existingSession) {
      setFormData({
        status: existingSession.status,
        workoutName: existingSession.workoutName || '',
        progressPhoto: null,
      });
    } else {
      setFormData({
        status: 'completed',
        workoutName: '',
        progressPhoto: null,
      });
    }

    setShowModal(true);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, progressPhoto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, {
        date: selectedDate.toISOString(),
        ...formData,
      });
      setShowModal(false);
      fetchSessions();
      fetchStats();
      setFormData({
        status: 'completed',
        workoutName: '',
        progressPhoto: null,
      });
    } catch (error) {
      console.error('Error saving session:', error);
      alert('Error saving session');
    }
  };

  const getSessionForDate = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    date.setHours(0, 0, 0, 0);
    return sessions.find((s) => {
      const sessionDate = new Date(s.date);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === date.getTime();
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

  const getMotivationMessage = () => {
    if (!stats) return null;
    const { recentMisses } = stats;

    if (recentMisses === 0) return null;
    if (recentMisses === 1)
      return { type: 'warning', message: "Don't break the momentum! 🔥" };
    if (recentMisses === 2)
      return {
        type: 'warning',
        message: "You okay? One workout and you're back! 💪",
      };
    if (recentMisses >= 3)
      return {
        type: 'danger',
        message:
          'Time to get back on track! Your future self will thank you! 🎯',
      };
  };

  const isUploadDay = () => {
    if (!stats) return false;
    return (stats.totalSessions + 1) % 5 === 0;
  };

  const getProgressPhotoSessions = () => {
    if (!stats?.progressPhotos) return [];

    const allPhotos = stats.progressPhotos;

    if (progressFilter === 'latest') {
      return allPhotos.slice(-3).reverse();
    } else {
      const range = parseInt(progressFilter);
      const startSession = range;
      const endSession = range + 10;
      return allPhotos.filter(
        (p) => p.sessionNumber >= startSession && p.sessionNumber <= endSession
      );
    }
  };

  const getProgressFilterOptions = () => {
    if (!stats?.progressPhotos) return [];
    const totalPhotos = stats.progressPhotos.length;
    if (totalPhotos <= 3) return [];

    const options = [{ value: 'latest', label: 'Latest' }];

    const maxSessionNumber = Math.max(
      ...stats.progressPhotos.map((p) => p.sessionNumber)
    );
    for (let i = 5; i <= maxSessionNumber; i += 10) {
      if (stats.progressPhotos.some((p) => p.sessionNumber >= i)) {
        options.push({
          value: i.toString(),
          label: `Sessions ${i}-${i + 10}`,
        });
      }
    }

    return options;
  };

  const getComparisonPhotos = () => {
    const photos = stats?.progressPhotos || [];

    const multiplesOf20 = photos.filter((p) => p.sessionNumber % 20 === 0);
    if (multiplesOf20.length === 0) return null;

    if (transformationFilter === 'latest') {
      return {
        first: photos[0],
        current: multiplesOf20[multiplesOf20.length - 1],
      };
    } else {
      const targetSessionNumber = parseInt(transformationFilter);
      const startPhoto = photos[0];
      const endPhoto = photos.find(
        (p) => p.sessionNumber === targetSessionNumber
      );

      if (!endPhoto) return null;

      return {
        first: startPhoto,
        current: endPhoto,
      };
    }
  };

  const getTransformationFilterOptions = () => {
    if (!stats?.progressPhotos) return [];
    const photos = stats.progressPhotos;

    const multiplesOf20 = photos.filter((p) => p.sessionNumber % 20 === 0);

    if (multiplesOf20.length === 0) return [];

    const options = [{ value: 'latest', label: 'Latest' }];

    multiplesOf20.forEach((photo) => {
      options.push({
        value: photo.sessionNumber.toString(),
        label: `Session 1 vs ${photo.sessionNumber}`,
      });
    });

    return options;
  };

  const motivationMsg = getMotivationMessage();
  const comparison = getComparisonPhotos();
  const progressFilterOptions = getProgressFilterOptions();
  const transformationFilterOptions = getTransformationFilterOptions();

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-green-500" size={18} />;
      case 'missed':
        return <XCircle className="text-red-500" size={18} />;
      case 'rest':
        return <Coffee className="text-blue-500" size={18} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
            <Dumbbell className="text-purple-600" size={32} />
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-purple-900">
              Gym Progress Tracker
            </h1>
          </div>
          <p className="text-sm sm:text-base text-purple-700">
            Track your fitness journey 💪🔥
          </p>
        </div>

        {motivationMsg && (
          <div
            className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl border-l-4 ${
              motivationMsg.type === 'warning'
                ? 'bg-yellow-50 border-yellow-400'
                : 'bg-red-50 border-red-400'
            }`}
          >
            <p
              className={`text-sm sm:text-base font-semibold ${
                motivationMsg.type === 'warning'
                  ? 'text-yellow-800'
                  : 'text-red-800'
              }`}
            >
              {motivationMsg.message}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-6 border-l-4 border-purple-500">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="text-purple-600" size={20} />
              <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-800">
                This Month
              </h3>
            </div>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-600">
              {stats?.monthSessions || 0}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">sessions</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-6 border-l-4 border-pink-500">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-pink-600" size={20} />
              <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-800">
                Consistency
              </h3>
            </div>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-pink-600">
              {stats?.consistency || 0}%
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">this month</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-6 border-l-4 border-orange-500">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="text-orange-600" size={20} />
              <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-800">
                Streak
              </h3>
            </div>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-600">
              {stats?.streak || 0}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">days</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-6 border-l-4 border-indigo-500">
            <div className="flex items-center gap-2 mb-2">
              <Dumbbell className="text-indigo-600" size={20} />
              <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-800">
                Total Sessions
              </h3>
            </div>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-indigo-600">
              {stats?.totalSessions || 0}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">sessions</p>
          </div>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
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
              const session = getSessionForDate(day);
              const isToday =
                new Date().toDateString() ===
                new Date(currentYear, currentMonth, day).toDateString();

              const bgColor = session
                ? session.status === 'completed'
                  ? 'bg-green-100 border-green-300'
                  : session.status === 'missed'
                  ? 'bg-red-100 border-red-300'
                  : 'bg-blue-100 border-blue-300'
                : 'bg-white';

              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className={`aspect-square relative rounded-md sm:rounded-lg border-2 transition-all hover:scale-105 hover:shadow-lg ${
                    isToday ? 'border-pink-500' : 'border-purple-200'
                  } ${bgColor}`}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <span
                      className={`text-xs sm:text-sm md:text-base font-semibold ${
                        isToday ? 'text-pink-600' : 'text-gray-700'
                      }`}
                    >
                      {day}
                    </span>
                    {session && (
                      <div className="mt-0.5 sm:mt-1">
                        {getStatusIcon(session.status)}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl sm:text-2xl font-bold text-purple-900">
              Progress Photos
            </h3>
            {progressFilterOptions.length > 0 && (
              <div className="relative">
                <select
                  value={progressFilter}
                  onChange={(e) => setProgressFilter(e.target.value)}
                  className="appearance-none bg-purple-100 text-purple-900 px-4 py-2 pr-8 rounded-lg font-medium text-sm cursor-pointer hover:bg-purple-200 transition-colors"
                >
                  {progressFilterOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-900 pointer-events-none"
                  size={16}
                />
              </div>
            )}
          </div>

          {getProgressPhotoSessions().length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {getProgressPhotoSessions().map((photo) => (
                <div
                  key={photo.sessionNumber}
                  className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200"
                >
                  <p className="text-sm font-semibold text-purple-900 mb-2">
                    Session {photo.sessionNumber}
                  </p>
                  <img
                    src={photo.photo}
                    alt={`Session ${photo.sessionNumber}`}
                    className="w-full h-80 object-cover rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(photo.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ImageIcon className="mx-auto text-purple-300 mb-4" size={64} />
              <p className="text-gray-500 text-lg font-medium">
                No progress photos yet
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Photos are taken every 5th session
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl sm:text-2xl font-bold text-purple-900">
              Transformation Journey 🎯
            </h3>
            {transformationFilterOptions.length > 0 && (
              <div className="relative">
                <select
                  value={transformationFilter}
                  onChange={(e) => setTransformationFilter(e.target.value)}
                  className="appearance-none bg-purple-100 text-purple-900 px-4 py-2 pr-8 rounded-lg font-medium text-sm cursor-pointer hover:bg-purple-200 transition-colors"
                >
                  {transformationFilterOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-900 pointer-events-none"
                  size={16}
                />
              </div>
            )}
          </div>

          {comparison ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-purple-50 border-2 border-purple-100 rounded-lg p-4">
                  <p className="text-sm font-semibold text-purple-900 mb-2 text-center">
                    Session 1 (Start)
                  </p>
                  <img
                    src={comparison.first.photo}
                    alt="Session 1"
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    {new Date(comparison.first.date).toLocaleDateString(
                      'en-US',
                      {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      }
                    )}
                  </p>
                </div>
                <div className="bg-purple-50 border-2 border-purple-100 rounded-lg p-4">
                  <p className="text-sm font-semibold text-purple-900 mb-2 text-center">
                    Session {comparison.current.sessionNumber} (Current)
                  </p>
                  <img
                    src={comparison.current.photo}
                    alt={`Session ${comparison.current.sessionNumber}`}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    {new Date(comparison.current.date).toLocaleDateString(
                      'en-US',
                      {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      }
                    )}
                  </p>
                </div>
              </div>
              <p className="text-center text-purple-700 font-semibold mt-4">
                Look at that progress! Keep pushing! 💪🔥
              </p>
            </>
          ) : (
            <div className="text-center py-12">
              <ImageIcon className="mx-auto text-purple-300 mb-4" size={64} />
              <p className="text-gray-500 text-lg font-medium">
                Transformation comparison not available yet
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Complete at least 20 sessions with photos to see your
                transformation
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-xl sm:text-2xl font-bold text-purple-900">
                {selectedDate?.toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="text-gray-600" size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Status 🎯
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, status: 'completed' })
                    }
                    className={`px-3 py-2 rounded-lg font-medium transition-all text-sm flex flex-col items-center gap-1 ${
                      formData.status === 'completed'
                        ? 'bg-green-600 text-white'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    <CheckCircle size={20} />
                    Done
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, status: 'missed' })
                    }
                    className={`px-3 py-2 rounded-lg font-medium transition-all text-sm flex flex-col items-center gap-1 ${
                      formData.status === 'missed'
                        ? 'bg-red-600 text-white'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    <XCircle size={20} />
                    Missed
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 'rest' })}
                    className={`px-3 py-2 rounded-lg font-medium transition-all text-sm flex flex-col items-center gap-1 ${
                      formData.status === 'rest'
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    <Coffee size={20} />
                    Rest
                  </button>
                </div>
              </div>

              {formData.status === 'completed' && (
                <>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                      Workout Name 💪
                    </label>
                    <input
                      type="text"
                      value={formData.workoutName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          workoutName: e.target.value,
                        })
                      }
                      placeholder="e.g., Chest & Triceps"
                      className="w-full px-3 sm:px-4 py-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                    />
                  </div>

                  {isUploadDay() && (
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-purple-900 mb-2">
                        Progress Photo 📸 (Every 5th Session!)
                      </label>
                      <label className="block border-2 border-dashed border-purple-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                        {formData.progressPhoto ? (
                          <img
                            src={formData.progressPhoto}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded mb-2"
                          />
                        ) : (
                          <>
                            <Camera
                              className="mx-auto text-purple-400 mb-2"
                              size={40}
                            />
                            <p className="text-purple-600 font-medium">
                              Tap to upload photo
                            </p>
                            <p className="text-gray-400 text-xs mt-1">
                              PNG, JPG up to 10MB
                            </p>
                          </>
                        )}
                      </label>
                    </div>
                  )}
                </>
              )}

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
                  className="flex-1 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all font-medium text-sm sm:text-base"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
