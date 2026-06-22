import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LuxuryHero from './components/LuxuryHero';
import LuxuryNavbar from './components/LuxuryNavbar';
import CustomCursor from './components/CustomCursor';
import AdminLogin from './components/Admin/Login';
import AdminDashboard from './components/Admin/Dashboard';
import ProtectedRoute from './components/Admin/ProtectedRoute';
import { Overlay } from './components/Experience';
import Lenis from '@studio-freight/lenis';

function MainLayout({ isHeroComplete, setIsHeroComplete }) {
  // Freeze scroll until hero is complete - only set body overflow
  useEffect(() => {
    document.body.style.overflow = isHeroComplete ? 'auto' : 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isHeroComplete]);

  // Scroll to overlay when hero completes
  useEffect(() => {
    if (isHeroComplete) {
      const overlaySection = document.getElementById('overlay-section');
      if (overlaySection) {
        overlaySection.scrollIntoView({ behavior: 'smooth' });
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
  const [isHeroComplete, setIsHeroComplete] = useState(false);
  const lenisRef = useRef(null);
  const rafIdRef = useRef(null);

  // Initialize Lenis only when hero is complete
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

      return () => {
        if (lenisRef.current) lenisRef.current.destroy();
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      };
    } else {
      // Clean up Lenis when hero starts
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    }
  }, [isHeroComplete]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout isHeroComplete={isHeroComplete} setIsHeroComplete={setIsHeroComplete} />} />
        
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
