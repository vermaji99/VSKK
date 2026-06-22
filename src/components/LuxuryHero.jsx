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

  // Render canvas
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

      // Fit image vertically (portrait mode)
      const scale = canvas.height / img.height;
      const x = (canvas.width / 2) - (img.width / 2) * scale;
      const y = 0;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    }
  }, [isReady, images]);

  // Handle manual scroll events while body is frozen
  useEffect(() => {
    if (!isReady || isHeroComplete) return;

    const handleScrollEvents = (e) => {
      e.preventDefault();
      
      // Calculate scroll delta
      let delta = 0;
      if (e.type === 'wheel') {
        delta = e.deltaY;
      } else if (e.type === 'touchmove' && e.touches[0]) {
        const currentY = e.touches[0].clientY;
        const prevY = containerRef.current._prevTouchY || currentY;
        delta = prevY - currentY;
        containerRef.current._prevTouchY = currentY;
      }

      if (delta !== 0) {
        setScrollProgress(prev => {
          const newProgress = prev + (delta / 2000); // Adjust sensitivity
          const clamped = Math.max(0, Math.min(1, newProgress));

          if (clamped >= 1 && !isHeroComplete) {
            setIsHeroComplete(true);
            onHeroComplete?.();
          }

          return clamped;
        });
      }
    };

    window.addEventListener('wheel', handleScrollEvents, { passive: false });
    window.addEventListener('touchmove', handleScrollEvents, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleScrollEvents);
      window.removeEventListener('touchmove', handleScrollEvents);
    };
  }, [isReady, isHeroComplete, onHeroComplete]);

  // Update canvas on progress change
  useEffect(() => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(() => renderCanvas(scrollProgress));
  }, [scrollProgress, renderCanvas]);

  // Resize handler
  useEffect(() => {
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        renderCanvas(scrollProgress);
      }, 100);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [scrollProgress, renderCanvas]);

  // 3D transforms based on scroll
  const canvasScale = useTransform(() => 1 + (scrollProgress * 0.4));
  const canvasRotate = useTransform(() => -(scrollProgress * 2));
  const canvasY = useTransform(() => -(scrollProgress * 80));
  const glowOpacity = useTransform(() => Math.min(1, scrollProgress / 0.7));

  // Text animations
  const text1Opacity = useTransform(() => 1 - Math.min(1, scrollProgress / 0.1));
  const text2Opacity = useTransform(() => {
    if (scrollProgress > 0.15 && scrollProgress < 0.35) return 1;
    if (scrollProgress >= 0.15 && scrollProgress <= 0.25) return (scrollProgress - 0.15) / 0.1;
    if (scrollProgress > 0.25 && scrollProgress <= 0.35) return 1 - (scrollProgress - 0.25) / 0.1;
    return 0;
  });
  const text3Opacity = useTransform(() => {
    if (scrollProgress > 0.45 && scrollProgress < 0.65) return 1;
    if (scrollProgress >= 0.45 && scrollProgress <= 0.55) return (scrollProgress - 0.45) / 0.1;
    if (scrollProgress > 0.55 && scrollProgress <= 0.65) return 1 - (scrollProgress - 0.55) / 0.1;
    return 0;
  });
  const text4Opacity = useTransform(() => Math.max(0, Math.min(1, (scrollProgress - 0.8) / 0.1)));

  // Particle component
  const Particle = ({ i }) => {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = Math.random() * 3 + 1;
    const duration = 5 + Math.random() * 10;
    const delay = Math.random() * 2;

    return (
      <motion.div
        className="absolute w-full h-full pointer-events-none"
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

  // Light beam component
  const LightBeam = ({ i }) => {
    const angle = (i * 45) % 360;
    return (
      <motion.div
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
        height: '100vh' // Fixed full viewport height for frozen scroll
      }}
    >
      {/* Loading indicator */}
      {!isReady && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#020202]">
          <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-6" />
          <p className="text-white/70 text-base tracking-widest">
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

        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
          <Particle key={i} i={i} />
        ))}

        {/* Light beams */}
        {[...Array(4)].map((_, i) => (
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

        {/* Content layers with 3D entrance */}
        <div className="absolute inset-0 z-30 pointer-events-none">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12 h-full flex flex-col justify-between py-16 sm:py-20">
            {/* Skip button */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 pointer-events-auto z-50">
              <button
                onClick={() => {
                  setIsHeroComplete(true);
                  onHeroComplete?.();
                }}
                className="px-5 py-2 border border-white/30 text-white/70 text-sm tracking-wider hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all duration-500 rounded-sm"
              >
                Skip Intro
              </button>
            </div>

            {/* 0% Scroll - Initial Beauty Shot */}
            <motion.div
              className="flex flex-col items-center justify-center h-full text-center"
              style={{
                opacity: text1Opacity,
                transform: `translateZ(80px)`,
                transformStyle: 'preserve-3d',
              }}
            >
              <motion.h1
                initial={{ y: 80, opacity: 0, rotateX: -10 }}
                animate={{ y: 0, opacity: 1, rotateX: 0 }}
                transition={{ duration: 2, ease: [0.23, 1, 0.32, 1] }}
                className="text-5xl sm:text-7xl md:text-9xl lg:text-[12rem] font-black text-white/95 tracking-tighter mb-6 px-4"
                style={{
                  textShadow: '0 0 40px rgba(212,175,55,0.4), 0 0 80px rgba(0,0,0,0.9)',
                }}
              >
                CRAFTED <br />
                <span className="bg-gradient-to-r from-[#D4AF37] via-[#E5D3A3] to-[#D4AF37] bg-clip-text text-transparent drop-shadow-2xl">
                  BEYOND TIME
                </span>
              </motion.h1>

              <motion.p
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 2, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="text-white/75 text-xl sm:text-2xl md:text-3xl lg:text-4xl max-w-xs sm:max-w-md md:max-w-4xl mb-12 sm:mb-16 px-4"
              >
                Masterpieces of light, artistry and emotion.
              </motion.p>

              <motion.div
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 2, delay: 0.8, ease: [0.23, 1, 0.32, 1] }}
                className="flex flex-col sm:flex-row gap-6 sm:gap-8 pointer-events-auto px-4"
              >
                <button
                  onClick={() => {
                    setIsHeroComplete(true);
                    onHeroComplete?.();
                  }}
                  className="px-10 sm:px-14 py-4 sm:py-6 bg-gradient-to-r from-[#D4AF37] to-[#E5D3A3] text-black font-bold tracking-widest rounded-sm hover:shadow-[0_0_80px_rgba(212,175,55,0.7)] transition-all duration-700 hover:-translate-y-3 hover:scale-105 text-base sm:text-xl"
                >
                  EXPLORE COLLECTION
                </button>
                <button
                  onClick={() => {
                    setIsHeroComplete(true);
                    onHeroComplete?.();
                  }}
                  className="px-10 sm:px-14 py-4 sm:py-6 border-2 border-white/25 text-white/90 font-semibold tracking-widest rounded-sm hover:border-[#D4AF37] hover:text-[#D4AF37] hover:shadow-[0_0_40px_rgba(212,175,55,0.4)] transition-all duration-700 hover:scale-105 text-base sm:text-xl"
                >
                  DISCOVER CRAFTSMANSHIP
                </button>
              </motion.div>
            </motion.div>

            {/* 20%-50% Scroll - Rotation & Details */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center text-center"
              style={{
                opacity: text2Opacity,
                transform: `translateZ(120px)`,
              }}
            >
              <div className="space-y-8 sm:space-y-12 px-4">
                <motion.p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white/95 font-light tracking-widest">
                  Every detail tells a story.
                </motion.p>
                <motion.p className="text-xl sm:text-2xl md:text-3xl text-white/70">
                  Handcrafted precision meets timeless elegance.
                </motion.p>
                <motion.p className="text-base sm:text-lg md:text-xl text-white/55">
                  Designed to become an heirloom.
                </motion.p>
              </div>
            </motion.div>

            {/* 50%-80% Scroll - Peak Impact */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
              style={{
                opacity: text3Opacity,
                transform: `translateZ(160px)`,
              }}
            >
              <motion.h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-white/95 tracking-tighter mb-10 sm:mb-14 px-4"
                style={{
                  textShadow: '0 0 40px rgba(212,175,55,0.5), 0 0 80px rgba(0,0,0,0.9)',
                }}
              >
                Where Art Meets <span className="text-[#E5D3A3] drop-shadow-2xl">Brilliance</span>
              </motion.h2>

              <motion.p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/70 max-w-xs sm:max-w-md md:max-w-4xl mb-12 sm:mb-16 px-4">
                Rare gemstones. Exceptional craftsmanship. Unforgettable presence.
              </motion.p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 max-w-5xl w-full px-4 pointer-events-auto">
                {[
                  { stat: '100%', label: 'Handcrafted' },
                  { stat: 'Certified', label: 'Gemstones' },
                  { stat: 'Lifetime', label: 'Craftsmanship' }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 80, opacity: 0, rotateX: 15 }}
                    whileInView={{ y: 0, opacity: 1, rotateX: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.4, duration: 1.2, ease: 'easeOut' }}
                    className="backdrop-blur-3xl bg-white/5 border border-white/15 p-8 sm:p-12 lg:p-16 rounded-2xl"
                  >
                    <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-[#D4AF37] to-[#E5D3A3] bg-clip-text text-transparent mb-4"
                      style={{
                        textShadow: '0 0 20px rgba(212,175,55,0.4)',
                      }}
                    >
                      {item.stat}
                    </div>
                    <div className="text-white/60 text-sm sm:text-base md:text-lg tracking-widest">
                      {item.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* 80%-100% Scroll - Final CTA */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
              style={{
                opacity: text4Opacity,
                transform: `translateZ(200px)`,
              }}
            >
              <motion.h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-white/95 tracking-tighter mb-10 sm:mb-14 px-4"
                style={{
                  textShadow: '0 0 40px rgba(212,175,55,0.5), 0 0 80px rgba(0,0,0,0.9)',
                }}
              >
                Own the <span className="text-[#E5D3A3] drop-shadow-2xl">Extraordinary</span>
              </motion.h2>

              <motion.div className="flex flex-col sm:flex-row gap-6 sm:gap-8 pointer-events-auto px-4">
                <button
                  onClick={() => {
                    setIsHeroComplete(true);
                    onHeroComplete?.();
                  }}
                  className="px-12 sm:px-16 lg:px-20 py-5 sm:py-6 lg:py-8 bg-gradient-to-r from-[#D4AF37] to-[#E5D3A3] text-black font-black tracking-widest rounded-sm text-base sm:text-xl lg:text-2xl hover:shadow-[0_0_100px_rgba(212,175,55,0.8)] transition-all duration-700 hover:-translate-y-4 hover:scale-105"
                >
                  VIEW COLLECTION
                </button>
                <button
                  onClick={() => {
                    setIsHeroComplete(true);
                    onHeroComplete?.();
                  }}
                  className="px-12 sm:px-16 lg:px-20 py-5 sm:py-6 lg:py-8 border-2 border-white/25 text-white/90 font-semibold tracking-widest rounded-sm text-base sm:text-xl lg:text-2xl hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-700 hover:scale-105"
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
