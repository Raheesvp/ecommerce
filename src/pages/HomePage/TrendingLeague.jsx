import React from "react";
import { Trophy, ChevronRight } from "lucide-react";

const TrendingLeagues = () => {
  const leagues = [
    { 
      name: "Premier League", 
      country: "England",
      logo: "https://images.seeklogo.com/logo-png/29/1/premier-league-logo-png_seeklogo-291822.png",
      color: "hover:border-purple-500"
    },
    { 
      name: "La Liga", 
      country: "Spain",
      logo: "https://images.seeklogo.com/logo-png/48/1/la-liga-logo-png_seeklogo-480414.png",
      color: "hover:border-yellow-500"
    },
    { 
      name: "Bundesliga", 
      country: "Germany",
      logo: "https://upload.wikimedia.org/wikipedia/en/d/df/Bundesliga_logo_%282017%29.svg",
      color: "hover:border-red-600"
    },
    { 
      name: "Serie A", 
      country: "Italy",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/a/ab/Serie_A_ENILIVE_logo.svg/800px-Serie_A_ENILIVE_logo.svg.png",
      color: "hover:border-blue-600"
    },
    { 
      name: "Ligue 1", 
      country: "France",
      logo: "https://images.seeklogo.com/logo-png/53/1/ligue-1-logo-png_seeklogo-535794.png",
      color: "hover:border-green-500"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-600/10 rounded-2xl">
              <Trophy className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter">
              Trending <span className="text-red-600">Leagues</span>
            </h2>
          </div>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {leagues.map((league, index) => (
            <div 
              key={index}
              className={`group relative bg-gray-900/50 border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center transition-all duration-500 cursor-pointer ${league.color} hover:bg-gray-900 hover:-translate-y-2 shadow-xl`}
            >
              {/* Logo with Glow Effect */}
              <div className="relative w-20 h-20 md:w-24 md:h-24 mb-6 flex items-center justify-center">
                <div className="absolute inset-0 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors"></div>
                <img 
                  src={league.logo} 
                  alt={league.name} 
                  className="relative w-full h-full object-contain filter brightness-110 group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Text Info */}
              <div className="text-center">
                <h3 className="text-white font-black italic uppercase tracking-widest text-sm md:text-base">
                  {league.name}
                </h3>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                  {league.country}
                </p>
              </div>

              {/* View Icon */}
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-5 h-5 text-red-600" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingLeagues;