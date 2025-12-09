import React, { useState, useEffect } from 'react';
import main_photo from '../assets/main-photo.jpg';
import date1_1 from '../assets/1st-1.jpg';
import date1_2 from '../assets/1st-2.jpg';
import date1_3 from '../assets/1st-3.jpg';

import date2_1 from '../assets/2nd-1.jpg';
import date2_2 from '../assets/2nd-2.jpg';
import date2_3 from '../assets/2nd-3.jpg';
import date2_4 from '../assets/2nd-4.jpg';

import rd_1 from '../assets/rd-1.jpg';
import rd_2 from '../assets/rd-2.jpg';
import rd_3 from '../assets/rd-3.jpg';
import rd_4 from '../assets/rd-4.jpg';
import rd_5 from '../assets/rd-5.jpg';
import rd_6 from '../assets/rd-6.jpg';

import KuromiImg from '../assets/kuromi-bg.png';
import KuromiIm2 from '../assets/kuromi-bg-2.png';

export default function Anniversary() {
  const anniversaryDate = new Date('2024-12-10');
  const daysTogether = Math.floor(
    (Date.now() - anniversaryDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const mainPhoto = main_photo;

  const [firstDateSlide, setFirstDateSlide] = useState(0);
  const [firstTripSlide, setFirstTripSlide] = useState(0);
  const [randomDateSlide, setRandomDateSlide] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showPageConfetti, setShowPageConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPageConfetti(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => {
        setShowCelebration(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showCelebration]);

  const memories = [
    {
      id: 1,
      images: [date1_1, date1_2, date1_3],
      title: 'First Date',
      date: 'April 12 2025',
      description:
        "This was our first date. At first, I was a bit nervous to pick you up in the hotel lobby because I planned to surprise you with gifts and flowers. But thankfully, everything turned out really well. I'll never forget that first date because I was so happy that I finally got to see you, be with you, and eat with you. Do you remember that night I cried? It was so random, and I felt a bit embarrassed because I didn't want to look like a crybaby. I wanted to be the man who protects you.",
    },
    {
      id: 2,
      images: [date2_1, date2_2, date2_3, date2_4],
      title: 'Second Date',
      date: 'July 2 2025',
      description:
        "Our second date. Finally, after a few months, we got to see each other again. Ang haba din ng nilakad natin bago makarating sa hotel, no? But I enjoyed every moment. I don't care how long or how far we walk, as long as I'm with you, I'm happy. I also really enjoyed everything we did that day — the poison challenge, our Netflix date — everything we only used to plan. And sorry if I fell asleep so fast that time, I don't think I even said goodnight or kissed you.",
    },
    {
      id: 3,
      images: [rd_1, rd_2, rd_3, rd_4, rd_5, rd_6],
      title: 'Random BBT',
      date: '2025',
      description:
        'Random bebetime. I know LDR couples usually do this, but I really enjoy our videocalls and movie nights (the way I’ll always stream for you). I want you to know that seeing you makes me happy — whether it is through videocall or the random photos and videos you send me on Messenger.',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setFirstDateSlide((prev) => (prev + 1) % memories[0].images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setFirstTripSlide((prev) => (prev + 1) % memories[1].images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setRandomDateSlide((prev) => (prev + 1) % memories[2].images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100">
      {showPageConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-bounce">
              HAPPY ANNIVERSARY!
            </h1>
          </div>

          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl sm:text-4xl animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * -20}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              {
                ['🎉', '🎊', '✨', '💕', '💖', '💜', '🎈', '⭐', '🎆', '🎇'][
                  Math.floor(Math.random() * 10)
                ]
              }
            </div>
          ))}

          <div
            className="absolute top-1/4 left-10 text-4xl sm:text-6xl animate-spin"
            style={{ animationDuration: '3s' }}
          >
            🎉
          </div>
          <div
            className="absolute top-1/3 right-10 text-4xl sm:text-6xl animate-spin"
            style={{ animationDuration: '3s', animationDelay: '0.5s' }}
          >
            🎊
          </div>
          <div
            className="absolute top-1/2 left-20 text-3xl sm:text-5xl animate-bounce"
            style={{ animationDuration: '2s' }}
          >
            💕
          </div>
          <div
            className="absolute top-1/2 right-20 text-3xl sm:text-5xl animate-bounce"
            style={{ animationDuration: '2s', animationDelay: '0.3s' }}
          >
            💖
          </div>
          <div
            className="absolute top-2/3 left-1/4 text-4xl sm:text-6xl animate-ping"
            style={{ animationDuration: '2s' }}
          >
            ✨
          </div>
          <div
            className="absolute top-2/3 right-1/4 text-4xl sm:text-6xl animate-ping"
            style={{ animationDuration: '2s', animationDelay: '0.5s' }}
          >
            ⭐
          </div>
          <div
            className="absolute bottom-1/4 left-1/3 text-3xl sm:text-5xl animate-pulse"
            style={{ animationDuration: '1.5s' }}
          >
            🎆
          </div>
          <div
            className="absolute bottom-1/4 right-1/3 text-3xl sm:text-5xl animate-pulse"
            style={{ animationDelay: '0.5s', animationDuration: '1.5s' }}
          >
            🎇
          </div>
        </div>
      )}

      <img
        src={KuromiImg}
        className="fixed top-20 left-4 w-12 h-12 lg:w-24 lg:h-24 opacity-40 pointer-events-none" // Smaller on mobile
        alt=""
      />
      <img
        src={KuromiIm2}
        className="fixed top-1/2 right-4 w-10 h-10 lg:w-16 lg:h-16 opacity-40 pointer-events-none" // Smaller on mobile
        alt=""
      />
      <img
        src={KuromiImg}
        className="fixed bottom-1/3 left-4 w-10 h-10 lg:w-16 lg:h-16 opacity-30 pointer-events-none" // Smaller on mobile
        alt=""
      />
      <img
        src={KuromiIm2}
        className="fixed bottom-10 right-4 w-12 h-12 lg:w-24 lg:h-24 opacity-40 pointer-events-none" // Smaller on mobile
        alt=""
      />

      <section className="container mx-auto px-4 py-12 lg:px-6 lg:py-16">
        {' '}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {' '}
          <div className="lg:w-1/2 flex justify-center w-full">
            {' '}
            <div className="relative group">
              <div className="absolute -inset-2 sm:-inset-4 bg-white rounded-3xl shadow-2xl transform -rotate-2"></div>{' '}
              <div className="relative bg-white p-2 sm:p-4 rounded-3xl shadow-xl transition-transform duration-500 group-hover:-translate-y-2">
                {' '}
                <img
                  src={mainPhoto}
                  alt="Us"
                  className="w-64 h-80 sm:w-80 sm:h-96 lg:w-96 lg:h-[500px] object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 space-y-4 lg:space-y-6 w-full mt-8 lg:mt-0">
            {' '}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl font-serif text-purple-900 mb-4">
                {' '}
                Our Journey Together
              </h1>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg">
                {' '}
                <p className="text-5xl sm:text-6xl font-bold text-pink-600 mb-2">
                  {' '}
                  {daysTogether}
                </p>
                <p className="text-lg sm:text-xl text-purple-800">
                  {' '}
                  days of love and counting
                </p>
                <p className="text-xs sm:text-sm text-purple-600 mt-2">
                  Since December 10, 2024
                </p>
              </div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <p className="text-purple-900 leading-relaxed text-base sm:text-xl">
                {' '}
                Happy anniversary, babe! 🎉{' '}
              </p>
              <br className="sm:hidden"></br>{' '}
              <p className="text-purple-900 leading-relaxed text-sm sm:text-base">
                {' '}
                Yun oh, umabot tayo ng 1 year! HAHAHAHAH yiee. From "Hi,
                gianne!" to now — who would've thought na yung ka-kornihan ko
                that day would lead us here? Endless conversations, video calls,
                movie nights — ano pa bang hihilingin ko, diba? You're
                everything I could ask for and more. Thank you for being my
                person. Here's to all the memories we've made and all the ones
                still to come. I love you so much! 💜 Scroll ka lang dyan
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-center items-center gap-4 my-8 lg:my-12">
        {' '}
        <div className="h-px w-20 sm:w-32 bg-gradient-to-r from-transparent to-pink-300"></div>{' '}
        <span className="text-3xl">💕</span>
        <div className="h-px w-20 sm:w-32 bg-gradient-to-l from-transparent to-pink-300"></div>{' '}
      </div>

      <section className="container mx-auto px-4 py-8 lg:px-6 lg:py-12">
        {' '}
        <h2 className="text-3xl sm:text-4xl font-serif text-purple-900 text-center mb-8 lg:mb-12">
          {' '}
          Our Beautiful Memories
        </h2>
        <div className="space-y-12 lg:space-y-16">
          {' '}
          {memories.map((memory, index) => {
            const hasSlideshow = memory.images && memory.images.length > 0;
            const currentSlide =
              index === 0
                ? firstDateSlide
                : index === 1
                ? firstTripSlide
                : index === 2
                ? randomDateSlide
                : 0;

            return (
              <div
                key={memory.id}
                className={`flex flex-col items-center gap-6 lg:gap-8 ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                <div className="lg:w-1/2 flex justify-center w-full">
                  {' '}
                  <div className="relative group">
                    <div className="absolute -inset-2 sm:-inset-3 bg-white rounded-2xl shadow-xl transform rotate-1"></div>{' '}
                    <div className="relative bg-white p-2 sm:p-3 rounded-2xl shadow-lg transition-transform duration-500 group-hover:scale-105">
                      {' '}
                      {hasSlideshow ? (
                        <>
                          <div className="relative w-72 h-96 lg:w-72 lg:h-96 overflow-hidden rounded-xl">
                            {' '}
                            {memory.images.map((img, imgIndex) => (
                              <img
                                key={imgIndex}
                                src={img}
                                alt={`${memory.title} ${imgIndex + 1}`}
                                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                                  imgIndex === currentSlide
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                }`}
                              />
                            ))}
                          </div>

                          <div className="flex justify-center gap-2 mt-3">
                            {memory.images.map((_, imgIndex) => (
                              <button
                                key={imgIndex}
                                onClick={() => {
                                  if (index === 0) setFirstDateSlide(imgIndex);
                                  if (index === 1) setFirstTripSlide(imgIndex);
                                  if (index === 2) setRandomDateSlide(imgIndex);
                                }}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                  imgIndex === currentSlide
                                    ? 'bg-pink-600 w-6'
                                    : 'bg-purple-300 hover:bg-purple-400'
                                }`}
                                aria-label={`Go to ${memory.title} photo ${
                                  imgIndex + 1
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      ) : (
                        <img
                          src={memory.image}
                          alt={memory.title}
                          className="w-72 h-96 object-cover rounded-xl"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="lg:w-1/2 w-full">
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg">
                    {' '}
                    <span className="inline-block px-3 py-1 bg-pink-200 text-purple-800 rounded-full text-xs sm:text-sm font-medium mb-3">
                      {' '}
                      {memory.date}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-serif text-purple-900 mb-3 sm:mb-4">
                      {' '}
                      {memory.title}
                    </h3>
                    <p className="text-purple-800 leading-relaxed text-sm sm:text-base text-justify">
                      {' '}
                      {memory.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 lg:px-6 lg:py-16">
        {' '}
        <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-12">
          {' '}
          <h2 className="text-3xl sm:text-4xl font-serif text-purple-900 text-center mb-6 sm:mb-8">
            {' '}
            A Letter to You
          </h2>
          <div className="prose prose-sm sm:prose-lg text-purple-900 space-y-4">
            {' '}
            <p>My dearest love,</p>
            <p className="text-justify">
              I don't even know how to explain it, but life has been so great
              since I met you. I really thank God na nakilala kita, and thank
              you din kina Allison and Red—HAHAHA—because if it weren't for
              them, hindi talaga kita makikilala.
            </p>
            <p className="text-justify">
              I don't regret making the first move and messaging you. It was all
              worth it. Dati natatakot ako mag-commit sa LDR, but you made me
              try. You made me believe it could work.
            </p>
            <p className="text-justify">
              Thank you for always being there for me. For cheering me up when
              I'm studying, for being patient, for being understanding, and for
              reminding me of reality when I feel pressured. You make things
              easier just by being you.
            </p>
            <p className="text-justify">
              And I'm sorry for the times I'm not at my best. I know things can
              get tough, lalo na LDR tayo, but I promise you one thing—I'll
              never leave you. I'll always try to be a better boyfriend for you.
              I know we can overcome any problem as long as we're together.
            </p>
            <p className="text-justify">
              Let's make more memories, more moments, and more years together. I
              love you, babe.
            </p>
          </div>
          <div className="flex justify-center mt-6 sm:mt-8">
            <button
              onClick={() => setShowCelebration(true)}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-lg font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-pulse hidden sm:block"
            >
              🎉 Click Me! 🎉
            </button>
          </div>
        </div>
      </section>

      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative">
            <div className="bg-white rounded-3xl p-12 shadow-2xl animate-bounce">
              <h1 className="text-6xl lg:text-8xl font-bold text-center bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
                HAPPY ANNIVERSARY!
              </h1>
              <p className="text-2xl text-center text-purple-800 font-serif">
                I love you so much! 💕
              </p>
            </div>

            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div
                className="absolute top-0 left-10 text-6xl animate-bounce"
                style={{ animationDelay: '0s', animationDuration: '2s' }}
              >
                🎈
              </div>
              <div
                className="absolute top-20 right-10 text-6xl animate-bounce"
                style={{ animationDelay: '0.3s', animationDuration: '2.5s' }}
              >
                🎈
              </div>
              <div
                className="absolute bottom-20 left-20 text-6xl animate-bounce"
                style={{ animationDelay: '0.6s', animationDuration: '2.2s' }}
              >
                🎈
              </div>

              <div
                className="absolute top-10 right-32 text-5xl animate-ping"
                style={{ animationDuration: '2s' }}
              >
                💕
              </div>
              <div
                className="absolute bottom-32 right-10 text-5xl animate-ping"
                style={{ animationDelay: '0.5s', animationDuration: '2s' }}
              >
                💖
              </div>
              <div
                className="absolute top-32 left-32 text-5xl animate-ping"
                style={{ animationDelay: '1s', animationDuration: '2s' }}
              >
                💜
              </div>

              <div
                className="absolute top-40 left-10 text-5xl animate-spin"
                style={{ animationDuration: '3s' }}
              >
                🎉
              </div>
              <div
                className="absolute bottom-10 right-32 text-5xl animate-spin"
                style={{ animationDelay: '0.5s', animationDuration: '3s' }}
              >
                🎊
              </div>

              <div
                className="absolute top-5 left-1/4 text-4xl animate-bounce"
                style={{ animationDuration: '1.5s' }}
              >
                ✨
              </div>
              <div
                className="absolute top-16 right-1/4 text-4xl animate-bounce"
                style={{ animationDelay: '0.3s', animationDuration: '1.8s' }}
              >
                ✨
              </div>
              <div
                className="absolute bottom-16 left-1/3 text-4xl animate-bounce"
                style={{ animationDelay: '0.6s', animationDuration: '1.6s' }}
              >
                ⭐
              </div>

              <div
                className="absolute top-8 left-1/2 text-6xl animate-pulse"
                style={{ animationDuration: '1s' }}
              >
                🎆
              </div>
              <div
                className="absolute bottom-8 right-1/2 text-6xl animate-pulse"
                style={{ animationDelay: '0.5s', animationDuration: '1s' }}
              >
                🎇
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center pb-8 lg:pb-12">
        {' '}
        <div className="flex gap-3">
          <span className="text-xl sm:text-2xl opacity-60">💚</span>{' '}
          <span className="text-2xl sm:text-3xl opacity-80">💕</span>{' '}
          <span className="text-xl sm:text-2xl opacity-60">💜</span>{' '}
        </div>
      </div>
    </div>
  );
}
