import React from 'react';
import {
  Trophy,
  Shield,
  Users,
  Target,
  Award,
  Heart,
  CheckCircle,
  Zap,
  Globe,
  ShoppingBag,
  ArrowRight,
  TrendingUp,
  Cpu
} from 'lucide-react';

const AboutPage = () => {
  const features = [
    {
      icon: Target,
      title: "Precision Engineering",
      description: "Every piece of gear is stress-tested for maximum performance metrics."
    },
    {
      icon: Shield,
      title: "Elite Quality",
      description: "Only aerospace-grade materials and reinforced construction techniques."
    },
    {
      icon: Cpu,
      title: "Innovation Driven",
      description: "Constantly pushing boundaries with proprietary tech and kinetics."
    },
    {
      icon: Users,
      title: "The Pack First",
      description: "Built by elite athletes, for the global community of competitors."
    }
  ];

  const stats = [
    { number: "50K+", label: "Athletes Equipped" },
    { number: "100+", label: "Pro Partnerships" },
    { number: "15", label: "Global Hubs" },
    { number: "24/7", label: "Ops Support" }
  ];

  const values = [
    {
      icon: Trophy,
      title: "Excellence",
      description: "We never settle for baseline; we only recognize the podium."
    },
    {
      icon: Heart,
      title: "Obsession",
      description: "Driven by an unrelenting love for the game and its evolution."
    },
    {
      icon: TrendingUp,
      title: "Progression",
      description: "Evolving daily to meet the tactical needs of modern sport."
    },
    {
      icon: Globe,
      title: "Dominance",
      description: "Building a global legacy of victory and superior gear."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-red-500/30 font-sans pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 border-b border-white/5 bg-gradient-to-b from-red-900/10 via-transparent to-transparent overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-[120px] -mr-48 -mt-48"></div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in">
            <Award size={16} className="text-red-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Official Strategic Briefing</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none mb-8">
            The <span className="text-red-600">Evolution</span> <br /> of Performance
          </h1>

          <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto font-medium leading-relaxed mb-16">
            Wolf Athletix isn't just a brand—it's a high-performance infrastructure designed to 
            equip the next generation of <span className="text-white">tactical athletes</span>.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="group p-6 bg-[#111] rounded-3xl border border-white/5 hover:border-red-500/30 transition-all duration-500 backdrop-blur-xl">
                <div className="text-3xl md:text-4xl font-black italic text-red-600 mb-1 group-hover:scale-110 transition-transform tracking-tighter">
                  {stat.number}
                </div>
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-16 relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Target size={200} className="text-red-600" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-red-600 rounded-2xl rotate-3 shadow-lg shadow-red-900/20">
                   <Target className="text-white" size={32} />
                </div>
                <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white">
                  Our <span className="text-red-600">Directive</span>
                </h2>
              </div>
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-medium max-w-4xl">
                At <span className="text-red-600 font-black italic uppercase">Wolf Athletix</span>, we believe that elite performance 
                is non-negotiable. Our mission is to engineer the world’s most advanced gear for 
                competitors who refuse to stay in the middle of the pack. We provide the 
                <span className="text-white"> kinetic advantage</span> required for victory.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter mb-4">
                The Wolf <span className="text-red-600">Standard</span>
             </h2>
             <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">What sets the Armory apart from the competition</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="group bg-[#111] border border-white/5 p-8 rounded-[2.5rem] hover:border-red-500/20 transition-all duration-500">
                <div className="w-14 h-14 bg-red-600/10 border border-red-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <feature.icon className="text-red-600" size={28} />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight mb-3 italic text-white">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#111] border border-white/5 rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row gap-16 items-center shadow-2xl">
            <div className="lg:w-1/2">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                   <ShoppingBag className="text-red-600" size={32} />
                </div>
                <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter">
                  Strategic <span className="text-red-600">UI</span>
                </h2>
              </div>
              <p className="text-gray-400 font-medium leading-relaxed mb-8">
                Our platform is engineered for speed. We’ve eliminated friction from the deployment 
                process so you can focus on the field. This is more than a store—it's your 
                tactical supply chain.
              </p>
              <div className="grid grid-cols-1 gap-4">
                 {['Intuitive Navigation', 'Kinetic Data Specs', 'Encrypted Checkout', '24/7 Logistics'].map((text, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                       <CheckCircle size={18} className="text-green-500" />
                       <span className="text-[10px] font-black uppercase tracking-widest">{text}</span>
                    </div>
                 ))}
              </div>
            </div>
            
            <div className="lg:w-1/2 relative">
               <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-red-600/20 to-transparent border border-white/10 flex items-center justify-center p-8">
                  <Zap size={150} className="text-red-600 animate-pulse" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter mb-4">
              Core <span className="text-red-600">Values</span>
            </h2>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">The DNA of Wolf Athletix</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="relative w-24 h-24 mx-auto mb-8">
                  <div className="absolute inset-0 bg-red-600 rounded-3xl rotate-6 opacity-20 group-hover:rotate-12 transition-transform duration-500"></div>
                  <div className="absolute inset-0 bg-[#111] border border-white/5 rounded-3xl flex items-center justify-center shadow-2xl">
                    <value.icon className="text-red-600" size={36} />
                  </div>
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-white mb-3 italic">{value.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Design */}
      <footer className="mt-24 pt-16 border-t border-white/5 text-center px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-xl md:text-3xl font-black italic uppercase tracking-tighter text-gray-500 mb-8 leading-tight">
            Thank you for joining <span className="text-red-600">The Pack</span>. <br />
            Let's redefine the baseline of excellence.
          </p>
          <div className="flex justify-center gap-8 text-[10px] font-black uppercase tracking-[0.4em] text-gray-700">
             <span>Speed</span>
             <span>Obsession</span>
             <span>Victory</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;