import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const LuxuryNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Collections', href: '#collections' },
    { name: 'Jewelry', href: '#jewelry' },
    { name: 'Craftsmanship', href: '#craftsmanship' },
    { name: 'About', href: '#about' }
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    setIsOpen(false);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-[1000] px-4 sm:px-6 lg:px-12 flex items-center justify-between transition-all duration-700 ${
        isScrolled || isOpen 
          ? 'py-3 sm:py-4' 
          : 'py-4 sm:py-6 md:py-8'
      }`}
      style={{
        background: isScrolled || isOpen 
          ? 'rgba(2, 2, 2, 0.75)' 
          : 'rgba(2, 2, 2, 0)',
        backdropFilter: isScrolled || isOpen ? 'blur(30px) saturate(120%)' : 'blur(0px) saturate(100%)',
        WebkitBackdropFilter: isScrolled || isOpen ? 'blur(30px) saturate(120%)' : 'blur(0px) saturate(100%)',
        borderBottom: isScrolled || isOpen ? '1px solid rgba(212, 175, 55, 0.15)' : '1px solid transparent',
        boxShadow: isScrolled || isOpen ? '0 8px 32px -8px rgba(0, 0, 0, 0.6), 0 1px 0 rgba(255, 255, 255, 0.05) inset' : 'none'
      }}
    >
      {/* Logo */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-lg sm:text-xl md:text-2xl font-bold z-[1002]"
      >
        <span className="text-white tracking-tight">
          VSKK
        </span>
      </motion.div>

      {/* Desktop Links */}
      <div className="hidden lg:flex items-center gap-6 xl:gap-12">
        {navLinks.map((link, i) => (
          <motion.a
            key={link.name}
            href={link.href}
            onClick={(e) => handleNavClick(e, link.href)}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="text-white/70 hover:text-white transition-all duration-500 relative group text-sm md:text-base"
          >
            {link.name}
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gradient-to-r from-[#D4AF37] to-[#E5D3A3] transition-all duration-500 group-hover:w-full shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
          </motion.a>
        ))}
      </div>

      {/* CTA Button and Mobile Toggle */}
      <div className="flex items-center gap-3 sm:gap-4">
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          onClick={(e) => handleNavClick(e, '#collections')}
          className="px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-[#D4AF37] to-[#E5D3A3] text-black font-semibold rounded-sm hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-500 hover:-translate-y-0.5 text-xs sm:text-sm md:text-base"
        >
          Shop Now
        </motion.button>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-white p-2 z-[1002] hover:text-[#D4AF37] transition-colors duration-300"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={20} sm:size={24} /> : <Menu size={20} sm:size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-0 bg-[#050505] z-[1001] flex flex-col items-center justify-center px-6 sm:px-10"
          >
            <div className="flex flex-col items-center gap-6 sm:gap-8 z-10 w-full">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                  className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-white hover:text-[#D4AF37] transition-colors duration-300"
                >
                  {link.name}
                </motion.a>
              ))}
              
              <motion.button
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                onClick={(e) => handleNavClick(e, '#collections')}
                className="mt-10 sm:mt-12 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 bg-gradient-to-r from-[#D4AF37] to-[#E5D3A3] text-black font-semibold rounded-sm text-sm sm:text-base lg:text-lg"
              >
                Shop Now
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default LuxuryNavbar;
