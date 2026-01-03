import React, { useState, useEffect } from 'react';
import NewYearPhoto from '../assets/new-year-photo.jpg';
import cat_bg_1 from '../assets/cat-bg-1.png';
import cat_bg_2 from '../assets/cat-bg-2.png';

export default function NewYear() {
  const [showFireworks, setShowFireworks] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFireworks(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {showFireworks && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            >
              {['✨', '🎆', '🎇', '💫', '⭐'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <img
        src={cat_bg_1}
        className="hidden lg:block fixed top-24 left-10 w-20 h-20 lg:w-24 lg:h-24 opacity-20 pointer-events-none"
        alt=""
      />
      <img
        src={cat_bg_2}
        className="hidden lg:block fixed top-1/2 right-10 w-14 h-14 lg:w-16 lg:h-16 opacity-20 pointer-events-none"
        alt=""
      />

      <div className="absolute top-10 left-20 text-yellow-300 text-3xl animate-bounce opacity-60">
        ⭐
      </div>
      <div className="absolute top-32 right-32 text-yellow-200 text-4xl animate-pulse opacity-50">
        ✨
      </div>
      <div
        className="absolute bottom-40 left-40 text-yellow-300 text-3xl animate-bounce opacity-60"
        style={{ animationDelay: '1s' }}
      >
        🌟
      </div>
      <div
        className="absolute bottom-20 right-20 text-yellow-200 text-4xl animate-pulse opacity-50"
        style={{ animationDelay: '0.5s' }}
      >
        💫
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-20 py-12 relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-pink-300 to-purple-300 mb-4 animate-pulse">
            HAPPY NEW YEAR 2026!
          </h1>
          <p className="text-xl sm:text-2xl text-yellow-100 font-light">
            🎉 A Fresh Start, A New Chapter 🎊
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-3xl opacity-75 blur-xl animate-pulse"></div>
            <div className="relative bg-white p-3 sm:p-4 rounded-3xl shadow-2xl transition-transform duration-500 hover:scale-105">
              <img
                src={NewYearPhoto}
                alt="Us - New Year"
                className="w-80 h-96 sm:w-96 sm:h-[500px] lg:w-[500px] lg:h-[600px] object-cover rounded-2xl"
              />
            </div>

            <span
              className="absolute -top-4 -left-4 text-5xl animate-spin"
              style={{ animationDuration: '3s' }}
            >
              ✨
            </span>
            <span
              className="absolute -top-4 -right-4 text-5xl animate-spin"
              style={{ animationDuration: '3s', animationDelay: '1s' }}
            >
              🎆
            </span>
            <span className="absolute -bottom-4 -left-4 text-5xl animate-bounce">
              🎊
            </span>
            <span
              className="absolute -bottom-4 -right-4 text-5xl animate-bounce"
              style={{ animationDelay: '0.5s' }}
            >
              🎉
            </span>
          </div>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-6 sm:p-10 lg:p-12 border-4 border-yellow-300">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
                A Letter to You
              </h2>
              <div className="flex justify-center gap-2">
                <span className="text-2xl">💌</span>
                <span className="text-2xl">💕</span>
                <span className="text-2xl">💌</span>
              </div>
            </div>

            <div className="prose prose-lg max-w-none space-y-6 text-gray-800">
              <p className="text-justify leading-relaxed">
                Before this year ends, gusto ko lang sabihin na-
              </p>

              <p className="text-justify leading-relaxed">
                Thank you kasi, ikaw pa rin yung kasama ko habang papatapos na
                yung taon na 'to. From when we started talking in December 2024
                to all the moments we shared throughout 2025, each of them
                became a meaningful part of my life that I truly cherish.
              </p>

              <p className="text-justify leading-relaxed">
                Thank you for always being there for me, sa pagiging patient,
                forgiving, and for always supporting me. Thank you for loving
                me, even on days na hindi ako madaling mahalin, at sa lahat ng
                ways na pinapasaya mo ako.
              </p>

              <p className="text-justify leading-relaxed">
                Sobrang grateful din ako sa mga memories na nabuo natin this
                2025. Kahit twice lang tayo nagkita this year, tine-treasure ko
                yon nang sobra kasi alam ko na hindi lahat ng couples na nasa
                LDR ay nabibigyan ng chance na magkita. So every moment we
                shared, kahit saglit lang, naging special for me.
              </p>

              <p className="text-justify leading-relaxed">
                This year taught me a lot about love, patience, at kung ano
                talaga yung ibig sabihin ng mag-care ng totoo para sa isang tao.
                Even with the distance between us, you’ve made my days lighter
                and my heart feel complete. Our simplest moments become special,
                and I cherish every bit of the effort and love you give.
              </p>

              <p className="text-justify leading-relaxed">
                I'll be honest, alam kong hindi naging perfect yung taon na to,
                and alam kong may mga times na nag kulang ako. Pero lahat nang
                yon, naging part ng natutunan ko this year, and naging dahilan
                para mas ayusin ko pa yung sarili ko para sa relationship natin.
              </p>

              <p className="text-justify leading-relaxed">
                As we welcome 2026, i want you to know na mahal na mahal kita,
                and ikaw pa rin yung gusto kong makasama sa mga susunod na taon.
                Alam kong marami pa akong kailangang ayusin at pagdaanan, pero
                gusto kong mag-grow kasama ka. Gusto kong maging mas present, at
                maging mas consistent sa pag show ko ng love for you.
              </p>

              <p className="text-justify leading-relaxed">
                Sigurado na ako sa’yo. Ikaw yung taong gusto kong makasama
                hanggang dulo. Sana palagi nating piliin ang isa’t isa, kahit
                pagod, kahit mahirap, kahit hindi perfect ang lahat. I don't
                wanna lose you babe, I can't imagine being with another woman.
              </p>

              <p className="text-justify leading-relaxed">
                Sana sa 2026, matupad yung mga pinag pray natin nitong 2025.
                Sana pareho na tayong magka-work. Sobrang magiging masaya ako
                kapag pareho na tayong working, hindi lang dahil mas madalas na
                tayong magkikita, kundi dahil makikita kitang natutupad yung mga
                gusto mo para sa sarili mo. At para sa’kin, yun din yung time na
                kaya ko nang gawing mas official ang lahat—harapin yung family
                mo, makilala sila, at finally, yung relationship natin.
              </p>

              <p className="text-justify leading-relaxed">
                Sana matupad din natin yung mga gusto natin gawin together, yung
                mga kinds of dates na gusto natin maranasan, or mga places na
                gustong mapuntahan. Sana mas maraming memories pa tayo magawa.
              </p>

              <p className="text-justify leading-relaxed">
                At sana sa 2026, mas maging comfortable pa tayo sa isa't isa,
                mas maging strong, mas maging patient, at mas maging malalim pa
                yung relationship natin. Thank you for being my constant, my
                comfort, for being my everything. I love you so much, babe!
              </p>

              <p className="text-justify leading-relaxed">
                Here's to us, to our love story, and to all the beautiful
                chapters still waiting to be written. Happy New Year, babe! 🎆💕
              </p>

              <div className="text-right mt-8 pt-6 border-t-2 border-purple-200">
                <p className="text-lg">Forever yours,</p>
                <p className="text-xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mt-2">
                  Jasper 💜
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-12 text-4xl sm:text-5xl">
          <span className="animate-bounce">🎊</span>
          <span className="animate-pulse">🎉</span>
          <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>
            ✨
          </span>
          <span className="animate-pulse" style={{ animationDelay: '0.3s' }}>
            🎆
          </span>
          <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>
            💕
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
}
