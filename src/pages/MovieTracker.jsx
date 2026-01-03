import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Film,
  Star,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Award,
} from 'lucide-react';

export default function MovieTracker() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [movies, setMovies] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    movieTitle: '',
    jasperRating: 5,
    gianneRating: 5,
  });

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  useEffect(() => {
    fetchMovies();
  }, [currentYear, currentMonth]);

  const fetchMovies = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL
          ? `${import.meta.env.VITE_API_URL}/api/movies`
          : 'http://localhost:5000/api/movies',
        {
          params: { year: currentYear, month: currentMonth + 1 },
        }
      );
      setMovies(response.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(clickedDate);

    const existingMovie = movies.find(
      (m) => new Date(m.date).toDateString() === clickedDate.toDateString()
    );

    if (existingMovie) {
      setFormData({
        movieTitle: existingMovie.movieTitle,
        jasperRating: existingMovie.jasperRating,
        gianneRating: existingMovie.gianneRating,
      });
    } else {
      setFormData({ movieTitle: '', jasperRating: 5, gianneRating: 5 });
    }

    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        import.meta.env.VITE_API_URL
          ? `${import.meta.env.VITE_API_URL}/api/movies`
          : 'http://localhost:5000/api/movies',
        {
          date: selectedDate.toISOString(),
          ...formData,
        }
      );
      setShowModal(false);
      fetchMovies();
      setFormData({ movieTitle: '', jasperRating: 5, gianneRating: 5 });
    } catch (error) {
      console.error('Error saving movie:', error);
    }
  };

  const getMovieForDate = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    return movies.find(
      (m) => new Date(m.date).toDateString() === date.toDateString()
    );
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

  const totalMovies = movies.length;

  const mostCommonDay = () => {
    if (movies.length === 0) return 'N/A';
    const dayCounts = {};
    movies.forEach((m) => {
      const day = new Date(m.date).toLocaleDateString('en-US', {
        weekday: 'long',
      });
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    });
    return Object.keys(dayCounts).reduce(
      (a, b) => (dayCounts[a] > dayCounts[b] ? a : b),
      'N/A'
    );
  };

  const bestMovie = () => {
    if (movies.length === 0) return null;
    return movies.reduce((best, current) => {
      const currentTotal = current.jasperRating + current.gianneRating;
      const bestTotal = best.jasperRating + best.gianneRating;
      return currentTotal > bestTotal ? current : best;
    });
  };

  const best = bestMovie();

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
            <Film className="text-purple-600" size={32} />
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-purple-900">
              Movie Nights Tracker
            </h1>
          </div>
          <p className="text-sm sm:text-base text-purple-700">
            Our shared movie watching journey 🎬💕
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-6 border-l-4 border-purple-500">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Film className="text-purple-600" size={20} />
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800">
                Total Movies
              </h3>
            </div>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-600">
              {totalMovies}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">this month</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-6 border-l-4 border-pink-500">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <TrendingUp className="text-pink-600" size={20} />
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800">
                Most Common Day
              </h3>
            </div>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-pink-600">
              {mostCommonDay()}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              favorite movie night
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-6 border-l-4 border-indigo-500">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Award className="text-indigo-600" size={20} />
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800">
                Best Movie
              </h3>
            </div>
            {best ? (
              <>
                <p className="text-base sm:text-lg md:text-xl font-bold text-indigo-600 truncate">
                  {best.movieTitle}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="text-yellow-500 fill-yellow-500" size={14} />
                  <p className="text-xs sm:text-sm text-gray-600">
                    {best.jasperRating + best.gianneRating}/20
                  </p>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-400">No movies yet</p>
            )}
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
              const movie = getMovieForDate(day);
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
                  } ${movie ? 'bg-purple-100' : 'bg-white'}`}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <span
                      className={`text-xs sm:text-sm md:text-base font-semibold ${
                        isToday ? 'text-pink-600' : 'text-gray-700'
                      }`}
                    >
                      {day}
                    </span>

                    {movie && (
                      <div className="relative">
                        <Film
                          className="text-purple-600 mt-0.5 sm:mt-1"
                          size={16}
                        />

                        <div className="hidden sm:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap">
                            <p className="font-semibold">{movie.movieTitle}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span>J: {movie.jasperRating}/10</span>
                              <span>G: {movie.gianneRating}/10</span>
                            </div>
                            <div className="flex items-center gap-1 justify-center mt-1">
                              <Star
                                className="text-yellow-400 fill-yellow-400"
                                size={12}
                              />
                              <span>
                                {movie.jasperRating + movie.gianneRating}/20
                              </span>
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

          {totalMovies === 0 && (
            <div className="text-center py-8 sm:py-12 text-gray-400">
              <Film size={48} className="mx-auto mb-3 sm:mb-4 opacity-50" />
              <p className="text-lg sm:text-xl font-semibold">
                No movies yet this month...
              </p>
              <p className="text-xs sm:text-sm mt-2">
                Click on a date to add your first movie night! 🍿
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

            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  What movie did you watch? 🎬
                </label>
                <input
                  type="text"
                  value={formData.movieTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, movieTitle: e.target.value })
                  }
                  placeholder="Enter movie title..."
                  className="w-full px-3 sm:px-4 py-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Jasper's Rating ⭐
                </label>
                <div className="flex items-center gap-3 sm:gap-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.jasperRating}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        jasperRating: parseInt(e.target.value),
                      })
                    }
                    className="flex-1"
                  />
                  <span className="text-xl sm:text-2xl font-bold text-purple-600 w-10 sm:w-12 text-center">
                    {formData.jasperRating}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Gianne's Rating 💕
                </label>
                <div className="flex items-center gap-3 sm:gap-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.gianneRating}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        gianneRating: parseInt(e.target.value),
                      })
                    }
                    className="flex-1"
                  />
                  <span className="text-xl sm:text-2xl font-bold text-pink-600 w-10 sm:w-12 text-center">
                    {formData.gianneRating}
                  </span>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-3 sm:p-4">
                <p className="text-center text-xs sm:text-sm text-gray-600">
                  Combined Rating
                </p>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <Star className="text-yellow-500 fill-yellow-500" size={20} />
                  <span className="text-2xl sm:text-3xl font-bold text-purple-600">
                    {formData.jasperRating + formData.gianneRating}/20
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.movieTitle.trim()}
                className="flex-1 px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                Save Movie
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
