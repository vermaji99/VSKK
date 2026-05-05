import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Experience, { Overlay } from './components/Experience';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import AdminLogin from './components/Admin/Login';
import AdminDashboard from './components/Admin/Dashboard';
import ProtectedRoute from './components/Admin/ProtectedRoute';
import Lenis from '@studio-freight/lenis';

function MainLayout({ scrollProgress, scaleX }) {
  return (
    <div className="relative bg-luxury-black text-white selection:bg-accent-gold selection:text-black min-h-screen">
      <div className="light-leak top-[-10%] left-[-10%] opacity-20" />
      <div className="light-leak bottom-[-10%] right-[-10%] opacity-15" />
      
      {/* Scroll Progress Indicator */}
      <motion.div className="scroll-progress" style={{ scaleX }} />
      
      <CustomCursor />
      <Navbar />
      
      <main>
        <Experience scrollProgress={scrollProgress} />
        <Overlay />
      </main>
    </div>
  );
}

function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const smoothProgress = useSpring(scrollYProgress, { damping: 20, stiffness: 100 });

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      wheelMultiplier: 1,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    const unsubscribe = smoothProgress.on("change", (latest) => {
      setScrollProgress(latest);
    });

    return () => {
      lenis.destroy();
      unsubscribe();
    };
  }, [smoothProgress]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout scrollProgress={scrollProgress} scaleX={scaleX} />} />
        
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
