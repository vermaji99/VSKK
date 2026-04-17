import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const moveCursor = (e) => {
      const { clientX, clientY } = e;
      
      // Move main cursor
      gsap.to(cursorRef.current, {
        x: clientX,
        y: clientY,
        duration: 0.15,
        ease: 'power2.out',
      });

      // Move soft golden glow
      gsap.to(glowRef.current, {
        x: clientX,
        y: clientY,
        duration: 0.8,
        ease: 'power2.out',
      });
    };

    const handleHover = () => {
      gsap.to(cursorRef.current, {
        scale: 4,
        backgroundColor: 'transparent',
        border: '0.5px solid rgba(212, 175, 55, 0.4)',
        duration: 0.5,
        ease: 'power3.out'
      });
      gsap.to(glowRef.current, {
        scale: 1.5,
        opacity: 0.4,
        duration: 0.5
      });
    };

    const handleHoverExit = () => {
      gsap.to(cursorRef.current, {
        scale: 1,
        backgroundColor: '#D4AF37',
        border: 'none',
        duration: 0.5,
        ease: 'power3.out'
      });
      gsap.to(glowRef.current, {
        scale: 1,
        opacity: 0.2,
        duration: 0.5
      });
    };

    window.addEventListener('mousemove', moveCursor);

    const interactiveElements = document.querySelectorAll('a, button, .interactive, .glass-card, .glass-card-3d');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleHover);
      el.addEventListener('mouseleave', handleHoverExit);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleHover);
        el.removeEventListener('mouseleave', handleHoverExit);
      });
    };
  }, []);

  return (
    <>
      {/* Main Cursor Dot */}
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-2 h-2 bg-accent-gold rounded-full pointer-events-none z-[9999] hidden md:block mix-blend-difference" 
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      {/* Soft Golden Radial Glow */}
      <div 
        ref={glowRef} 
        className="fixed top-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none z-[9998] hidden md:block opacity-20" 
        style={{ 
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle at center, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
          filter: 'blur(40px)'
        }}
      />
    </>
  );
};

export default CustomCursor;
