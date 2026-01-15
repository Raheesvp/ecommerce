import React from "react";

const ProfileLoader = () => {
  return (
    <div className="flex flex-col gap-8 p-4 animate-pulse">
      {/* Tactical Avatar Skeleton */}
      <div className="relative mx-auto">
        <div className="w-32 h-32 rounded-full bg-white/5 border-2 border-white/5" />
        <div className="absolute inset-0 bg-red-600/10 rounded-full blur-xl" />
      </div>

      {/* Header Skeleton */}
      <div className="space-y-3">
        <div className="h-2 w-24 bg-red-900/30 rounded-full" /> {/* Sector Label */}
        <div className="h-10 w-64 bg-white/5 rounded-xl italic" /> {/* Title */}
      </div>

      {/* Info Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-black/40 border border-white/5 rounded-2xl p-5 space-y-3">
            <div className="h-2 w-20 bg-white/10 rounded-full" /> {/* Small Label */}
            <div className="h-4 w-40 bg-white/5 rounded-lg" /> {/* Value Text */}
          </div>
        ))}
      </div>

      {/* Button Skeleton */}
      <div className="h-14 w-full bg-white/5 rounded-xl border border-white/5 mt-4" />
      
      <div className="flex justify-center">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-900/50">
          Decrypting User Data...
        </span>
      </div>
    </div>
  );
};

export default ProfileLoader;