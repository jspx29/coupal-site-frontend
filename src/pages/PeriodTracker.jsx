import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  Calendar,
  TrendingUp,
  Moon,
  Sun,
  Sparkles,
  Edit,
  Save,
  X,
} from 'lucide-react';

export default function PeriodTracker() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [periods, setPeriods] = useState([]);
  const [stats, setStats] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    notes: '',
    mood: '',
    isOngoing: false,
  });

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  useEffect(() => {
    fetchPeriods();
    fetchStats();
  }, [currentYear, currentMonth]);

  const API_URL = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api/periods`
    : 'http://localhost:5000/api/periods';

  const fetchPeriods = async () => {
    try {
      const response = await axios.get(API_URL);
      setPeriods(response.data);
    } catch (error) {
      console.error('Error fetching periods:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/stats/summary`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.startDate) {
      alert('Please select a start date');
      return;
    }

    if (!formData.isOngoing && !formData.endDate) {
      alert('Please select an end date or mark as ongoing');
      return;
    }

    try {
      const payload = {
        startDate: formData.startDate,
        endDate: formData.isOngoing ? null : formData.endDate || null,
        notes: formData.notes,
        mood: formData.mood,
      };

      if (selectedPeriod) {
        await axios.put(`${API_URL}/${selectedPeriod._id}`, payload);
      } else {
        await axios.post(API_URL, payload);
      }

      setShowModal(false);
      setSelectedPeriod(null);
      setFormData({
        startDate: '',
        endDate: '',
        notes: '',
        mood: '',
        isOngoing: false,
      });
      await fetchPeriods();
      await fetchStats();
    } catch (error) {
      console.error('Error saving period:', error);
      alert(
        `Error saving period: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const handleEditPeriod = (period) => {
    setSelectedPeriod(period);
    setFormData({
      startDate: new Date(period.startDate).toISOString().split('T')[0],
      endDate: period.endDate
        ? new Date(period.endDate).toISOString().split('T')[0]
        : '',
      notes: period.notes || '',
      mood: period.mood || '',
      isOngoing: !period.endDate,
    });
    setShowModal(true);
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

  const isPeriodDay = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    date.setHours(12, 0, 0, 0);
    return periods.find((period) => {
      const start = new Date(period.startDate);
      const end = period.endDate ? new Date(period.endDate) : new Date();
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return date >= start && date <= end;
    });
  };

  const getCurrentPhase = () => {
    if (!periods.length || !stats?.lastPeriodDate) {
      return {
        phase: 'Unknown',
        description: 'Log your period to start tracking phases',
        icon: Heart,
      };
    }

    const lastPeriod = new Date(stats.lastPeriodDate);
    const today = new Date();
    const daysSinceLastPeriod = Math.floor(
      (today - lastPeriod) / (1000 * 60 * 60 * 24)
    );
    const avgCycle = stats.averageCycleLength || 28;

    if (daysSinceLastPeriod <= 5) {
      return {
        phase: 'Menstrual',
        description:
          'Rest and self-care are important right now. Take it easy! 🌸',
        icon: Moon,
        color: 'text-red-600',
      };
    } else if (daysSinceLastPeriod <= Math.floor(avgCycle * 0.5)) {
      return {
        phase: 'Follicular',
        description:
          'Energy levels may be rising. Great time for activities! ✨',
        icon: Sun,
        color: 'text-yellow-600',
      };
    } else if (daysSinceLastPeriod <= Math.floor(avgCycle * 0.6)) {
      return {
        phase: 'Ovulation',
        description: 'Peak energy time. You might feel more social! 🌟',
        icon: Sparkles,
        color: 'text-pink-600',
      };
    } else {
      return {
        phase: 'Luteal',
        description: 'Be gentle with yourself. Rest is productive too! 💜',
        icon: Moon,
        color: 'text-purple-600',
      };
    }
  };

  const getPrediction = () => {
    if (!stats?.averageCycleLength || !stats?.lastPeriodDate) {
      return null;
    }

    const lastPeriod = new Date(stats.lastPeriodDate);
    const avgCycle = stats.averageCycleLength;
    const recentCycles = stats.recentCycles?.filter((c) => c.cycleLength) || [];

    let confidence = 'low';
    if (recentCycles.length >= 3) {
      const stdDev = Math.sqrt(
        recentCycles.reduce(
          (sq, c) => sq + Math.pow(c.cycleLength - avgCycle, 2),
          0
        ) / recentCycles.length
      );
      if (stdDev <= 3) confidence = 'high';
      else if (stdDev <= 7) confidence = 'medium';
    }

    const minDate = new Date(lastPeriod);
    minDate.setDate(minDate.getDate() + avgCycle - 3);

    const maxDate = new Date(lastPeriod);
    maxDate.setDate(maxDate.getDate() + avgCycle + 3);

    return { minDate, maxDate, confidence };
  };

  const getMonthInsight = () => {
    const monthPeriods = periods.filter((p) => {
      const pDate = new Date(p.startDate);
      return (
        pDate.getMonth() === currentMonth && pDate.getFullYear() === currentYear
      );
    });

    if (monthPeriods.length === 0) {
      return 'No period data for this month yet.';
    }

    const period = monthPeriods[0];
    const periodDays = period.periodDays || 'ongoing';

    if (stats?.averageCycleLength && period.cycleLength) {
      const diff = period.cycleLength - stats.averageCycleLength;
      if (Math.abs(diff) <= 2) {
        return `Cycle length was typical (${period.cycleLength} days). Period lasted ${periodDays} days.`;
      } else if (diff > 0) {
        return `Cycle was ${Math.abs(
          diff
        )} days longer than average. Period lasted ${periodDays} days.`;
      } else {
        return `Cycle was ${Math.abs(
          diff
        )} days shorter than average. Period lasted ${periodDays} days.`;
      }
    }

    return `Period lasted ${periodDays} days this month.`;
  };

  const currentPhase = getCurrentPhase();
  const prediction = getPrediction();
  const PhaseIcon = currentPhase.icon;

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
            <Heart className="text-pink-600" size={32} />
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-purple-900">
              Period Tracker
            </h1>
          </div>
          <p className="text-sm sm:text-base text-purple-700">
            Gentle tracking for better understanding 🌸
          </p>
        </div>

        {/* Current Phase Card */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 mb-4 sm:mb-6">
          <div className="flex items-start sm:items-center gap-3 sm:gap-4">
            <PhaseIcon
              className={`${currentPhase.color} flex-shrink-0`}
              size={32}
            />
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-purple-900">
                Current Phase: {currentPhase.phase}
                <span className="block sm:inline text-xs sm:text-sm font-normal text-gray-600 sm:ml-2 mt-1 sm:mt-0">
                  (estimated)
                </span>
              </h3>
              <p className="text-sm sm:text-base text-gray-700 mt-1">
                {currentPhase.description}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-6 border-l-4 border-pink-500">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Calendar className="text-pink-600" size={20} />
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800">
                Average Cycle
              </h3>
            </div>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-pink-600">
              {stats?.averageCycleLength || '--'}
              <span className="text-sm sm:text-base md:text-lg text-gray-600 ml-1">
                days
              </span>
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {stats?.cycleRegularity === 'regular' && 'Regular cycles'}
              {stats?.cycleRegularity === 'somewhat-regular' &&
                'Somewhat regular'}
              {stats?.cycleRegularity === 'irregular' && 'Irregular cycles'}
              {stats?.cycleRegularity === 'insufficient-data' &&
                'Need more data'}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-6 border-l-4 border-purple-500">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <TrendingUp className="text-purple-600" size={20} />
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800">
                Period Duration
              </h3>
            </div>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-600">
              {stats?.averagePeriodDays || '--'}
              <span className="text-sm sm:text-base md:text-lg text-gray-600 ml-1">
                days
              </span>
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              average length
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-6 border-l-4 border-indigo-500">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Sparkles className="text-indigo-600" size={20} />
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800">
                Next Period
              </h3>
            </div>
            {prediction ? (
              <>
                <p className="text-base sm:text-lg font-bold text-indigo-600">
                  {prediction.minDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                  {' - '}
                  {prediction.maxDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Confidence: {prediction.confidence}
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-400">
                Log more cycles to predict
              </p>
            )}
          </div>
        </div>

        {/* Gentle Insight */}
        {stats?.cycleRegularity === 'irregular' && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
            <p className="text-xs sm:text-sm text-blue-800">
              <strong>Gentle reminder:</strong> Your cycles have been irregular
              lately. This is normal for many people. If you have concerns,
              consider consulting a healthcare provider. 💙
            </p>
          </div>
        )}

        {/* Calendar */}
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
              const periodData = isPeriodDay(day);
              const isToday =
                new Date().toDateString() ===
                new Date(currentYear, currentMonth, day).toDateString();

              return (
                <div
                  key={day}
                  className={`aspect-square relative rounded-md sm:rounded-lg border-2 transition-all ${
                    isToday ? 'border-pink-500 bg-pink-50' : 'border-purple-200'
                  } ${periodData ? 'bg-red-100 border-red-300' : 'bg-white'}`}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <span
                      className={`text-xs sm:text-sm md:text-base font-semibold ${
                        isToday
                          ? 'text-pink-600'
                          : periodData
                          ? 'text-red-700'
                          : 'text-gray-700'
                      }`}
                    >
                      {day}
                    </span>
                    {periodData && (
                      <Heart
                        className="text-red-500 fill-red-500 mt-0.5 sm:mt-1"
                        size={14}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Month Insight */}
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-purple-50 rounded-lg">
            <p className="text-xs sm:text-sm text-gray-700">
              <strong>This month:</strong> {getMonthInsight()}
            </p>
          </div>
        </div>

        {/* Log Period Button */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <button
            onClick={() => {
              setSelectedPeriod(null);
              setFormData({
                startDate: '',
                endDate: '',
                notes: '',
                mood: '',
                isOngoing: false,
              });
              setShowModal(true);
            }}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            Log Period
          </button>
        </div>

        {/* Period History */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
          <h3 className="text-xl sm:text-2xl font-bold text-purple-900 mb-3 sm:mb-4">
            Period History
          </h3>
          {periods.length > 0 ? (
            <div className="space-y-2 sm:space-y-3">
              {periods.slice(0, 6).map((period) => (
                <div
                  key={period._id}
                  className="flex items-center justify-between p-3 sm:p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm sm:text-base text-gray-800 truncate">
                      {new Date(period.startDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                      {period.endDate
                        ? `Ended: ${new Date(period.endDate).toLocaleDateString(
                            'en-US',
                            { month: 'short', day: 'numeric' }
                          )}`
                        : 'Ongoing'}
                      {period.periodDays && ` • ${period.periodDays} days`}
                      {period.cycleLength &&
                        ` • Cycle: ${period.cycleLength} days`}
                    </p>
                    {period.notes && (
                      <p className="text-xs sm:text-sm text-gray-500 mt-1 italic truncate">
                        "{period.notes}"
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleEditPeriod(period)}
                    className="ml-2 sm:ml-4 p-1.5 sm:p-2 text-purple-600 hover:bg-purple-200 rounded-lg transition-colors flex-shrink-0"
                  >
                    <Edit size={18} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8 text-gray-400">
              <Heart size={40} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                No period data yet. Start logging to track your cycle! 🌸
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
                {selectedPeriod ? 'Edit Period' : 'Log Period'}
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
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Period Start Date 📅
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full px-3 sm:px-4 py-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={formData.isOngoing}
                    onChange={(e) =>
                      setFormData({ ...formData, isOngoing: e.target.checked })
                    }
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-xs sm:text-sm font-semibold text-gray-700">
                    Period is ongoing
                  </span>
                </label>
              </div>

              {!formData.isOngoing && (
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    Period End Date 📅
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    min={formData.startDate}
                    className="w-full px-3 sm:px-4 py-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                    required={!formData.isOngoing}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  How I felt this cycle 💭
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Optional: Any notes about this cycle..."
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Overall Mood 😊
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Good', 'Okay', 'Tough'].map((mood) => (
                    <button
                      key={mood}
                      type="button"
                      onClick={() => setFormData({ ...formData, mood })}
                      className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-sm sm:text-base ${
                        formData.mood === mood
                          ? 'bg-purple-600 text-white'
                          : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                      }`}
                    >
                      {mood}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-pink-50 rounded-lg p-3 sm:p-4 border-l-4 border-pink-400">
                <p className="text-xs sm:text-sm text-pink-800">
                  <strong>Reminder:</strong> You're doing great by tracking your
                  cycle! This data helps you understand your body better. 🌸
                </p>
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
                  className="flex-1 px-3 sm:px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium text-sm sm:text-base"
                >
                  <Save className="inline mr-1 sm:mr-2" size={16} />
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
