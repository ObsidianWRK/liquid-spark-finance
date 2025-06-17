
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const MountainLandscape = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Mountain landscape with parallax */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-orange-300 via-pink-300 to-purple-400"
        style={{
          transform: `translateY(${scrollY * 0.3}px)`,
        }}
      >
        {/* Mountain layers */}
        <div className="absolute inset-0">
          {/* Back mountains */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-[60%] opacity-60"
            style={{
              background: `linear-gradient(to top, 
                rgba(99, 102, 241, 0.4) 0%, 
                rgba(129, 140, 248, 0.3) 30%, 
                rgba(165, 180, 252, 0.2) 60%, 
                transparent 100%)`,
              clipPath: 'polygon(0 100%, 15% 60%, 35% 70%, 55% 45%, 75% 55%, 90% 40%, 100% 50%, 100% 100%)',
              transform: `translateY(${scrollY * 0.1}px)`,
            }}
          />
          
          {/* Middle mountains */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-[70%] opacity-75"
            style={{
              background: `linear-gradient(to top, 
                rgba(67, 56, 202, 0.5) 0%, 
                rgba(99, 102, 241, 0.4) 40%, 
                rgba(129, 140, 248, 0.3) 70%, 
                transparent 100%)`,
              clipPath: 'polygon(0 100%, 10% 50%, 25% 65%, 45% 35%, 65% 45%, 80% 30%, 95% 40%, 100% 35%, 100% 100%)',
              transform: `translateY(${scrollY * 0.2}px)`,
            }}
          />
          
          {/* Front mountains */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-[80%] opacity-90"
            style={{
              background: `linear-gradient(to top, 
                rgba(30, 27, 75, 0.7) 0%, 
                rgba(67, 56, 202, 0.6) 50%, 
                rgba(99, 102, 241, 0.4) 80%, 
                transparent 100%)`,
              clipPath: 'polygon(0 100%, 8% 40%, 20% 55%, 40% 25%, 60% 35%, 78% 20%, 92% 30%, 100% 25%, 100% 100%)',
              transform: `translateY(${scrollY * 0.25}px)`,
            }}
          />
        </div>

        {/* Atmospheric clouds */}
        <div className="absolute inset-0 opacity-30">
          <div 
            className="absolute top-[20%] left-[10%] w-32 h-16 bg-white rounded-full blur-xl"
            style={{
              transform: `translateX(${scrollY * 0.05}px)`,
            }}
          />
          <div 
            className="absolute top-[30%] right-[15%] w-24 h-12 bg-white rounded-full blur-lg"
            style={{
              transform: `translateX(${-scrollY * 0.03}px)`,
            }}
          />
          <div 
            className="absolute top-[25%] left-[60%] w-20 h-10 bg-white rounded-full blur-lg"
            style={{
              transform: `translateX(${scrollY * 0.07}px)`,
            }}
          />
        </div>

        {/* Golden hour light rays */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-[10%] right-[20%] w-1 h-32 bg-gradient-to-b from-yellow-200 to-transparent rotate-12 blur-sm" />
          <div className="absolute top-[15%] right-[25%] w-1 h-28 bg-gradient-to-b from-orange-200 to-transparent rotate-6 blur-sm" />
          <div className="absolute top-[12%] right-[30%] w-1 h-30 bg-gradient-to-b from-pink-200 to-transparent -rotate-3 blur-sm" />
        </div>

        {/* Subtle texture overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
                             radial-gradient(circle at 40% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
          }}
        />
      </div>

      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
    </div>
  );
};

export default MountainLandscape;
