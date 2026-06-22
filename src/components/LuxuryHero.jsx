import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';

const TOTAL_FRAMES = 32;

const LuxuryHero = ({ onHeroComplete }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHeroComplete, setIsHeroComplete] = useState(false);
  const animationFrameRef = useRef(null);
  const lastScrollTimeRef = useRef(0);
  const touchStartYRef = useRef(0);

  // Preload images
  const images = useMemo(() => {
    const imgArray = [];
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/assets/frames/ezgif-frame-${String(i).padStart(3, '0')}.jpg`;
      img.decoding = 'async';
      img.loading = 'eager';
      img.onload = () => {
        setImagesLoaded(prev => {
          const newCount = prev + 1;
          if (newCount === TOTAL_FRAMES) setIsReady(true);
          return newCount;
        });
      };
      imgArray.push(img);
    }
    return imgArray;
  }, []);

  // Optimized canvas rendering with requestAnimationFrame
  const renderCanvas = useCallback((progress) => {
    if (!isReady || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    
    const index = Math.floor(progress * (TOTAL_FRAMES - 1));
    const clampedIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, index));
    
    if (images[clampedIndex] && images[clampedIndex].complete) {
      const img = images[clampedIndex];
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const x = (canvas.width / 2) - (img.width / 2) * scale;
      const y = (canvas.height / 2) - (img.height / 2) * scale;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    }
  }, [isReady, images]);

  // Use effect to render canvas when scrollProgress changes
  useEffect(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(() => renderCanvas(scrollProgress));
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [scrollProgress, renderCanvas]);

  // Responsive canvas with debouncing
  useEffect(() => {
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (canvasRef.current) {
          canvasRef.current.width = window.innerWidth;
          canvasRef.current.height = window.innerHeight;
          renderCanvas(scrollProgress);
        }
      }, 100);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [scrollProgress, renderCanvas]);

  // Scroll locking and wheel/touch handling with throttling
  useEffect(() => {
    if (!isReady) return;

    // Lock body scroll until hero is complete
    if (!isHeroComplete) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = '0';
      document.body.style.left = '0';
      document.body.style.right = '0';
    } else {
      document.body.style.overflow = 'auto';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
    }

    const handleWheel = (e) => {
      if (isHeroComplete) return;
      e.preventDefault();
      
      const now = Date.now();
      if (now - lastScrollTimeRef.current < 16) return; // ~60fps
      lastScrollTimeRef.current = now;
      
      const delta = e.deltaY > 0 ? 0.008 : -0.008;
      const newProgress = Math.max(0, Math.min(1, scrollProgress + delta));
      setScrollProgress(newProgress);
      
      if (newProgress >= 1) {
        setIsHeroComplete(true);
        if (onHeroComplete) onHeroComplete();
      }
    };

    const handleTouchStart = (e) => {
      if (isHeroComplete) return;
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (isHeroComplete) return;
      e.preventDefault();
      
      const now = Date.now();
      if (now - lastScrollTimeRef.current < 16) return; // ~60fps
      lastScrollTimeRef.current = now;
      
      const touchCurrentY = e.touches[0].clientY;
      const deltaY = touchStartYRef.current - touchCurrentY;
      const delta = deltaY > 0 ? 0.008 : -0.008;
      const newProgress = Math.max(0, Math.min(1, scrollProgress + delta));
      setScrollProgress(newProgress);
      touchStartYRef.current = touchCurrentY;
      
      if (newProgress >= 1) {
        setIsHeroComplete(true);
        if (onHeroComplete) onHeroComplete();
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      container.addEventListener('touchstart', handleTouchStart, { passive: false });
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      if (container) {
        container.removeEventListener('wheel', handleWheel);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [isReady, isHeroComplete, scrollProgress, onHeroComplete]);

  // Scroll transformations
  const opacityText1 = 1 - Math.min(1, scrollProgress / 0.15);
  const opacityText2 = scrollProgress > 0.15 && scrollProgress < 0.35 ? 1 : 
                       scrollProgress >= 0.15 && scrollProgress <= 0.25 ? (scrollProgress - 0.15) / 0.1 :
                       scrollProgress > 0.25 && scrollProgress <= 0.35 ? 1 - (scrollProgress - 0.25) / 0.1 : 0;
  const opacityText3 = scrollProgress > 0.45 && scrollProgress < 0.65 ? 1 : 
                       scrollProgress >= 0.45 && scrollProgress <= 0.55 ? (scrollProgress - 0.45) / 0.1 :
                       scrollProgress > 0.55 && scrollProgress <= 0.65 ? 1 - (scrollProgress - 0.55) / 0.1 : 0;
  const opacityText4 = Math.max(0, Math.min(1, (scrollProgress - 0.8) / 0.1));

  const scaleProduct = 1 + (scrollProgress * 0.15);
  const glowIntensity = Math.min(1, scrollProgress / 0.7);

  return (
    <section 
      ref={containerRef}
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #020202 0%, #050505 30%, #07110F 60%, #081A17 100%)',
        height: isHeroComplete ? 'auto' : '100vh'
      }}
    >
      {/* Loading indicator */}
      {!isReady && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#020202]">
          <div className="w-12 h-12 border-4 border-[#00B894] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white/70 text-sm">Loading experience... {Math.round((imagesLoaded / TOTAL_FRAMES) * 100)}%</p>
        </div>
      )}

      {/* Hero container */}
      <div className={`${isHeroComplete ? 'h-auto' : 'h-screen'} w-full flex items-center justify-center`}>
        {/* Atmosphere layers */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Emerald fog */}
          <motion.div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(0, 184, 148, 0.08) 0%, transparent 60%)',
              opacity: glowIntensity
            }}
          />
          
          {/* Volumetric light */}
          <motion.div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at 50% 40%, rgba(36, 240, 199, 0.06) 0%, transparent 50%)',
              opacity: glowIntensity
            }}
          />
          
          {/* Deep fog overlay */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 50% 100%, rgba(2, 2, 2, 0.8) 0%, transparent 50%)'
            }}
          />
        </div>

        {/* Product canvas */}
        <motion.div 
          className="relative z-10 w-full h-full flex items-center justify-center"
          style={{ 
            scale: scaleProduct,
            height: isHeroComplete ? '100vh' : '100vh'
          }}
        >
          <canvas 
            ref={canvasRef}
            className="absolute inset-0"
            style={{
              filter: 'contrast(1.1) saturate(1.1)'
            }}
          />
          
          {/* Cinematic bloom overlay */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow: 'inset 0 0 150px rgba(0, 214, 160, 0.15), inset 0 0 300px rgba(0, 0, 0, 0.8)'
            }}
          />
        </motion.div>

        {/* Content layers */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12 h-full flex flex-col justify-between py-16 sm:py-20">
            {/* 0% Scroll - Initial Beauty Shot */}
            <motion.div 
              className="flex flex-col items-center justify-center h-full text-center"
              style={{ opacity: opacityText1 }}
            >
              <motion.h1 
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
                className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white/90 tracking-tight mb-6 px-4"
              >
                Crafted <br />
                <span className="bg-gradient-to-r from-[#00B894] to-[#24F0C7] bg-clip-text text-transparent">
                  Beyond Time
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
                className="text-white/60 text-sm sm:text-base md:text-lg lg:text-xl max-w-xs sm:max-w-md md:max-w-2xl mb-8 sm:mb-12 px-4"
              >
                Masterpieces of light, artistry and emotion.
              </motion.p>
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.6, ease: [0.23, 1, 0.32, 1] }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 pointer-events-auto px-4"
              >
                <button className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#00B894] to-[#24F0C7] text-black font-semibold rounded-sm hover:shadow-[0_0_30px_rgba(0,184,148,0.4)] transition-all duration-500 hover:-translate-y-1 text-sm sm:text-base">
                  Explore Collection
                </button>
                <button className="px-6 sm:px-8 py-3 sm:py-4 border border-white/20 text-white/80 font-semibold rounded-sm hover:border-[#00B894] hover:text-[#00B894] transition-all duration-500 text-sm sm:text-base">
                  Discover Craftsmanship
                </button>
              </motion.div>
            </motion.div>

            {/* 20%-50% Scroll - Rotation & Details */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center text-center"
              style={{ opacity: opacityText2 }}
            >
              <div className="space-y-4 sm:space-y-6 px-4">
                <motion.p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 font-light">
                  Every detail tells a story.
                </motion.p>
                <motion.p className="text-base sm:text-lg md:text-xl text-white/60">
                  Handcrafted precision meets timeless elegance.
                </motion.p>
                <motion.p className="text-sm sm:text-base md:text-lg text-white/50">
                  Designed to become an heirloom.
                </motion.p>
              </div>
            </motion.div>

            {/* 50%-80% Scroll - Peak Impact */}
            <motion.div 
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
              style={{ opacity: opacityText3 }}
            >
              <motion.h2 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white/90 tracking-tight mb-6 sm:mb-8 px-4">
                Where Art Meets <span className="text-[#24F0C7]">Brilliance</span>
              </motion.h2>
              
              <motion.p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/60 max-w-xs sm:max-w-md md:max-w-2xl mb-8 sm:mb-12 px-4">
                Rare gemstones. Exceptional craftsmanship. Unforgettable presence.
              </motion.p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl w-full px-4 pointer-events-auto">
                {[
                  { stat: '100%', label: 'Handcrafted' },
                  { stat: 'Certified', label: 'Gemstones' },
                  { stat: 'Lifetime', label: 'Craftsmanship' }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2, duration: 0.8 }}
                    className="backdrop-blur-2xl bg-white/5 border border-white/10 p-4 sm:p-6 lg:p-8 rounded-lg"
                  >
                    <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00B894] to-[#24F0C7] bg-clip-text text-transparent mb-2">
                      {item.stat}
                    </div>
                    <div className="text-white/60 text-xs sm:text-sm md:text-base">
                      {item.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* 80%-100% Scroll - Final CTA */}
            <motion.div 
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
              style={{ opacity: opacityText4 }}
            >
              <motion.h2 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white/90 tracking-tight mb-6 sm:mb-8 px-4">
                Own the <span className="text-[#24F0C7]">Extraordinary</span>
              </motion.h2>
              
              <motion.div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pointer-events-auto px-4">
                <button 
                  onClick={() => {
                    setIsHeroComplete(true);
                    if (onHeroComplete) onHeroComplete();
                  }}
                  className="px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 bg-gradient-to-r from-[#00B894] to-[#24F0C7] text-black font-semibold rounded-sm text-sm sm:text-base lg:text-lg hover:shadow-[0_0_40px_rgba(0,184,148,0.5)] transition-all duration-500 hover:-translate-y-1"
                >
                  View Collection
                </button>
                <button className="px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 border border-white/20 text-white/80 font-semibold rounded-sm text-sm sm:text-base lg:text-lg hover:border-[#00B894] hover:text-[#00B894] transition-all duration-500">
                  Book Private Consultation
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LuxuryHero;
