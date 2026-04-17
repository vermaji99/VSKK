import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Masterpieces = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const products = [
    { 
      name: 'NEON_RADIAN_01', 
      image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80',
      depth: 0,
      pos: { top: '10%', left: '15%' },
      size: 'w-64 h-80'
    },
    { 
      name: 'SOLITAIRE_X', 
      image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&q=80',
      depth: 1,
      pos: { top: '25%', left: '60%' },
      size: 'w-80 h-96'
    },
    { 
      name: 'BLOOM_CORE', 
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80',
      depth: -1,
      pos: { top: '50%', left: '10%' },
      size: 'w-72 h-72'
    },
    { 
      name: 'ANTIQUE_V2', 
      image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80',
      depth: 0.5,
      pos: { top: '65%', left: '45%' },
      size: 'w-96 h-[500px]'
    },
    { 
      name: 'EMERALD_SYST', 
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80',
      depth: -0.5,
      pos: { top: '15%', left: '40%' },
      size: 'w-56 h-56'
    },
  ];

  return (
    <section ref={containerRef} className="relative h-auto lg:h-[250vh] bg-luxury-black overflow-visible py-20 md:py-40">
      {/* Dynamic light rays following scroll */}
      <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none hidden lg:block">
        <motion.div 
          className="absolute top-0 left-0 w-full h-full opacity-30"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(20, 184, 166, 0.05) 0%, transparent 70%)'
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative h-full">
        {/* Scattered Gallery Items for Desktop / Grid for Mobile */}
        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {products.map((product, index) => (
            <div key={index} className="glass-panel p-4 rounded-sm">
              <div className="aspect-[4/5] overflow-hidden rounded-sm mb-4">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <h4 className="small-text !text-white/60 tracking-[0.4em]">{product.name}</h4>
            </div>
          ))}
        </div>

        <div className="hidden lg:block">
          {products.map((product, index) => (
            <FloatingItem key={index} product={product} scrollYProgress={scrollYProgress} index={index} />
          ))}
        </div>

        {/* Floating Background Text - Responsive scaling */}
        <div className="sticky top-1/2 left-0 w-full -translate-y-1/2 pointer-events-none opacity-[0.02] z-0 overflow-hidden">
          <h2 className="text-[30vw] lg:text-[25vw] font-bold tracking-tighter leading-none text-white whitespace-nowrap">SCATTERED_LUXURY</h2>
        </div>
      </div>
    </section>
  );
};

const FloatingItem = ({ product, scrollYProgress, index }) => {
  // Each item moves at a different speed based on depth
  const speed = 200 * (product.depth + 2);
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);
  const rotate = useTransform(scrollYProgress, [0, 1], [index * 5, index * -5]);
  const blur = product.depth !== 0 ? Math.abs(product.depth) * 4 : 0;

  return (
    <motion.div
      style={{ 
        y, 
        rotate,
        top: product.pos.top,
        left: product.pos.left,
        filter: `blur(${blur}px)`,
        zIndex: Math.floor(product.depth * 10) + 10
      }}
      className={`absolute ${product.size} glass-panel rounded-sm overflow-hidden interactive group`}
    >
      <motion.img 
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
      />
      
      {/* Digital HUD Overlay */}
      <div className="absolute inset-0 bg-luxury-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col items-center justify-center p-8">
        <p className="text-luxury-teal text-[8px] tracking-[0.5em] mb-4 font-bold">TYPE: {product.name.split('_')[0]}</p>
        <h3 className="text-xl font-premium text-white tracking-widest uppercase mb-8">{product.name}</h3>
        <div className="w-12 h-[1px] bg-luxury-teal/50" />
        <button className="mt-8 text-[8px] tracking-[0.4em] uppercase text-white/40 hover:text-luxury-teal transition-colors">ACCESS_DETAILS</button>
      </div>

      {/* Depth Indicator Border */}
      <div className="absolute inset-0 border border-white/5 group-hover:border-luxury-teal/30 transition-all duration-700" />
    </motion.div>
  );
};

export default Masterpieces;
