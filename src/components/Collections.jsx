import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const Collections = () => {
  const sectionRef = useRef(null);
  
  const collections = [
    { 
      title: 'Gold Necklace', 
      image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80',
      tag: 'Celestial Gold',
      price: 'FROM $12,500'
    },
    { 
      title: 'Diamond Sets', 
      image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&q=80',
      tag: 'Pure Brilliance',
      price: 'FROM $45,000'
    },
    { 
      title: 'Silver Collection', 
      image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80',
      tag: 'Modern Grace',
      price: 'FROM $8,500'
    },
  ];

  return (
    <section id="collections" ref={sectionRef} className="relative bg-luxury-black min-h-screen py-32 md:py-60 overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none opacity-[0.03] select-none">
        <h2 className="text-[20vw] lg:text-[15vw] font-bold uppercase tracking-widest gold-text">EXHIBITION</h2>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="mb-20 md:mb-40 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-luxury-gold tracking-[0.8em] uppercase text-[8px] md:text-[10px] mb-6 md:mb-8 font-bold"
          >
            REIMAGINED COLLECTIONS
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="text-4xl md:text-8xl font-premium text-white mb-8 md:mb-12 tracking-widest uppercase leading-tight"
          >
            The Floating <br /> <span className="gold-text italic">Glass Gallery</span>
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "100px" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="h-[1px] bg-luxury-gold mx-auto opacity-30"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-16">
          {collections.map((item, index) => (
            <CollectionCard key={index} item={item} index={index} />
          ))}
        </div>
      </div>
      
      {/* Subtle emerald glow on the sides */}
      <div className="absolute top-1/4 -left-40 w-[600px] h-[600px] bg-luxury-emerald/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-[600px] h-[600px] bg-luxury-gold/5 rounded-full blur-[150px] pointer-events-none" />
    </section>
  );
};

const CollectionCard = ({ item, index }) => {
  const cardRef = useRef(null);
  const mouseX = useSpring(0, { stiffness: 100, damping: 30 });
  const mouseY = useSpring(0, { stiffness: 100, damping: 30 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    mouseX.set(x * 15);
    mouseY.set(y * -15);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const rotateX = mouseY;
  const rotateY = mouseX;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] }}
      style={{ rotateX, rotateY, perspective: 1000 }}
      className="group relative h-[700px] glass rounded-sm overflow-hidden cursor-none interactive border border-white/5 hover:border-luxury-gold/30 transition-all duration-700"
    >
      {/* Background Dim Effect */}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-700 z-0" />
      
      {/* Image with Parallax Zoom */}
      <div className="w-full h-full overflow-hidden">
        <motion.img 
          src={item.image} 
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-[2.5s] ease-out group-hover:scale-110"
        />
      </div>

      {/* Floating Glass Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent opacity-90 group-hover:opacity-70 transition-all duration-700 z-10" />
      
      {/* Glow Border on Hover */}
      <div className="absolute inset-0 border border-luxury-gold/0 group-hover:border-luxury-gold/20 transition-all duration-700 z-20 pointer-events-none" />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-20 pointer-events-none bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),rgba(212,175,55,0.05)_0%,transparent_50%)]" />

      {/* Content */}
      <div className="absolute bottom-16 left-12 right-12 z-30">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-luxury-gold tracking-[0.6em] uppercase text-[9px] mb-6 font-bold"
        >
          {item.tag}
        </motion.p>
        <h3 className="text-3xl font-premium text-white mb-10 leading-tight tracking-widest uppercase transform group-hover:-translate-y-2 transition-transform duration-1000">
          {item.title}
        </h3>
        <p className="text-white/30 text-[9px] tracking-[0.4em] uppercase mb-12 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
          {item.price}
        </p>
        
        <button className="flex items-center space-x-6 text-[10px] tracking-[0.5em] uppercase text-white/40 group-hover:text-luxury-gold transition-all duration-700 interactive">
          <span className="group-hover:translate-x-2 transition-transform duration-700">Explore Collection</span>
          <div className="w-10 h-[1px] bg-white/10 group-hover:bg-luxury-gold transition-all duration-700 group-hover:w-20" />
        </button>
      </div>

      {/* Light Streak Reflection Effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1.5s] ease-in-out pointer-events-none z-40" />
    </motion.div>
  );
};

export default Collections;
