import React from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, MapPin, Send } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="bg-luxury-black py-40 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-luxury-gold/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-luxury-gold tracking-[0.4em] uppercase text-xs mb-6"
            >
              Inquiries
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-8xl font-premium gold-text tracking-widest uppercase mb-10 leading-tight"
            >
              Get in <br /> Touch
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/50 text-xl font-light tracking-widest mb-16 max-w-lg leading-relaxed italic"
            >
              "Your journey to timeless elegance begins with a single conversation. We are here to assist you."
            </motion.p>

            <div className="space-y-12">
              {[
                { icon: Phone, label: "Call Us", value: "+91 98765 43210" },
                { icon: MessageCircle, label: "WhatsApp", value: "+91 98765 43210" },
                { icon: MapPin, label: "Visit Us", value: "Luxury Arcade, Mumbai" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center space-x-8 group interactive"
                >
                  <div className="w-16 h-16 rounded-full glass flex items-center justify-center text-luxury-gold border border-luxury-gold/10 group-hover:bg-luxury-gold group-hover:text-luxury-black transition-all duration-700 shadow-[0_0_20px_rgba(212,175,55,0)] group-hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <p className="text-white/30 text-[10px] tracking-[0.4em] uppercase mb-2">{item.label}</p>
                    <p className="text-xl text-white tracking-[0.1em] font-light group-hover:text-luxury-gold transition-colors duration-500">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="glass p-12 md:p-20 rounded-sm relative border border-luxury-gold/10 shadow-[0_0_60px_rgba(0,0,0,0.6)]"
          >
            <form className="space-y-12 relative z-10">
              <div className="space-y-4 group">
                <label className="text-white/30 text-[10px] tracking-[0.4em] uppercase ml-1 group-focus-within:text-luxury-gold transition-colors duration-500">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full bg-transparent border-b border-white/10 py-4 focus:outline-none focus:border-luxury-gold text-white tracking-widest transition-all duration-700 focus:shadow-[0_5px_15px_-5px_rgba(212,175,55,0.2)] placeholder:text-white/10"
                />
              </div>

              <div className="space-y-4 group">
                <label className="text-white/30 text-[10px] tracking-[0.4em] uppercase ml-1 group-focus-within:text-luxury-gold transition-colors duration-500">Email Address</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full bg-transparent border-b border-white/10 py-4 focus:outline-none focus:border-luxury-gold text-white tracking-widest transition-all duration-700 focus:shadow-[0_5px_15px_-5px_rgba(212,175,55,0.2)] placeholder:text-white/10"
                />
              </div>

              <div className="space-y-4 group">
                <label className="text-white/30 text-[10px] tracking-[0.4em] uppercase ml-1 group-focus-within:text-luxury-gold transition-colors duration-500">Your Message</label>
                <textarea
                  rows="4"
                  placeholder="How can we help you?"
                  className="w-full bg-transparent border-b border-white/10 py-4 focus:outline-none focus:border-luxury-gold text-white tracking-widest transition-all duration-700 focus:shadow-[0_5px_15px_-5px_rgba(212,175,55,0.2)] resize-none placeholder:text-white/10"
                />
              </div>

              <button className="group relative w-full py-6 bg-transparent border border-luxury-gold/30 text-luxury-gold text-xs tracking-[0.5em] uppercase overflow-hidden interactive transition-all duration-700 hover:border-luxury-gold">
                <span className="relative z-10 flex items-center justify-center space-x-4">
                  <span>Send Message</span>
                  <Send size={16} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-700" />
                </span>
                <div className="absolute inset-0 bg-luxury-gold translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.22,1,0.36,1]" />
                <span className="absolute inset-0 z-20 flex items-center justify-center text-luxury-black opacity-0 group-hover:opacity-100 transition-opacity duration-700">Send Message</span>
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
