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
    const ctx = canvas.getContext('2d', { 
      alpha: false, 
      willReadFrequently: false 
    });

    const index = Math.floor(progress * (TOTAL_FRAMES - 1));
    const clampedIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, index));

    if (images[clampedIndex] && images[clampedIndex].complete) {
      const img = images[clampedIndex];
      
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const x = (canvas.width / 2) - (img.width / 2) * scale;
      const y = (canvas.height / 2) - (img.height / 2) * scale;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    }
  }, [isReady, images]);

  // Update progress and check completion
  const updateProgress = useCallback((delta) => {
    const sensitivity = window.innerWidth < 768 ? 1200 : 1800;
    setScrollProgress(prev => {
      const newProgress = Math.max(0, Math.min(1, prev + delta / sensitivity));
      
      if (newProgress >= 1 && !isHeroComplete) {
        setIsHeroComplete(true);
        onHeroComplete?.();
      }
      
      return newProgress;
    });
  }, [isHeroComplete, onHeroComplete]);

  // Handle scroll events for hero progress
  useEffect(() => {
    if (!isReady || isHeroComplete) return;

    const handleWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      updateProgress(e.deltaY);
    };

    const handleTouchStart = (e) => {
      if (e.touches && e.touches[0]) {
        lastTouchYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (e.touches && e.touches[0] && lastTouchYRef.current !== null) {
        const currentY = e.touches[0].clientY;
        const deltaY = lastTouchYRef.current - currentY;
        updateProgress(deltaY);
        lastTouchYRef.current = currentY;
      }
    };

    const handleTouchEnd = () => {
      lastTouchYRef.current = null;
    };

    window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true, capture: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true, capture: true });

    return () => {
      window.removeEventListener('wheel', handleWheel, { capture: true });
      window.removeEventListener('touchstart', handleTouchStart, { capture: true });
      window.removeEventListener('touchmove', handleTouchMove, { capture: true });
      window.removeEventListener('touchend', handleTouchEnd, { capture: true });
    };
  }, [isReady, isHeroComplete, updateProgress]);

  // Update canvas on progress change
  useEffect(() => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(() => renderCanvas(scrollProgress));
  }, [scrollProgress, renderCanvas]);

  // Resize handler
  useEffect(() => {
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        renderCanvas(scrollProgress);
      }, 100);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, [scrollProgress, renderCanvas]);

  // 3D transforms based on scroll
  const canvasScale = useTransform(() => 1 + (scrollProgress * 0.25));
  const canvasRotate = useTransform(() => -(scrollProgress * 1));
  const canvasY = useTransform(() => -(scrollProgress * 40));
  const glowOpacity = useTransform(() => Math.min(1, scrollProgress / 0.6));

  // Particle component
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
            boxShadow: '0 0 8px rgba(212,175,55,0.7), 0 0 16px rgba(212,175,55,0.4)',
          }}
          animate={{
            y: [0, -40 - Math.random() * 40],
            opacity: [0, 0.7, 0],
            x: [0, (Math.random() - 0.5) * 18],
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
          background: `linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.04) 45%, rgba(212,175,55,0.08) 50%, rgba(212,175,55,0.04) 55%, transparent 100%)`,
        }}
        animate={{
          opacity: [0.18, 0.45, 0.18],
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

      {/* Hero container */}
      <motion.div
        className="sticky top-0 w-full h-screen flex items-center justify-center perspective-[1200px] overflow-hidden"
      >
        {/* Volumetric fog layers */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(229,211,163,0.12) 0%, transparent 60%)',
              opacity: glowOpacity,
            }}
            animate={{
              opacity: [0.08, 0.25, 0.08],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 70% 70%, rgba(212,175,55,0.08) 0%, transparent 50%)',
              opacity: glowOpacity,
            }}
            animate={{
              opacity: [0.12, 0.22, 0.12],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
        </div>

        {/* Floating particles */}
        {[...Array(window.innerWidth < 768 ? 15 : 30)].map((_, i) => (
          <Particle key={i} i={i} />
        ))}

        {/* Light beams */}
        {[...Array(window.innerWidth < 768 ? 2 : 4)].map((_, i) => (
          <LightBeam key={i} i={i} />
        ))}

        {/* Product canvas */}
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
              filter: 'contrast(1.12) saturate(1.18) drop-shadow(0 0 45px rgba(212,175,55,0.35))',
            }}
          />
        </motion.div>

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
      </motion.div>
    </section>
  );
};

export default LuxuryHero;
