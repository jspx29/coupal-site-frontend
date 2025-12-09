import React from 'react';
import { Link } from 'react-router-dom';
import HeroImage from '../assets/home_us.jpg';
import KuromiImg from '../assets/kuromi-bg.png';
import KuromiIm2 from '../assets/kuromi-bg-2.png';

export default function Landing() {
  return (
    <section className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 flex items-center">
      <img
        src={KuromiImg}
        className="hidden lg:block fixed top-24 left-10 w-20 h-20 lg:w-24 lg:h-24 opacity-40 pointer-events-none"
        alt=""
      />
      <img
        src={KuromiIm2}
        className="hidden lg:block fixed top-1/2 right-10 w-14 h-14 lg:w-16 lg:h-16 opacity-40 pointer-events-none"
        alt=""
      />
      <img
        src={KuromiImg}
        className="hidden lg:block fixed bottom-1/3 left-20 w-14 h-14 lg:w-16 lg:h-16 opacity-30 pointer-events-none"
        alt=""
      />
      <img
        src={KuromiIm2}
        className="hidden lg:block fixed bottom-10 right-24 w-20 h-20 lg:w-24 lg:h-24 opacity-40 pointer-events-none"
        alt=""
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-20 flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative z-10 py-8 lg:py-0">
        <div className="w-full lg:w-1/2 flex flex-col gap-4 lg:gap-6 text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-purple-900 leading-tight tracking-wide">
            LIFE IS MORE
            <br />
            <span className="text-pink-600">COLORFUL WITH YOU</span>
          </h1>

          <h3 className="text-xs sm:text-sm lg:text-base text-purple-800 tracking-widest uppercase font-light">
            You make everything better
          </h3>

          <p className="text-purple-900 text-sm sm:text-base leading-relaxed max-w-md opacity-90 mx-auto lg:mx-0">
            A collection of our favorite moments, inside jokes, and memories
            together.
          </p>

          <Link
            to="/about"
            className="mt-2 lg:mt-4 px-6 sm:px-8 py-2 sm:py-3 bg-purple-900 text-pink-50 rounded-md hover:bg-purple-800 transition-all duration-300 self-center lg:self-start font-light tracking-wider text-sm inline-block"
          >
            Ask about us
          </Link>
        </div>

        <div className="w-full lg:w-1/2 flex justify-center relative">
          <div className="relative transition-transform duration-500 hover:-translate-y-3 hover:scale-105 cursor-pointer">
            <div className="absolute -inset-3 sm:-inset-4 bg-white rounded-2xl sm:rounded-3xl shadow-2xl transform rotate-2"></div>

            <div className="relative bg-white p-2 sm:p-3 rounded-2xl sm:rounded-3xl shadow-xl">
              <img
                src={HeroImage}
                alt="Couple"
                className="w-64 h-80 sm:w-72 sm:h-80 lg:w-80 lg:h-96 object-cover rounded-xl sm:rounded-2xl"
              />
            </div>

            <div className="absolute -bottom-5 sm:-bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 sm:gap-4 bg-purple-900 px-4 sm:px-8 py-2 sm:py-3 rounded-full shadow-lg">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-pink-100 rounded-full flex items-center justify-center">
                <span className="text-purple-900 text-xs">❤️</span>
              </div>
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-pink-100 rounded-full flex items-center justify-center">
                <span className="text-purple-900 text-xs">📷</span>
              </div>
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-pink-100 rounded-full flex items-center justify-center">
                <span className="text-purple-900 text-xs">💑</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
