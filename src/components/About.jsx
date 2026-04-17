import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section id="about" ref={sectionRef} className="relative bg-luxury-black py-60 overflow-hidden">
      {/* Background large text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none opacity-[0.02] select-none">
        <h2 className="text-[20vw] font-bold uppercase tracking-tighter">Heritage</h2>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-40 items-center">
          <div className="relative">
            <motion.div 
              style={{ y: y1 }}
              className="relative z-10 aspect-[3/4] overflow-hidden rounded-sm"
            >
              <img 
                src="https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?auto=format&fit=crop&q=80" 
                alt="Jewellery Atelier" 
                className="w-full h-full object-cover scale-110"
              />
              <div className="absolute inset-0 bg-luxury-black/20" />
            </motion.div>
            
            {/* Floating element */}
            <motion.div 
              style={{ y: y2 }}
              className="absolute -bottom-20 -right-10 md:-right-20 z-20 bg-luxury-gold p-10 md:p-16 rounded-sm shadow-2xl"
            >
              <p className="text-luxury-black font-bold text-5xl md:text-7xl mb-2">35</p>
              <p className="text-luxury-black/60 text-[10px] tracking-[0.4em] uppercase font-bold">Years of Pure <br /> Craftsmanship</p>
            </motion.div>

            {/* Decorative border */}
            <div className="absolute -top-10 -left-10 w-full h-full border border-luxury-gold/10 -z-10" />
          </div>

          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <p className="text-luxury-gold tracking-[0.5em] uppercase text-xs mb-6">Our Story</p>
              <h2 className="text-5xl md:text-8xl font-premium gold-text tracking-widest uppercase mb-10 leading-tight">
                A Legacy of <br /> Brilliance
              </h2>
              <div className="w-24 h-[1px] bg-luxury-gold mb-12" />
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-white/80 text-xl md:text-2xl leading-relaxed font-light tracking-widest italic"
            >
              "Beyond jewelry, we create symbols of love, achievement, and timeless heritage."
            </motion.p>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-white/50 text-lg leading-relaxed tracking-widest font-light"
            >
              Founded in the heart of the gold market, Vaibhav Swarn Kala Kendra has stood as a beacon of trust and artistic excellence for over three decades. Our master artisans blend ancient secrets with futuristic visions to craft pieces that are as unique as the individuals who wear them.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="pt-10"
            >
              <button className="group flex items-center space-x-6 text-luxury-gold tracking-[0.4em] uppercase text-[10px] font-bold interactive">
                <span>Discover Our Atelier</span>
                <div className="relative w-16 h-[1px] bg-luxury-gold/30 overflow-hidden">
                  <div className="absolute inset-0 bg-luxury-gold -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out" />
                </div>
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
