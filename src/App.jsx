import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LuxuryHero from './components/LuxuryHero';
import LuxuryNavbar from './components/LuxuryNavbar';
import CustomCursor from './components/CustomCursor';
import AdminLogin from './components/Admin/Login';
import AdminDashboard from './components/Admin/Dashboard';
import ProtectedRoute from './components/Admin/ProtectedRoute';
import { Overlay } from './components/Experience';
import Lenis from '@studio-freight/lenis';

function MainLayout({ scrollProgress, scaleX, isHeroComplete, setIsHeroComplete }) {
  // Freeze scroll until hero is complete
  useEffect(() => {
    if (!isHeroComplete) {
      const preventScroll = (e) => e.preventDefault();
      document.body.style.overflow = 'hidden';
      window.addEventListener('scroll', preventScroll, { passive: false, capture: true });
      window.addEventListener('wheel', preventScroll, { passive: false, capture: true });
      window.addEventListener('touchmove', preventScroll, { passive: false, capture: true });

      return () => {
        document.body.style.overflow = 'auto';
        window.removeEventListener('scroll', preventScroll, { capture: true });
        window.removeEventListener('wheel', preventScroll, { capture: true });
        window.removeEventListener('touchmove', preventScroll, { capture: true });
      };
    }
  }, [isHeroComplete]);

  useEffect(() => {
    if (isHeroComplete) {
      // Smooth scroll to the Overlay section
      const overlaySection = document.getElementById('overlay-section');
      if (overlaySection) {
        overlaySection.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Fallback: scroll by one viewport height
        window.scrollBy({
          top: window.innerHeight,
          behavior: 'smooth'
        });
      }
    }
  }, [isHeroComplete]);

  return (
    <div className="relative bg-[#020202] text-white overflow-x-hidden">
      <CustomCursor />
      <LuxuryNavbar />
      
      <main>
        <LuxuryHero onHeroComplete={() => setIsHeroComplete(true)} />
        {isHeroComplete && (
          <div id="overlay-section">
            <Overlay />
          </div>
        )}
      </main>
    </div>
  );
}

function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHeroComplete, setIsHeroComplete] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const smoothProgress = useSpring(scrollYProgress, { damping: 20, stiffness: 100 });
  const lenisRef = useRef(null);
  const rafIdRef = useRef(null);

  useEffect(() => {
    if (isHeroComplete) {
      const lenis = new Lenis({
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        wheelMultiplier: 1,
        infinite: false,
      });
      lenisRef.current = lenis;

      function raf(time) {
        lenis.raf(time);
        rafIdRef.current = requestAnimationFrame(raf);
      }

      rafIdRef.current = requestAnimationFrame(raf);

      const unsubscribe = smoothProgress.on("change", (latest) => {
        setScrollProgress(latest);
      });

      return () => {
        if (lenis) lenis.destroy();
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        unsubscribe();
      };
    } else {
      // Hero not complete: clean up Lenis if it exists
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    }
  }, [smoothProgress, isHeroComplete]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout scrollProgress={scrollProgress} scaleX={scaleX} isHeroComplete={isHeroComplete} setIsHeroComplete={setIsHeroComplete} />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
