import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  const testimonials = [
    {
      name: 'Aditi Sharma',
      role: 'Luxury Lifestyle Influencer',
      text: "The craftsmanship at Vaibhav Swarn Kala Kendra is simply unparalleled. Each piece I've purchased feels like a unique work of art that captures the essence of royal heritage.",
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80',
    },
    {
      name: 'Vikram Singh',
      role: 'Art Collector',
      text: "I was looking for a custom piece for my daughter's wedding. The team worked with me through every step, and the final result was beyond my expectations. Truly world-class.",
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80',
    },
    {
      name: 'Priya Verma',
      role: 'Fashion Designer',
      text: "Their diamond collection is breathtaking. The clarity and cut of the stones are exceptional. It's the only place I trust for high-end jewellery.",
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80',
    },
  ];

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="relative bg-luxury-black py-20 md:py-40 overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-luxury-gold/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-12 md:gap-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col md:flex-row items-center gap-12 md:gap-20 w-full"
              >
                <div className="relative shrink-0">
                  <div className="w-48 h-48 md:w-64 lg:w-80 md:h-64 lg:h-80 rounded-full overflow-hidden border-2 border-luxury-gold/30 p-2">
                    <img
                      src={testimonials[current].image}
                      alt={testimonials[current].name}
                      className="w-full h-full object-cover rounded-full transition-all duration-700"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 md:-bottom-4 md:-right-4 w-12 h-12 md:w-16 md:h-16 bg-luxury-gold rounded-full flex items-center justify-center text-luxury-black">
                    <Quote size={20} className="md:w-6 md:h-6" fill="currentColor" />
                  </div>
                </div>

                <div className="space-y-6 md:space-y-10 text-center md:text-left">
                  <p className="text-xl md:text-3xl lg:text-4xl font-light text-white/90 leading-relaxed italic tracking-wide font-premium">
                    "{testimonials[current].text}"
                  </p>
                  <div>
                    <h4 className="text-2xl md:text-3xl font-premium gold-text tracking-[0.2em] uppercase mb-1 md:mb-2">
                      {testimonials[current].name}
                    </h4>
                    <p className="text-white/40 text-[10px] tracking-[0.4em] uppercase font-bold">
                      {testimonials[current].role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center md:justify-end space-x-6 md:space-x-8 mt-12 md:mt-0 w-full md:w-auto">
              <button
                onClick={prev}
                className="group w-14 h-14 md:w-16 md:h-16 rounded-full border border-white/10 flex items-center justify-center text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black transition-all duration-700 interactive"
              >
                <ChevronLeft size={24} className="md:w-7 md:h-7 group-hover:-translate-x-1 transition-transform" />
              </button>
              <button
                onClick={next}
                className="group w-14 h-14 md:w-16 md:h-16 rounded-full border border-white/10 flex items-center justify-center text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black transition-all duration-700 interactive"
              >
                <ChevronRight size={24} className="md:w-7 md:h-7 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
