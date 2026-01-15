import React from 'react';

const PageLayout = ({ children, title }) => (
  <div className="min-h-screen bg-[#050505] text-gray-100 selection:bg-red-500/30 font-sans">
    
    {/* --- GLOBAL DESIGN ELEMENTS --- */}
    {/* Subtle Red Ambient Glows */}
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-red-900/10 blur-[140px]" />
      <div className="absolute top-[20%] -right-[10%] w-[30%] h-[40%] rounded-full bg-red-600/5 blur-[120px]" />
    </div>

    {/* --- LAYOUT CONTAINER --- */}
    <div className="relative z-10 max-w-[1440px] mx-auto pt-28 pb-16 px-4 sm:px-8">
      
      {/* Header with Hero Title */}
      {title && (
        <div className="mb-12 flex flex-col items-start">
          <span className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em] mb-2 px-1">
            Authorized Only
          </span>
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">
            {title}
          </h1>
          <div className="h-[2px] w-24 bg-gradient-to-r from-red-600 to-transparent mt-4"></div>
        </div>
      )}

      {/* --- GRID SYSTEM --- */}
      {/* lg:grid-cols-4 defines 4 equal columns. 
          Sidebar uses 1 column (lg:col-span-1).
          Main content uses 3 columns (lg:col-span-3).
      */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {children}
      </div>
    </div>

    {/* Custom Scrollbar Styling (Global CSS Inject) */}
    <style jsx="true" global="true">{`
      ::-webkit-scrollbar {
        width: 6px;
      }
      ::-webkit-scrollbar-track {
        background: #0a0a0a;
      }
      ::-webkit-scrollbar-thumb {
        background: #333;
        border-radius: 10px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: #dc2626;
      }
    `}</style>
  </div>
);

export default PageLayout;