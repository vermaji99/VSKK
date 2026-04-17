import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const OrbitalViewer = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Orbital rotation based on scroll
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={sectionRef} className="relative h-[200vh] bg-luxury-black flex items-center justify-center overflow-hidden">
      <motion.div 
        style={{ opacity, scale }}
        className="sticky top-0 h-screen w-full flex items-center justify-center"
      >
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(107,33,168,0.05)_0%,transparent_70%)]" />
        
        {/* Orbital Ring */}
        <motion.div 
          style={{ rotate }}
          className="relative w-[500px] h-[500px] border border-luxury-gold/10 rounded-full flex items-center justify-center"
        >
          {/* Orbits */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-luxury-gold rounded-full shadow-[0_0_15px_#D4AF37]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-luxury-teal rounded-full shadow-[0_0_10px_#14b8a6]" />
          
          {/* Main Product in Center (Counter-rotate to stay upright) */}
          <motion.div 
            style={{ rotate: useTransform(rotate, r => -r) }}
            className="w-80 h-80 glass-panel rounded-full overflow-hidden p-4 interactive"
          >
            <img 
              src="https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&q=80"
              alt="Orbital View"
              className="w-full h-full object-cover rounded-full shadow-2xl"
            />
          </motion.div>
        </motion.div>

        {/* HUD Info */}
        <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 text-center">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-luxury-gold tracking-[1em] uppercase text-[10px] mb-4 font-bold"
          >
            ORBITAL_SCAN_ACTIVE
          </motion.p>
          <h2 className="text-4xl font-premium text-white tracking-widest uppercase">360_PRECISION</h2>
        </div>
      </motion.div>
    </section>
  );
};

export default OrbitalViewer;
