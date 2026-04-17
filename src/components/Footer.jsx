import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Mail, Link, Smartphone, ArrowUp } from 'lucide-react';

const Footer = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / scrollHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-luxury-black py-20 md:py-32 border-t border-white/5 relative overflow-hidden">
      {/* Scroll Progress Indicator */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-white/5 z-[200]">
        <motion.div 
          className="h-full bg-luxury-gold shadow-[0_0_15px_rgba(212,175,55,0.5)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-16 md:gap-20 mb-20 md:mb-32">
          <div className="max-w-md space-y-6 md:space-y-10">
            <h2 className="text-3xl md:text-4xl font-bold gold-text tracking-[0.3em] uppercase">Vaibhav</h2>
            <p className="text-white/40 text-base md:text-lg leading-relaxed font-light tracking-widest italic">
              "Crafting the future of luxury, anchored in the traditions of excellence. Your story, written in brilliance."
            </p>
            <div className="flex space-x-6 md:space-x-8">
              {[Globe, Mail, Link, Smartphone].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -5, color: '#D4AF37' }}
                  className="text-white/30 transition-colors duration-500 interactive"
                >
                  <Icon size={18} md:size={20} />
                </motion.a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-20 w-full md:w-auto">
            <div className="space-y-6 md:space-y-8">
              <h4 className="text-white tracking-[0.4em] uppercase text-[8px] md:text-[10px] font-bold">Explore</h4>
              <ul className="space-y-3 md:space-y-4">
                {['Home', 'Collections', 'Masterpieces', 'About', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase()}`} className="text-white/30 hover:text-luxury-gold transition-all duration-500 text-[8px] md:text-[10px] tracking-[0.3em] uppercase interactive">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6 md:space-y-8">
              <h4 className="text-white tracking-[0.4em] uppercase text-[8px] md:text-[10px] font-bold">Visit</h4>
              <ul className="space-y-3 md:space-y-4 text-white/30 text-[8px] md:text-[10px] tracking-[0.3em] uppercase leading-loose">
                <li>Gold Market, Mumbai</li>
                <li>Mon - Sat: 10 - 8</li>
                <li>Sun: 11 - 5</li>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1 flex justify-center md:block">
              <button 
                onClick={scrollToTop}
                className="group w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/10 flex items-center justify-center text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black transition-all duration-700 interactive"
              >
                <ArrowUp size={20} md:size={24} className="group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-12 md:pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
          <p className="text-white/10 text-[6px] md:text-[8px] tracking-[0.5em] uppercase text-center md:text-left">
            © 2026 Vaibhav Swarn Kala Kendra. All Rights Reserved.
          </p>
          <div className="flex space-x-8 md:space-x-12">
            <a href="#" className="text-white/10 hover:text-white/30 transition-colors text-[6px] md:text-[8px] tracking-[0.5em] uppercase interactive">Privacy Policy</a>
            <a href="#" className="text-white/10 hover:text-white/30 transition-colors text-[6px] md:text-[8px] tracking-[0.5em] uppercase interactive">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
