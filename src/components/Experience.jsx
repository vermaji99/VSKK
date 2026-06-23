import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { BUSINESS_DETAILS, getWhatsAppLink } from '../constants/business';
import { Phone, MessageCircle } from 'lucide-react';
import FuturisticCinematic from './FuturisticCinematic';

// --- ANIMATION HELPERS ---

const CountUp = React.memo(({ value, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = parseInt(value.replace(/[^0-9]/g, ''));
      if (start === end) return;

      let totalMilisecondsSecs = duration * 1000;
      let incrementTime = (totalMilisecondsSecs / end);

      let timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === end) clearInterval(timer);
      }, incrementTime);

      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{count}{value.replace(/[0-9]/g, '')}</span>;
});

// --- UI COMPONENTS ---

const SectionTitle = ({ children, subtitle }) => (
  <motion.div 
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    className="mb-16 md:mb-20 lg:mb-28"
  >
    <motion.p 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      className="small-text !text-accent-gold mb-4 md:mb-6"
    >
      {subtitle}
    </motion.p>
    <h2 className="luxury-shimmer inline-block">
      {children}
    </h2>
    <div className="w-12 md:w-16 h-[1px] bg-accent-gold/40 mt-6 md:mt-10" />
  </motion.div>
);

const ScrollReveal = ({ children, delay = 0, y = 50 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 1, 
        delay, 
        ease: [0.22, 1, 0.36, 1],
        scale: { duration: 1.2 }
      }}
    >
      {children}
    </motion.div>
  );
};

const SectionDivider = () => (
  <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-accent-gold/30 to-transparent my-12 md:my-16 lg:my-20" />
);

const Overlay = () => {
  return (
    <div className="w-screen text-white font-sans selection:bg-accent-gold selection:text-black overflow-x-hidden relative">
      {/* 💎 Masterpiece Section */}
      <section id="featured" className="section-padding px-4 sm:px-6 md:px-20 lg:px-40 bg-[#020202]/85 backdrop-blur-md relative overflow-hidden z-10">
        <div className="flex flex-col lg:flex-row items-center gap-10 md:gap-16 lg:gap-32 xl:gap-48">
          <div className="w-full lg:w-1/2">
            <ScrollReveal>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[8px] shadow-2xl group cursor-none glass-card-3d">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-full h-full bg-gradient-to-br from-[#D4AF37]/10 to-[#020202] flex items-center justify-center"
                >
                  <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl gold-text luxury-shimmer">VSKK</div>
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-deep-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              </div>
            </ScrollReveal>
          </div>
          
          <div className="w-full lg:w-1/2 max-w-2xl text-center lg:text-left">
            <ScrollReveal delay={0.4}>
              <SectionTitle subtitle="Masterpiece Crafted">The Eternal Radiance</SectionTitle>
              <p className="mb-8 md:mb-12 lg:mb-20 text-sm sm:text-base md:text-[18px] lg:text-[20px]">
                A masterpiece crafted to transcend time. Each piece reflects the harmony of brilliance, precision, and enduring sophistication. Designed for those who appreciate the quiet confidence of true luxury.
              </p>
              <a href="#collections" className="btn-premium inline-block">
                Explore Collection
              </a>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* 📜 Quote Section */}
      <section className="py-20 md:py-32 lg:py-48 px-4 sm:px-6 md:px-10 bg-[#020202]/85 backdrop-blur-md flex items-center justify-center text-center relative overflow-hidden z-10">
        <ScrollReveal>
          <div className="max-w-3xl md:max-w-4xl">
            <h2 className="leading-[1.2] mb-6 md:mb-10 lg:mb-16 font-light text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
              "True luxury is the quiet confidence born from <span className="gold-text italic luxury-shimmer">precision, patience,</span> and timeless craftsmanship."
            </h2>
            <div className="w-10 md:w-16 lg:w-20 h-[1px] bg-accent-gold/30 mx-auto" />
          </div>
        </ScrollReveal>
      </section>

      <SectionDivider />

      {/* Futuristic Cinematic Section (in center) */}
      <FuturisticCinematic />

      <SectionDivider />

      {/* 🧊 Sovereign Standards */}
      <section id="collections" className="section-padding px-4 sm:px-6 md:px-20 lg:px-40 bg-[#020202]/85 backdrop-blur-md relative overflow-hidden z-10">
        <ScrollReveal>
          <SectionTitle subtitle="Our Commitment">The Sovereign Standards</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-16">
            {[
              { id: 'standard-1', title: "Craftsmanship", desc: "Our commitment to artisanal perfection in every forged piece.", val: "100%" },
              { id: 'standard-2', title: "Purity", desc: "24K gold, the purest form for the most exquisite creations.", val: "24K" },
              { id: 'standard-3', title: "Excellence", desc: "Every piece undergoes rigorous quality checks to ensure perfection.", val: "0.1%" }
            ].map((card, i) => (
              <motion.div 
                key={card.title}
                whileHover={{ y: -15, scale: 1.02 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                className="glass-card-3d p-6 md:p-8 lg:p-16 flex flex-col items-center text-center group"
              >
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                  className="text-3xl md:text-4xl lg:text-6xl font-serif text-accent-gold mb-4 md:mb-6 lg:mb-10 group-hover:scale-110 transition-transform duration-700 luxury-shimmer"
                >
                  <CountUp value={card.val} />
                </motion.div>
                <h3 className="text-lg md:text-xl lg:text-2xl tracking-[0.3em] uppercase mb-3 md:mb-4 lg:mb-6 text-white/90">{card.title}</h3>
                <p className="small-text !lowercase !tracking-wider leading-relaxed opacity-60 group-hover:text-white/60 transition-colors">
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <SectionDivider />

      {/* 📧 Contact Section */}
      <section id="bespoke" className="flex flex-col lg:flex-row min-h-screen bg-[#020202]/90 backdrop-blur-md z-10">
        <div className="w-full lg:w-1/2 p-6 sm:p-8 md:p-16 lg:p-24 xl:p-40 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/5">
          <ScrollReveal>
            <SectionTitle subtitle="Bespoke Concierge">Contact Us</SectionTitle>
            <p className="text-base sm:text-lg md:text-xl mb-10 md:mb-16 lg:mb-24 opacity-60 text-center lg:text-left">
              Visit our showroom at Main Chowk, Doharighat. Our master artisans are ready to translate your vision into a timeless masterpiece.
            </p>
            
            <div className="space-y-6 md:space-y-10 lg:space-y-16 flex flex-col items-center lg:items-start">
              <div className="group cursor-none text-center lg:text-left">
                <p className="small-text mb-2 md:mb-4 !text-accent-gold">Showroom Address</p>
                <p className="text-white/80 text-sm sm:text-base md:text-[18px] group-hover:text-white transition-colors">
                  {BUSINESS_DETAILS.address.split(',').slice(0, 2).join(',')} <br />
                  {BUSINESS_DETAILS.address.split(',').slice(2).join(',')}
                </p>
              </div>
              <div className="group cursor-none text-center lg:text-left">
                <p className="small-text mb-2 md:mb-4 !text-accent-gold">Phone Numbers</p>
                <div className="flex flex-col gap-2">
                  {BUSINESS_DETAILS.phones.map((phone, i) => (
                    <a key={i} href={`tel:${phone.value}`} className="text-white/80 text-sm sm:text-base md:text-[18px] group-hover:text-white transition-colors hover:text-accent-gold flex items-center gap-3">
                      <Phone size={16} sm:size={18} /> {phone.display}
                    </a>
                  ))}
                </div>
              </div>
              <div className="group cursor-none text-center lg:text-left">
                <p className="small-text mb-2 md:mb-4 !text-accent-gold">WhatsApp Enquiry</p>
                <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="text-white/80 text-sm sm:text-base md:text-[18px] group-hover:text-white transition-colors hover:text-accent-gold flex items-center gap-3">
                  <MessageCircle size={16} sm:size={18} /> Chat with us on WhatsApp
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 1.1 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="w-full lg:w-1/2 min-h-[400px] md:min-h-[500px] bg-deep-black relative overflow-hidden"
        >
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3586.2415740441!2d83.5186!3d26.2736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDE2JzI1LjAiTiA4M8KwMzEnMDcuMCJF!5e0!3m2!1sen!2sin!4v1713270000000!5m2!1sen!2sin"
            className="w-full h-full border-0 grayscale invert opacity-40 hover:opacity-60 transition-opacity duration-1000"
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="VSKK Location"
          ></iframe>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px rgba(0,0,0,0.8)]" />
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 md:py-20 lg:py-40 px-4 sm:px-6 md:px-20 lg:px-40 bg-[#020202]/90 backdrop-blur-md border-t border-white/5 relative overflow-hidden z-10">
        <div className="absolute bottom-0 right-0 w-1/3 h-full bg-gradient-to-tl from-accent-gold/5 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 md:gap-16 lg:gap-24 mb-16 md:mb-20 lg:mb-40">
          <div className="max-w-xs sm:max-w-sm md:max-w-md text-center md:text-left group">
            <div className="mb-6 md:mb-12">
              <span className="logo-vskk text-3xl sm:text-4xl md:text-5xl lg:text-6xl">VSKK</span>
              <div className="text-[10px] tracking-[1em] text-white/20 mt-2 uppercase font-light group-hover:text-accent-gold/40 transition-colors duration-700">Swarn Kala Kendra</div>
            </div>
            <p className="small-text !lowercase !tracking-widest leading-loose text-white/30">
              Defining digital luxury through traditional craftsmanship and Mau's rich heritage. A legacy of excellence since 1990. Crafted in Doharighat, available globally.
            </p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-8 md:gap-12 lg:gap-40 w-full md:w-auto">
            <div>
              <h4 className="small-text mb-6 md:mb-12 !text-white !tracking-[0.6em]">Contact</h4>
              <ul className="space-y-3 md:space-y-6 small-text !lowercase !text-white/20">
                {BUSINESS_DETAILS.phones.map((phone, i) => (
                  <li key={i}><a href={`tel:${phone.value}`} className="hover:text-accent-gold transition-all duration-500">{phone.display}</a></li>
                ))}
                <li><a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="hover:text-accent-gold transition-all duration-500">WhatsApp Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="small-text mb-6 md:mb-12 !text-white !tracking-[0.6em]">Social</h4>
              <ul className="space-y-3 md:space-y-6 small-text !lowercase !text-white/20">
                <li><a href="#" className="hover:text-accent-gold transition-all duration-500">Instagram</a></li>
                <li><a href="#" className="hover:text-accent-gold transition-all duration-500">Facebook</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="pt-8 md:pt-12 lg:pt-20 border-t border-white/5 text-center">
          <span className="small-text !text-white/10 !tracking-[0.5em] md:tracking-[0.8em] text-[8px] md:text-[10px]">© 2026 {BUSINESS_DETAILS.name}. All Rights Reserved.</span>
        </div>
      </footer>
    </div>
  );
};

export { Overlay };
export default Overlay;
