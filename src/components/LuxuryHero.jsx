import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { motion, useTransform } from 'framer-motion';

const TOTAL_FRAMES = 41;

const LuxuryHero = ({ onHeroComplete }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isHeroComplete, setIsHeroComplete] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const animationFrameRef = useRef(null);
  const lastTouchYRef = useRef(null);
  const debounceRef = useRef(null);

  // Fallback timeout to avoid infinite loading
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsReady(true);
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, []);

  // Preload images
  const images = useMemo(() => {
    const imgArray = [];
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/assets/frames/frame_${String(i).padStart(3, '0')}.jpg`;
      img.decoding = 'async';
      img.loading = 'eager';
      img.onload = () => {
        setImagesLoaded(prev => {
          const newCount = prev + 1;
          if (newCount === TOTAL_FRAMES) setIsReady(true);
          return newCount;
        });
      };
      img.onerror = () => {
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

  // Render canvas with debounce for performance
  const renderCanvas = useCallback((progress) => {
    if (!isReady || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { 
      alpha: false, 
      willReadFrequently: false 
    });

    const index = Math.floor(progress * (TOTAL_FRAMES - 1));
    const clampedIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, index));

    if (images[clampedIndex] && images[clampedIndex].complete) {
      const img = images[clampedIndex];
      
      // Only update canvas dimensions if they've changed
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      // Fit image vertically (portrait mode) with cover/fit logic
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const x = (canvas.width / 2) - (img.width / 2) * scale;
      const y = (canvas.height / 2) - (img.height / 2) * scale;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    }
  }, [isReady, images]);

  // Debounce progress updates for smooth performance
  const debouncedSetProgress = useCallback((newProgress) => {
    if (debounceRef.current) {
      cancelAnimationFrame(debounceRef.current);
    }
    debounceRef.current = requestAnimationFrame(() => {
      setScrollProgress(prev => {
        const clamped = Math.max(0, Math.min(1, newProgress));
        
        if (clamped >= 1 && !isHeroComplete) {
          setIsHeroComplete(true);
          onHeroComplete?.();
        }
        
        return clamped;
      });
    });
  }, [isHeroComplete, onHeroComplete]);

  // Handle manual scroll events while body is frozen
  useEffect(() => {
    if (!isReady || isHeroComplete) return;

    const handleWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const sensitivity = window.innerWidth < 768 ? 1500 : 2000;
      debouncedSetProgress(prev => prev + (e.deltaY / sensitivity));
    };

    const handleTouchStart = (e) => {
      if (e.touches[0]) {
        lastTouchYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (e.touches[0] && lastTouchYRef.current !== null) {
        const currentY = e.touches[0].clientY;
        const deltaY = lastTouchYRef.current - currentY;
        const sensitivity = window.innerWidth < 768 ? 1000 : 1200;
        debouncedSetProgress(prev => prev + (deltaY / sensitivity));
        lastTouchYRef.current = currentY;
      }
    };

    const handleTouchEnd = () => {
      lastTouchYRef.current = null;
    };

    // Capture phase to override any other scroll handlers
    window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true, capture: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true, capture: true });

    return () => {
      window.removeEventListener('wheel', handleWheel, { capture: true });
      window.removeEventListener('touchstart', handleTouchStart, { capture: true });
      window.removeEventListener('touchmove', handleTouchMove, { capture: true });
      window.removeEventListener('touchend', handleTouchEnd, { capture: true });
      if (debounceRef.current) {
        cancelAnimationFrame(debounceRef.current);
      }
    };
  }, [isReady, isHeroComplete, debouncedSetProgress]);

  // Update canvas on progress change
  useEffect(() => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(() => renderCanvas(scrollProgress));
    
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [scrollProgress, renderCanvas]);

  // Resize handler with debounce
  useEffect(() => {
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        renderCanvas(scrollProgress);
      }, 150);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, [scrollProgress, renderCanvas]);

  // 3D transforms based on scroll
  const canvasScale = useTransform(() => 1 + (scrollProgress * 0.3));
  const canvasRotate = useTransform(() => -(scrollProgress * 1.5));
  const canvasY = useTransform(() => -(scrollProgress * 60));
  const glowOpacity = useTransform(() => Math.min(1, scrollProgress / 0.6));

  // Text animations
  const text1Opacity = useTransform(() => 1 - Math.min(1, scrollProgress / 0.12));
  const text2Opacity = useTransform(() => {
    if (scrollProgress > 0.18 && scrollProgress < 0.4) return 1;
    if (scrollProgress >= 0.18 && scrollProgress <= 0.28) return (scrollProgress - 0.18) / 0.1;
    if (scrollProgress > 0.28 && scrollProgress <= 0.4) return 1 - (scrollProgress - 0.28) / 0.12;
    return 0;
  });
  const text3Opacity = useTransform(() => {
    if (scrollProgress > 0.45 && scrollProgress < 0.75) return 1;
    if (scrollProgress >= 0.45 && scrollProgress <= 0.55) return (scrollProgress - 0.45) / 0.1;
    if (scrollProgress > 0.55 && scrollProgress <= 0.75) return 1 - (scrollProgress - 0.55) / 0.2;
    return 0;
  });
  const text4Opacity = useTransform(() => Math.max(0, Math.min(1, (scrollProgress - 0.75) / 0.15)));

  // Particle component with optimized rendering
  const Particle = ({ i }) => {
    const x = useMemo(() => Math.random() * 100, []);
    const y = useMemo(() => Math.random() * 100, []);
    const size = useMemo(() => Math.random() * 3 + 1, []);
    const duration = useMemo(() => 5 + Math.random() * 10, []);
    const delay = useMemo(() => Math.random() * 2, []);

    return (
      <motion.div
        key={i}
        className="absolute pointer-events-none"
        style={{
          left: `${x}%`,
          top: `${y}%`,
        }}
      >
        <motion.div
          className="bg-gradient-to-r from-[#D4AF37] to-[#E5D3A3] rounded-full"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            boxShadow: '0 0 10px rgba(212,175,55,0.8), 0 0 20px rgba(212,175,55,0.5)',
          }}
          animate={{
            y: [0, -50 - Math.random() * 50],
            opacity: [0, 0.8, 0],
            x: [0, (Math.random() - 0.5) * 20],
          }}
          transition={{
            duration: duration,
            repeat: Infinity,
            delay: delay,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
    );
  };

  // Light beam component with optimized rendering
  const LightBeam = ({ i }) => {
    const angle = i * 45;
    return (
      <motion.div
        key={i}
        className="absolute pointer-events-none"
        style={{
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) rotate(${angle}deg)`,
          width: '200%',
          height: '200%',
          background: `linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.05) 45%, rgba(212,175,55,0.1) 50%, rgba(212,175,55,0.05) 55%, transparent 100%)`,
        }}
        animate={{
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    );
  };

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #000000 0%, #020202 20%, #050505 50%, #020202 80%, #000000 100%)',
        height: '100vh'
      }}
    >
      {/* Loading indicator */}
      {!isReady && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#020202]">
          <div className="w-10 sm:w-12 h-10 sm:h-12 border-3 sm:border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4 sm:mb-6" />
          <p className="text-white/70 text-sm sm:text-base tracking-widest">
            Loading experience... {Math.round((imagesLoaded / TOTAL_FRAMES) * 100)}%
          </p>
        </div>
      )}

      {/* Hero container (sticky to keep canvas centered) */}
      <motion.div
        className="sticky top-0 w-full h-screen flex items-center justify-center perspective-[1200px] overflow-hidden"
      >
        {/* Volumetric fog layers */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(229,211,163,0.15) 0%, transparent 60%)',
              opacity: glowOpacity,
            }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 70% 70%, rgba(212,175,55,0.1) 0%, transparent 50%)',
              opacity: glowOpacity,
            }}
            animate={{
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
        </div>

        {/* Floating particles - reduced count for mobile performance */}
        {[...Array(window.innerWidth < 768 ? 15 : 30)].map((_, i) => (
          <Particle key={i} i={i} />
        ))}

        {/* Light beams - reduced for mobile */}
        {[...Array(window.innerWidth < 768 ? 2 : 4)].map((_, i) => (
          <LightBeam key={i} i={i} />
        ))}

        {/* Product canvas with 3D effects */}
        <motion.div
          className="relative z-20 w-full h-full flex items-center justify-center"
          style={{
            scale: canvasScale,
            rotateX: canvasRotate,
            y: canvasY,
            transformStyle: 'preserve-3d',
          }}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0"
            style={{
              filter: 'contrast(1.15) saturate(1.2) drop-shadow(0 0 50px rgba(212,175,55,0.4))',
            }}
          />
        </motion.div>

        {/* Content layers with responsive design */}
        <div className="absolute inset-0 z-30 pointer-events-none">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12 h-full flex flex-col justify-between py-12 sm:py-16 md:py-20">
            {/* Skip button */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 pointer-events-auto z-50">
              <button
                onClick={() => {
                  setIsHeroComplete(true);
                  onHeroComplete?.();
                }}
                className="px-3 sm:px-5 py-1.5 sm:py-2 border border-white/30 text-white/70 text-xs sm:text-sm tracking-wider hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all duration-500 rounded-sm"
              >
                Skip Intro
              </button>
            </div>

            {/* 0% Scroll - Initial Beauty Shot */}
            <motion.div
              className="flex flex-col items-center justify-center h-full text-center px-2 sm:px-4"
              style={{
                opacity: text1Opacity,
                transform: `translateZ(80px)`,
                transformStyle: 'preserve-3d',
              }}
            >
              <motion.h1
                initial={{ y: 60, opacity: 0, rotateX: -10 }}
                animate={{ y: 0, opacity: 1, rotateX: 0 }}
                transition={{ duration: 2, ease: [0.23, 1, 0.32, 1] }}
                className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl xl:text-[10rem] font-black text-white/95 tracking-tighter mb-3 sm:mb-6"
                style={{
                  textShadow: '0 0 30px rgba(212,175,55,0.4), 0 0 60px rgba(0,0,0,0.9)',
                }}
              >
                CRAFTED <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-[#D4AF37] via-[#E5D3A3] to-[#D4AF37] bg-clip-text text-transparent drop-shadow-2xl">
                  BEYOND TIME
                </span>
              </motion.h1>

              <motion.p
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 2, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="text-white/75 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl xl:max-w-4xl mb-8 sm:mb-10 md:mb-12"
              >
                Masterpieces of light, artistry and emotion.
              </motion.p>

              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 2, delay: 0.8, ease: [0.23, 1, 0.32, 1] }}
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 pointer-events-auto"
              >
                <button
                  onClick={() => {
                    setIsHeroComplete(true);
                    onHeroComplete?.();
                  }}
                  className="px-6 sm:px-8 md:px-10 lg:px-14 py-2.5 sm:py-3 md:py-4 lg:py-6 bg-gradient-to-r from-[#D4AF37] to-[#E5D3A3] text-black font-semibold md:font-bold tracking-widest rounded-sm hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] md:hover:shadow-[0_0_80px_rgba(212,175,55,0.7)] transition-all duration-500 md:duration-700 hover:-translate-y-1 md:hover:-translate-y-3 hover:scale-105 text-sm sm:text-base md:text-lg lg:text-xl"
                >
                  EXPLORE COLLECTION
                </button>
                <button
                  onClick={() => {
                    setIsHeroComplete(true);
                    onHeroComplete?.();
                  }}
                  className="px-6 sm:px-8 md:px-10 lg:px-14 py-2.5 sm:py-3 md:py-4 lg:py-6 border-2 border-white/25 text-white/90 font-medium md:font-semibold tracking-widest rounded-sm hover:border-[#D4AF37] hover:text-[#D4AF37] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] md:hover:shadow-[0_0_40px_rgba(212,175,55,0.4)] transition-all duration-500 md:duration-700 hover:scale-105 text-sm sm:text-base md:text-lg lg:text-xl"
                >
                  DISCOVER CRAFTSMANSHIP
                </button>
              </motion.div>
            </motion.div>

            {/* 20%-50% Scroll - Rotation & Details */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center text-center px-4 sm:px-6"
              style={{
                opacity: text2Opacity,
                transform: `translateZ(120px)`,
              }}
            >
              <div className="space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-12">
                <motion.p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white/95 font-light tracking-widest">
                  Every detail tells a story.
                </motion.p>
                <motion.p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/70">
                  Handcrafted precision meets timeless elegance.
                </motion.p>
                <motion.p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/55">
                  Designed to become an heirloom.
                </motion.p>
              </div>
            </motion.div>

            {/* 50%-75% Scroll - Peak Impact */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6"
              style={{
                opacity: text3Opacity,
                transform: `translateZ(160px)`,
              }}
            >
              <motion.h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl xl:text-8xl font-black text-white/95 tracking-tighter mb-6 sm:mb-8 md:mb-10 lg:mb-14"
                style={{
                  textShadow: '0 0 30px rgba(212,175,55,0.5), 0 0 60px rgba(0,0,0,0.9)',
                }}
              >
                Where Art Meets <span className="text-[#E5D3A3] drop-shadow-2xl">Brilliance</span>
              </motion.h2>

              <motion.p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-3xl text-white/70 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl xl:max-w-4xl mb-8 sm:mb-10 md:mb-12 lg:mb-16">
                Rare gemstones. Exceptional craftsmanship. Unforgettable presence.
              </motion.p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-12 max-w-4xl w-full pointer-events-auto">
                {[
                  { stat: '100%', label: 'Handcrafted' },
                  { stat: 'Certified', label: 'Gemstones' },
                  { stat: 'Lifetime', label: 'Craftsmanship' }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 60, opacity: 0, rotateX: 15 }}
                    whileInView={{ y: 0, opacity: 1, rotateX: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.4, duration: 1.2, ease: 'easeOut' }}
                    className="backdrop-blur-2xl md:backdrop-blur-3xl bg-white/5 border border-white/15 p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 rounded-xl md:rounded-2xl"
                  >
                    <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black bg-gradient-to-r from-[#D4AF37] to-[#E5D3A3] bg-clip-text text-transparent mb-2 sm:mb-3 md:mb-4"
                      style={{
                        textShadow: '0 0 15px rgba(212,175,55,0.4)',
                      }}
                    >
                      {item.stat}
                    </div>
                    <div className="text-white/60 text-xs sm:text-sm md:text-base lg:text-lg tracking-widest">
                      {item.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* 75%-100% Scroll - Final CTA */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6"
              style={{
                opacity: text4Opacity,
                transform: `translateZ(200px)`,
              }}
            >
              <motion.h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl xl:text-8xl font-black text-white/95 tracking-tighter mb-6 sm:mb-8 md:mb-10 lg:mb-14"
                style={{
                  textShadow: '0 0 30px rgba(212,175,55,0.5), 0 0 60px rgba(0,0,0,0.9)',
                }}
              >
                Own the <span className="text-[#E5D3A3] drop-shadow-2xl">Extraordinary</span>
              </motion.h2>

              <motion.div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 pointer-events-auto">
                <button
                  onClick={() => {
                    setIsHeroComplete(true);
                    onHeroComplete?.();
                  }}
                  className="px-6 sm:px-8 md:px-10 lg:px-12 xl:px-20 py-3 sm:py-3.5 md:py-4 lg:py-5 xl:py-8 bg-gradient-to-r from-[#D4AF37] to-[#E5D3A3] text-black font-semibold md:font-bold lg:font-black tracking-widest rounded-sm text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl hover:shadow-[0_0_40px_rgba(212,175,55,0.5)] md:hover:shadow-[0_0_100px_rgba(212,175,55,0.8)] transition-all duration-500 md:duration-700 hover:-translate-y-2 md:hover:-translate-y-4 hover:scale-105"
                >
                  VIEW COLLECTION
                </button>
                <button
                  onClick={() => {
                    setIsHeroComplete(true);
                    onHeroComplete?.();
                  }}
                  className="px-6 sm:px-8 md:px-10 lg:px-12 xl:px-20 py-3 sm:py-3.5 md:py-4 lg:py-5 xl:py-8 border-2 border-white/25 text-white/90 font-medium md:font-semibold tracking-widest rounded-sm text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-500 md:duration-700 hover:scale-105"
                >
                  BOOK PRIVATE CONSULTATION
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default LuxuryHero;
