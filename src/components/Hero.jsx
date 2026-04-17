import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { BUSINESS_DETAILS } from '../constants/business';

const Hero = () => {
  const heroRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 40;
      const y = (clientY / innerHeight - 0.5) * 40;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const springConfig = { damping: 40, stiffness: 80 };
  const rotateX = useSpring(mousePos.y, springConfig);
  const rotateY = useSpring(mousePos.x, springConfig);

  const { scrollY } = useScroll();
  const scaleCenter = useTransform(scrollY, [0, 800], [1, 2.5]);
  const opacityCenter = useTransform(scrollY, [0, 400], [1, 0]);
  const blurCenter = useTransform(scrollY, [0, 600], [0, 20]);

  const y1 = useTransform(scrollY, [0, 500], [0, -150]);
  const y2 = useTransform(scrollY, [0, 500], [0, 150]);
  const rotateCenter = useTransform(scrollY, [0, 1000], [0, 45]);

  const scrollToCollections = () => {
    document.getElementById('collections').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={heroRef} className="relative h-[150vh] bg-luxury-black overflow-hidden perspective-scene">
      {/* Dynamic Background Spotlight */}
      <motion.div 
        className="spotlight"
        style={{ 
          left: mousePos.x * 10 + (window.innerWidth/2 - 300),
          top: mousePos.y * 10 + (window.innerHeight/2 - 300)
        }}
      />

      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Floating Particles Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-accent-gold/20 rounded-full blur-[1px]"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -40, 0],
                x: [0, 20, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        {/* Orbiting UI Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute border border-luxury-gold/10 rounded-full"
              style={{
                width: `${(i + 1) * 300}px`,
                height: `${(i + 1) * 300}px`,
                top: '50%',
                left: '50%',
                x: '-50%',
                y: '-50%',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 30 + i * 10, repeat: Infinity, ease: "linear" }}
            />
          ))}
        </div>

        {/* Floating 3D Object Container */}
        <motion.div
          style={{ 
            scale: scaleCenter, 
            opacity: opacityCenter, 
            filter: `blur(${blurCenter}px)`,
            rotateX, 
            rotateY,
            rotateZ: rotateCenter
          }}
          className="relative z-10 w-[80vw] md:w-[60vw] h-[40vh] md:h-[60vh] flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, filter: 'blur(20px)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 2.5, ease: [0.23, 1, 0.32, 1] }}
            className="w-full h-full bg-cover bg-center rounded-sm shadow-[0_0_150px_rgba(212,175,55,0.15)]"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80")',
            }}
          />
          
          {/* Futuristic Data Labels (Off-grid) - Adjusted for mobile */}
          <motion.div 
            className="absolute -top-10 md:-top-20 -left-10 md:-left-40 glass-panel p-3 md:p-6 rounded-sm border-luxury-teal/20 scale-75 md:scale-100"
            style={{ y: y1 }}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.5, duration: 1.5 }}
          >
            <p className="text-luxury-teal text-[6px] md:text-[8px] tracking-[0.5em] mb-2 font-bold uppercase">VSKK_ATELIER</p>
            <p className="text-white/40 text-[8px] md:text-[10px] tracking-widest font-light uppercase">EST_1990</p>
          </motion.div>

          <motion.div 
            className="absolute -bottom-10 md:-bottom-20 -right-10 md:-right-40 glass-panel p-3 md:p-6 rounded-sm border-luxury-purple/20 scale-75 md:scale-100"
            style={{ y: y2 }}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.8, duration: 1.5 }}
          >
            <p className="text-luxury-purple text-[6px] md:text-[8px] tracking-[0.5em] mb-2 font-bold uppercase">PURE_GOLD</p>
            <p className="text-white/40 text-[8px] md:text-[10px] tracking-widest font-light">PURITY: 24K_99.9%</p>
          </motion.div>
        </motion.div>

        {/* Off-grid Typography */}
        <div className="absolute inset-0 z-20 pointer-events-none container mx-auto px-6 md:px-12">
          <motion.div 
            className="absolute top-[10%] md:top-[15%] right-[5%] text-right"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 1.5 }}
          >
            <h1 className="sr-only">Vaibhav Swarn Kala Kendra - Best Jewellery Shop in Doharighat, Mau</h1>
            <div className="leading-[0.8] mb-4 text-[4rem] md:text-[8rem] font-premium uppercase tracking-tighter">
              ETERNAL <br /> <span className="gold-text italic">BRILLIANCE</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="logo-vskk text-2xl md:text-4xl">VSKK</span>
              <p className="text-white/20 text-[8px] md:text-[10px] tracking-[1em] uppercase font-bold mt-2">EST. 1990</p>
            </div>
          </motion.div>

          <motion.div 
            className="absolute bottom-[10%] md:bottom-[20%] left-[5%]"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 1.5 }}
          >
            <p className="text-luxury-gold/40 text-[10px] md:text-xs tracking-[0.6em] uppercase mb-4 md:mb-8 max-w-[150px] md:max-w-xs leading-relaxed">
              Crafting the future of luxury, anchored in traditions of excellence.
            </p>
            <div className="flex items-center space-x-6 md:space-x-12 pointer-events-auto">
              <button 
                onClick={scrollToCollections}
                className="btn-premium !px-6 md:!px-10 !py-3 md:!py-4"
              >
                Explore Collection
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
