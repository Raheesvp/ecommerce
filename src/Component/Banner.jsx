// import React from 'react';

const Banner = () => {
  // Hardcoded banner data for demonstration.
  // In a real application, you would fetch this from your C# backend.
  const bannerData = {
    title: "Wolf atletics",
    subtitle: "OFFICIAL KITS. UNRIVALLED PERFORMANCE. 2026 SEASON.",
    btnText: "SHOP THE NEW COLLECTION",
    btnLink: "/products",
    // Using a high-quality image of the Real Madrid 2026 kit as discussed
    backgroundImage: "https://images.footballfanatics.com/real-madrid/real-madrid-2023-24-home-authentic-shirt_ss4_p-13396593+u-581v2d65942+v-335df869d8ae415893a7e4b986e6659f.jpg?_ixlib=rb-3.1.0&ch=Width%2CHeight&auto=format&fit=crop&fm=webp&q=70&w=600&h=800",
    badge: "2026 NEW DROPS"
  };

  return (
    <section 
      className="relative h-screen md:h-[calc(100vh-80px)] bg-cover bg-center flex items-center justify-center text-white"
      style={{ backgroundImage: `url(${bannerData.backgroundImage})` }}
    >
      {/* Dark Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
      
      {/* Content Container */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        
        {/* Badge */}
        {bannerData.badge && (
          <span className="inline-block bg-red-600 text-white text-xs md:text-sm font-black italic px-4 py-2 rounded-full uppercase tracking-widest mb-6 shadow-lg transform -rotate-1 skew-y-1">
            {bannerData.badge}
          </span>
        )}

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black italic uppercase leading-tight mb-4 drop-shadow-2xl">
          {bannerData.title}
        </h1>

        {/* Sub-headline */}
        <p className="text-base sm:text-lg md:text-xl font-bold text-gray-300 max-w-2xl mx-auto mb-8 tracking-wide">
          {bannerData.subtitle}
        </p>

        {/* Call to Action Button */}
        <a 
          href={bannerData.btnLink}
          className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white text-base md:text-lg font-black italic uppercase px-8 md:px-12 py-4 md:py-5 rounded-full shadow-2xl tracking-wider transform hover:scale-105 transition-all duration-300"
        >
          {bannerData.btnText}
          <svg className="ml-3 w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
            <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
          </svg>
        </a>
      </div>
    </section>
  );
};

export default Banner;