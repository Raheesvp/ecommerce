import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';

const Banner = () => {
 const bannerImages = [
  "https://images.unsplash.com/photo-1570498839593-e565b39455fc?auto=format&fit=crop&q=80&w=1920", // Player kicking ball in rain
  "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80&w=1920", // Close up of professional soccer player
  "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=1920", // Emotional match moment in stadium
  "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=1920", // Match day action focus
  "https://images.unsplash.com/photo-1510564417430-67c4e41d827b?auto=format&fit=crop&q=80&w=1920", // Detailed kit and ball action
  "https://images.unsplash.com/photo-1552667466-07770ae110d0?auto=format&fit=crop&q=80&w=1920"  // Dynamic player celebration
];

  const content = {
    title: "Wolf Athletix",
    subtitle: "OFFICIAL KITS. UNRIVALLED PERFORMANCE",
    btnText: "SHOP THE NEW COLLECTION",
    btnLink: "/products",
   
  };

  return (
    <section className="relative h-screen md:h-[calc(100vh-80px)] overflow-hidden bg-black">
      {/* Background Slider */}
      <div className="absolute inset-0 z-0">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          className="h-full w-full"
        >
          {bannerImages.map((img, index) => (
            <SwiperSlide key={index}>
              <div 
                className="h-full w-full bg-cover bg-center transition-transform duration-[5000ms] scale-110"
                style={{ 
                    backgroundImage: `url(${img})`,
                    animation: 'kenburns 10s infinite alternate' 
                }}
              >
                {/* Dark Overlay inside Slide */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      
      {/* Static Content Overlay */}
      <div className="relative z-10 h-full flex items-center justify-center text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          
          {/* Badge */}
          {content.badge && (
            <span className="inline-block bg-red-600 text-white text-xs md:text-sm font-black italic px-4 py-2 rounded-full uppercase tracking-widest mb-6 shadow-lg transform -rotate-1 skew-y-1 animate-bounce">
              {content.badge}
            </span>
          )}

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black italic uppercase leading-tight mb-4 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
            {content.title}
          </h1>

          {/* Sub-headline */}
          <p className="text-base sm:text-lg md:text-xl font-bold text-gray-200 max-w-2xl mx-auto mb-8 tracking-wide drop-shadow-md">
            {content.subtitle}
          </p>

          {/* Call to Action Button */}
          <a 
            href={content.btnLink}
            className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white text-base md:text-lg font-black italic uppercase px-8 md:px-12 py-4 md:py-5 rounded-full shadow-2xl tracking-wider transform hover:scale-105 transition-all duration-300 active:scale-95"
          >
            {content.btnText}
            <svg className="ml-3 w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
            </svg>
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes kenburns {
          from { transform: scale(1); }
          to { transform: scale(1.15); }
        }
      `}</style>
    </section>
  );
};

export default Banner;