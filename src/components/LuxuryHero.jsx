import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { motion, useTransform, useScroll, useSpring } from 'framer-motion';

const TOTAL_FRAMES = 41;

const LuxuryHero = ({ onHeroComplete }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isHeroComplete, setIsHeroComplete] = useState(false);
  const animationFrameRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, { damping: 30, stiffness: 100 });

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

      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const x = (canvas.width / 2) - (img.width / 2) * scale;
      const y = (canvas.height / 2) - (img.height / 2) * scale;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    }
  }, [isReady, images]);

  // Update canvas on progress change
  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (latest) => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = requestAnimationFrame(() => renderCanvas(latest));

      if (latest >= 1 && !isHeroComplete) {
        setIsHeroComplete(true);
        onHeroComplete?.();
      }
    });

    return () => {
      unsubscribe();
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [smoothProgress, renderCanvas, isHeroComplete, onHeroComplete]);

  // Resize handler
  useEffect(() => {
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        renderCanvas(scrollYProgress.get());
      }, 100);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [scrollYProgress, renderCanvas]);

  // 3D transforms based on scroll
  const canvasScale = useTransform(smoothProgress, [0, 1], [1, 1.4]);
  const canvasRotate = useTransform(smoothProgress, [0, 1], [0, -2]);
  const canvasY = useTransform(smoothProgress, [0, 1], [0, -80]);
  const glowOpacity = useTransform(smoothProgress, [0, 0.7], [0, 1]);

  // Text animations
  const text1Opacity = useTransform(smoothProgress, [0, 0.1], [1, 0]);
  const text2Opacity = useTransform(smoothProgress, [0.15, 0.2, 0.3, 0.35], [0, 1, 1, 0]);
  const text3Opacity = useTransform(smoothProgress, [0.45, 0.5, 0.6, 0.65], [0, 1, 1, 0]);
  const text4Opacity = useTransform(smoothProgress, [0.8, 0.9], [0, 1]);

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #020202 0%, #050505 30%, #070707 60%, #0a0a0a 100%)',
        height: '300vh' // 3x viewport height for cinematic scroll
      }}
    >
      {/* Loading indicator */}
      {!isReady && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#020202]">
          <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white/70 text-sm">
            Loading experience... {Math.round((imagesLoaded / TOTAL_FRAMES) * 100)}%
          </p>
        </div>
      )}

      {/* Hero container (sticky to keep canvas centered) */}
      <motion.div
        className="sticky top-0 w-full h-screen flex items-center justify-center perspective-[1200px]"
      >
        {/* Atmosphere layers */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(212,175,55,0.2) 0%, transparent 60%)',
              opacity: glowOpacity
            }}
          />
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at 50% 40%, rgba(229,211,163,0.12) 0%, transparent 50%)',
              opacity: glowOpacity
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 50% 100%, rgba(2,2,2,0.9) 0%, transparent 50%)'
            }}
          />
        </div>

        {/* Product canvas with 3D effects */}
        <motion.div
          className="relative z-10 w-full h-full flex items-center justify-center"
          style={{
            scale: canvasScale,
            rotateX: canvasRotate,
            y: canvasY,
            transformStyle: 'preserve-3d'
          }}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0"
            style={{
              filter: 'contrast(1.15) saturate(1.2)',
              boxShadow: '0 0 100px rgba(212,175,55,0.3), 0 0 200px rgba(0,0,0,0.8)'
            }}
          />
        </motion.div>

        {/* Content layers with 3D entrance */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12 h-full flex flex-col justify-between py-16 sm:py-20">
            {/* 0% Scroll - Initial Beauty Shot */}
            <motion.div
              className="flex flex-col items-center justify-center h-full text-center"
              style={{
                opacity: text1Opacity,
                transform: `translateZ(80px)`,
                transformStyle: 'preserve-3d'
              }}
            >
              <motion.h1
                initial={{ y: 60, opacity: 0, rotateX: -5 }}
                animate={{ y: 0, opacity: 1, rotateX: 0 }}
                transition={{ duration: 1.8, ease: [0.23, 1, 0.32, 1] }}
                className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl xl:text-[10rem] font-bold text-white/95 tracking-tighter mb-6 px-4"
              >
                CRAFTED <br />
                <span className="bg-gradient-to-r from-[#D4AF37] via-[#E5D3A3] to-[#D4AF37] bg-clip-text text-transparent drop-shadow-2xl">
                  BEYOND TIME
                </span>
              </motion.h1>

              <motion.p
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.8, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="text-white/70 text-lg sm:text-xl md:text-2xl lg:text-3xl max-w-xs sm:max-w-md md:max-w-3xl mb-10 sm:mb-14 px-4"
              >
                Masterpieces of light, artistry and emotion.
              </motion.p>

              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.8, delay: 0.7, ease: [0.23, 1, 0.32, 1] }}
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 pointer-events-auto px-4"
              >
                <button className="px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-[#D4AF37] to-[#E5D3A3] text-black font-bold tracking-wider rounded-sm hover:shadow-[0_0_50px_rgba(212,175,55,0.5)] transition-all duration-700 hover:-translate-y-2 hover:scale-105 text-base sm:text-lg">
                  EXPLORE COLLECTION
                </button>
                <button className="px-8 sm:px-10 py-4 sm:py-5 border-2 border-white/20 text-white/90 font-semibold rounded-sm hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-700 hover:scale-105 text-base sm:text-lg">
                  DISCOVER CRAFTSMANSHIP
                </button>
              </motion.div>
            </motion.div>

            {/* 20%-50% Scroll - Rotation & Details */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center text-center"
              style={{
                opacity: text2Opacity,
                transform: `translateZ(120px)`
              }}
            >
              <div className="space-y-6 sm:space-y-8 px-4">
                <motion.p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white/95 font-light tracking-wide">
                  Every detail tells a story.
                </motion.p>
                <motion.p className="text-lg sm:text-xl md:text-2xl text-white/65">
                  Handcrafted precision meets timeless elegance.
                </motion.p>
                <motion.p className="text-sm sm:text-base md:text-lg text-white/55">
                  Designed to become an heirloom.
                </motion.p>
              </div>
            </motion.div>

            {/* 50%-80% Scroll - Peak Impact */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
              style={{
                opacity: text3Opacity,
                transform: `translateZ(160px)`
              }}
            >
              <motion.h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white/95 tracking-tighter mb-8 sm:mb-10 px-4">
                Where Art Meets <span className="text-[#E5D3A3] drop-shadow-2xl">Brilliance</span>
              </motion.h2>

              <motion.p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/65 max-w-xs sm:max-w-md md:max-w-3xl mb-10 sm:mb-14 px-4">
                Rare gemstones. Exceptional craftsmanship. Unforgettable presence.
              </motion.p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-5xl w-full px-4 pointer-events-auto">
                {[
                  { stat: '100%', label: 'Handcrafted' },
                  { stat: 'Certified', label: 'Gemstones' },
                  { stat: 'Lifetime', label: 'Craftsmanship' }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 60, opacity: 0, rotateX: 10 }}
                    whileInView={{ y: 0, opacity: 1, rotateX: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.3, duration: 1, ease: "easeOut" }}
                    className="backdrop-blur-3xl bg-white/5 border border-white/15 p-6 sm:p-8 lg:p-10 rounded-2xl"
                  >
                    <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#E5D3A3] bg-clip-text text-transparent mb-3">
                      {item.stat}
                    </div>
                    <div className="text-white/60 text-sm sm:text-base md:text-lg">
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
                transform: `translateZ(200px)`
              }}
            >
              <motion.h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white/95 tracking-tighter mb-8 sm:mb-10 px-4">
                Own the <span className="text-[#E5D3A3] drop-shadow-2xl">Extraordinary</span>
              </motion.h2>

              <motion.div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pointer-events-auto px-4">
                <button
                  onClick={() => {
                    setIsHeroComplete(true);
                    if (onHeroComplete) onHeroComplete();
                  }}
                  className="px-8 sm:px-12 lg:px-16 py-4 sm:py-5 lg:py-6 bg-gradient-to-r from-[#D4AF37] to-[#E5D3A3] text-black font-bold tracking-wider rounded-sm text-base sm:text-lg lg:text-xl hover:shadow-[0_0_60px_rgba(212,175,55,0.6)] transition-all duration-700 hover:-translate-y-2 hover:scale-105"
                >
                  VIEW COLLECTION
                </button>
                <button className="px-8 sm:px-12 lg:px-16 py-4 sm:py-5 lg:py-6 border-2 border-white/20 text-white/90 font-semibold rounded-sm text-base sm:text-lg lg:text-xl hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-700 hover:scale-105">
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
