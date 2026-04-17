import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { BUSINESS_DETAILS } from '../constants/business';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Collections', href: '#collections' },
    { name: 'Masterpieces', href: '#featured' },
    { name: 'Our Story', href: '#craftsmanship' },
    { name: 'Contact', href: '#bespoke' }
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-1000 px-6 md:px-20 flex items-center justify-between ${
        isScrolled || isOpen ? 'bg-deep-black border-b border-white/5 py-6' : 'bg-transparent py-12'
      }`}
    >
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl md:text-3xl z-[1002] whitespace-nowrap group"
      >
        <span className="logo-vskk cursor-none">VSKK</span>
        <div className="text-[8px] tracking-[0.8em] text-white/20 mt-1 uppercase font-light group-hover:text-accent-gold/40 transition-colors duration-700">Atelier</div>
      </motion.div>

      {/* Desktop Links */}
      <div className="hidden lg:flex items-center gap-8 xl:gap-16">
        {navLinks.map((link, i) => (
          <motion.a
            key={link.name}
            href={link.href}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="small-text !text-white/40 hover:!text-accent-gold transition-all duration-700 relative group cursor-none px-2 py-1"
          >
            {link.name}
            <span className="absolute -bottom-2 left-1/2 w-0 h-[1px] bg-accent-gold transition-all duration-700 group-hover:w-full group-hover:left-0 shadow-[0_0_10px_#D4AF37]" />
          </motion.a>
        ))}
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => document.getElementById('bespoke').scrollIntoView({ behavior: 'smooth' })}
          className="hidden md:block px-8 xl:px-12 py-3 border border-white/10 small-text !text-white hover:border-accent-gold hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all duration-700 cursor-none relative overflow-hidden group"
        >
          <span className="relative z-10">Inquiry</span>
          <div className="absolute inset-0 bg-accent-gold/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
        </motion.button>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-white p-2 z-[1002] cursor-none hover:text-accent-gold transition-colors"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={28} strokeWidth={1.5} /> : <Menu size={28} strokeWidth={1.5} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 bg-[#0a0a0a] z-[1001] flex flex-col items-center justify-center px-10"
          >
            {/* Decorative background element for mobile menu */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none opacity-[0.03] select-none">
              <h2 className="text-[15vw] font-bold uppercase tracking-tighter text-white">VAIBHAV</h2>
            </div>

            <div className="flex flex-col items-center gap-8 md:gap-12 z-10 w-full mt-20">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => setIsOpen(false)}
                  className="text-2xl md:text-6xl font-serif tracking-[0.2em] uppercase text-white hover:text-accent-gold transition-all duration-500 luxury-shimmer text-center w-full px-4"
                >
                  {link.name}
                </motion.a>
              ))}
              
              <motion.button
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                onClick={() => {
                  setIsOpen(false);
                  document.getElementById('bespoke').scrollIntoView({ behavior: 'smooth' });
                }}
                className="mt-16 w-full max-w-[280px] py-6 border border-accent-gold text-accent-gold small-text hover:bg-accent-gold hover:text-black transition-all duration-700 tracking-[0.5em]"
              >
                Inquiry
              </motion.button>
            </div>

            {/* Bottom info in mobile menu */}
            <div className="absolute bottom-12 left-0 w-full text-center opacity-40">
              <div className="w-12 h-[1px] bg-accent-gold/40 mx-auto mb-6" />
              <p className="small-text !text-[10px] !tracking-[0.5em] text-white uppercase">{BUSINESS_DETAILS.address.split(',')[1]} &bull; {BUSINESS_DETAILS.address.split(',')[2]}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
