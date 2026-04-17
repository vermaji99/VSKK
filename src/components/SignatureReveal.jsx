import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SignatureReveal = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.5], [0, 0, 1]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [100, 0]);

  return (
    <section 
      ref={sectionRef} 
      className="relative min-h-screen bg-luxury-black flex items-center justify-center overflow-hidden py-20 md:py-40"
    >
      {/* Background Stacking Layer Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent z-0 h-20 md:h-40" />
      
      <motion.div 
        ref={containerRef}
        style={{ scale, opacity }}
        className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center"
      >
        <div className="relative w-full max-w-5xl aspect-[4/3] md:aspect-video overflow-hidden rounded-sm group interactive">
          {/* Main Product Image Emerging from Darkness */}
          <motion.img 
            src="https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&q=80"
            alt="Signature Piece"
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[2s] ease-out"
          />
          
          {/* Dark Overlays for "Emerging" look */}
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-luxury-black opacity-80" />
          <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,1)] md:shadow-[inset_0_0_150px_rgba(0,0,0,1)]" />
          
          {/* Emerald Glow on hover */}
          <div className="absolute inset-0 bg-luxury-emerald/0 group-hover:bg-luxury-emerald/5 transition-colors duration-1000" />
        </div>

        <motion.div 
          style={{ y: textY }}
          className="mt-12 md:mt-20 text-center max-w-3xl"
        >
          <p className="text-luxury-gold tracking-[0.6em] uppercase text-[8px] md:text-[10px] mb-6 md:mb-8 font-bold">THE REVEAL</p>
          <h2 className="text-3xl md:text-7xl font-premium text-white leading-tight mb-6 md:mb-8 tracking-widest uppercase">
            Emerging from <br /> <span className="text-luxury-emerald italic shadow-[0_0_20px_rgba(0,128,128,0.3)]">Pure Darkness</span>
          </h2>
          <div className="w-16 md:w-20 h-[1px] bg-luxury-gold mx-auto mb-8 md:mb-10 opacity-50" />
          <p className="text-white/40 text-base md:text-xl font-light tracking-[0.2em] leading-relaxed">
            A masterpiece that captures the soul of light. Handcrafted with the precision of a celestial event.
          </p>
          
          <button className="mt-10 md:mt-16 group flex items-center space-x-6 text-luxury-gold tracking-[0.5em] uppercase text-[10px] font-bold interactive mx-auto">
            <span>Discover The Details</span>
            <div className="relative w-8 md:w-12 h-[1px] bg-luxury-gold/30 overflow-hidden">
              <div className="absolute inset-0 bg-luxury-gold -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
            </div>
          </button>
        </motion.div>
      </motion.div>

      {/* Side Decorative Light Rays */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-luxury-gold/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-luxury-emerald/5 blur-[150px] pointer-events-none" />
    </section>
  );
};

export default SignatureReveal;
