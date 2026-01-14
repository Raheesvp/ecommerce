import React, { useState } from "react";
import { Send, ShieldCheck, BellRing } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("loading");
    
    // Simulating API call
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 2000);
  };

  return (
    <section className="py-20 bg-gray-950 border-t border-white/5 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-red-600/5 blur-[120px] rounded-full"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side: Content */}
          <div>
            <div className="flex items-center gap-2 text-red-600 mb-4">
              <BellRing className="w-6 h-6 animate-bounce" />
              <span className="text-sm font-black tracking-widest uppercase italic">Early Access</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight uppercase italic mb-6">
              Join the <span className="text-red-600">Wolf Pack</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-md">
              Be the first to know about **limited edition drops**, kit restocks, and exclusive **VIP discounts**.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-red-600" />
                <span className="text-xs font-bold text-gray-500 uppercase">No Spam Policy</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-red-600" />
                <span className="text-xs font-bold text-gray-500 uppercase">Secure Data</span>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="relative">
            {status === "success" ? (
              <div className="bg-red-600/10 border border-red-600/50 p-10 rounded-3xl text-center animate-pulse">
                <h3 className="text-2xl font-black text-white mb-2">YOU'RE IN!</h3>
                <p className="text-red-500 font-bold">Check your inbox for your 10% discount code.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  required
                  placeholder="ENTER YOUR EMAIL"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white font-bold focus:outline-none focus:border-red-600 transition-all placeholder:text-gray-600"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="bg-red-600 hover:bg-red-700 text-white px-10 py-5 rounded-2xl font-black italic tracking-widest flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {status === "loading" ? "SYNCING..." : "JOIN NOW"}
                  <Send className="w-5 h-5" />
                </button>
              </form>
            )}
            <p className="mt-4 text-[10px] text-gray-600 text-center lg:text-left uppercase font-bold tracking-widest">
              By joining, you agree to our <span className="text-gray-400 underline cursor-pointer">Privacy Policy</span>.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Newsletter;