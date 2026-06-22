import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import { 
  Float, 
  PerspectiveCamera, 
  Environment, 
  ContactShadows,
  Points,
  PointMaterial,
  AdaptiveDpr,
  AdaptiveEvents,
  PerformanceMonitor
} from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import ErrorBoundary from './ErrorBoundary';
import { BUSINESS_DETAILS, getWhatsAppLink } from '../constants/business';
import { Phone, MessageCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// --- ANIMATION HELPERS ---

const LetterAnimation = ({ text, delay = 0 }) => {
  return (
    <motion.h1 className="flex flex-wrap justify-center overflow-hidden">
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileHover={{ 
            y: -10, 
            color: '#D4AF37',
            transition: { duration: 0.2 }
          }}
          transition={{
            duration: 1,
            delay: delay + i * 0.05,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.h1>
  );
};

const CountUp = ({ value, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
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
};

// --- 3D COMPONENTS ---

const Particles = ({ count = 1500, color = "#D4AF37", size = 0.01 }) => {
  const isMobile = window.innerWidth < 768;
  const optimizedCount = isMobile ? Math.floor(count / 2) : count;
  
  const points = useMemo(() => {
    const p = new Float32Array(optimizedCount * 3);
    for (let i = 0; i < optimizedCount; i++) {
      p[i * 3] = (Math.random() - 0.5) * 25;
      p[i * 3 + 1] = (Math.random() - 0.5) * 25;
      p[i * 3 + 2] = (Math.random() - 0.5) * 25;
    }
    return p;
  }, [optimizedCount]);

  const pointsRef = useRef();
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.015;
      pointsRef.current.rotation.x = time * 0.005;
      pointsRef.current.material.size = size * (1 + Math.sin(time * 0.5) * 0.2);
    }
  });

  return (
    <Points ref={pointsRef} positions={points} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={size}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.2}
      />
    </Points>
  );
};

const SciFiSection3D = () => {
  const meshRef = useRef();
  const groupRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.15;
      meshRef.current.rotation.z = Math.sin(time * 0.3) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.8} floatIntensity={0.8}>
        <mesh ref={meshRef}>
          <torusGeometry args={[2.5, 0.015, 32, 200]} />
          <meshStandardMaterial 
            color="#D4AF37" 
            metalness={1} 
            roughness={0.05}
            transparent
            opacity={0.6}
            emissive="#D4AF37"
            emissiveIntensity={0.5}
          />
        </mesh>
      </Float>
      
      <Particles count={3000} color="#D4AF37" size={0.006} />
      <spotLight position={[15, 15, 15]} intensity={3} color="#D4AF37" />
    </group>
  );
};

const Scene = ({ scrollProgress }) => {
  const { mouse } = useThree();
  const gemRef = useRef();
  const isMobile = window.innerWidth < 768;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const offset = scrollProgress || 0;

    // --- CINEMATIC CAMERA ---
    if (offset < 0.5) {
      const t = offset / 0.5;
      state.camera.position.z = THREE.MathUtils.lerp(14, 9, t);
      state.camera.position.y = THREE.MathUtils.lerp(0, 1.2, t);
    } else {
      const t = (offset - 0.5) / 0.5;
      state.camera.position.z = THREE.MathUtils.lerp(9, 18, t);
      state.camera.position.y = THREE.MathUtils.lerp(1.2, 0, t);
    }

    state.camera.lookAt(0, 0, 0);

    if (gemRef.current) {
      gemRef.current.rotation.y = time * 0.1 + mouse.x * 0.15;
      gemRef.current.rotation.x = mouse.y * 0.05;
      
      const visibility = offset < 0.35 || offset > 0.85;
      gemRef.current.visible = visibility;
      
      if (offset < 0.35) {
        gemRef.current.scale.setScalar(THREE.MathUtils.lerp(1.4, 0.9, offset * 2.8));
      } else if (offset > 0.85) {
        gemRef.current.scale.setScalar(THREE.MathUtils.lerp(0.9, 1.8, (offset - 0.85) * 6.6));
      }
    }
  });

  return (
    <>
      <color attach="background" args={['#0a0a0a']} />
      <ambientLight intensity={0.15} />
      <spotLight position={[20, 20, 20]} angle={0.15} penumbra={1} intensity={2.5} color="#D4AF37" />
      
      <mesh ref={gemRef}>
        <octahedronGeometry args={[1, 2]} />
        <meshStandardMaterial 
          color="#D4AF37" 
          metalness={1} 
          roughness={0.02}
          envMapIntensity={1.5}
        />
      </mesh>

      {scrollProgress > 0.4 && scrollProgress < 0.75 && <SciFiSection3D />}

      <Suspense fallback={null}>
        <Environment preset="night" />
      </Suspense>
      
      <ContactShadows position={[0, -4.5, 0]} opacity={0.4} scale={25} blur={4} far={12} />

      <EffectComposer multisampling={4}>
        <Bloom intensity={0.8} luminanceThreshold={0.7} />
        <Vignette eskil={false} offset={0.2} darkness={0.8} />
      </EffectComposer>
    </>
  );
};

const Experience = ({ scrollProgress }) => {
  const [dpr, setDpr] = useState(1.5);

  return (
    <div className="h-screen w-full fixed top-0 left-0 outline-none -z-10 bg-black">
      <Canvas 
        shadows 
        dpr={dpr}
        gl={{ antialias: true, alpha: true }}
      >
        <PerformanceMonitor onIncline={() => setDpr(2)} onDecline={() => setDpr(1)} />
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={45} />
        <Suspense fallback={null}>
          <Scene scrollProgress={scrollProgress} />
        </Suspense>
      </Canvas>
    </div>
  );
};

// --- UI COMPONENTS ---

const SectionTitle = ({ children, subtitle }) => (
  <motion.div 
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    className="mb-20 md:mb-28"
  >
    <motion.p 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      className="small-text !text-accent-gold mb-6"
    >
      {subtitle}
    </motion.p>
    <h2 className="luxury-shimmer inline-block">
      {children}
    </h2>
    <div className="w-16 h-[1px] bg-accent-gold/40 mt-10" />
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
  <div className="section-divider opacity-50" />
);

const Overlay = () => {
  const { scrollYProgress } = useScroll();
  const opacityHero = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const scaleHero = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);
  const heroZoom = useTransform(scrollYProgress, [0, 0.15], [1, 1.1]);
  
  const [mobile, setMobile] = useState(false);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const checkMobile = () => setMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Set static products only, skip Firestore to avoid errors
    setProducts([
      { name: "The Sovereign Necklace", imageUrl: "./assets/standard-bg.png", category: "Necklace" },
      { name: "Imperial Diamond Ring", imageUrl: "./assets/standard-bg.png", category: "Ring" },
      { name: "Radiant Halo Earrings", imageUrl: "./assets/standard-bg.png", category: "Earrings" }
    ]);
    setLoadingProducts(false);
  }, []);

  const scrollToBespoke = () => {
    document.getElementById('bespoke').scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCollections = () => {
    document.getElementById('collections').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-screen text-white font-sans selection:bg-accent-gold selection:text-black overflow-x-hidden bg-deep-black">

      {/* 💎 FEATURED PRODUCT SECTION */}
      <section id="featured" className="section-padding px-6 md:px-40 bg-rich-black bg-silk bg-texture-overlay bg-vignette overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-16 md:gap-32 lg:gap-48">
          <div className="w-full lg:w-1/2">
            <ScrollReveal>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative aspect-[4/5] overflow-hidden rounded-[8px] shadow-2xl group cursor-none"
              >
                <motion.img 
                  style={{ y: useTransform(scrollYProgress, [0.1, 0.3], [0, 100]) }}
                  src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-all duration-[2s]"
                  alt="The Eternal Radiance"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              </motion.div>
            </ScrollReveal>
          </div>
          
          <div className="w-full lg:w-1/2 max-w-2xl text-center lg:text-left">
            <ScrollReveal delay={0.4}>
              <SectionTitle subtitle="Masterpiece">The Eternal Radiance</SectionTitle>
              <p className="mb-10 md:mb-20 text-base md:text-[20px]">
                A masterpiece crafted to transcend time. Each piece reflects the harmony of brilliance, precision, and enduring sophistication. Designed for those who appreciate the quiet confidence of true luxury.
              </p>
              <button className="btn-premium">
                Discover Collection
              </button>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* 📜 QUOTE SECTION */}
      <section className="py-32 md:py-80 px-6 md:px-10 bg-deep-black flex items-center justify-center text-center">
        <ScrollReveal>
          <div className="max-w-5xl">
            <h2 className="leading-[1.2] mb-8 md:mb-16 font-light">
              "True luxury is the quiet confidence born from <span className="gold-text italic luxury-shimmer">precision, patience,</span> and timeless craftsmanship."
            </h2>
            <div className="w-12 md:w-20 h-[1px] bg-accent-gold/30 mx-auto" />
          </div>
        </ScrollReveal>
      </section>

      <SectionDivider />

      {/* 🧊 THE SOVEREIGN STANDARD */}
      <section id="collections" className="section-padding px-6 md:px-40 bg-rich-black relative bg-marble bg-texture-overlay bg-vignette">
        <ScrollReveal>
          <SectionTitle subtitle="Integrity">The Sovereign Standard</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-16">
            {[
              { id: 'standard-1', title: "Craftsmanship", desc: "Our commitment to artisanal perfection in every forged piece.", val: "99.9%", img: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80" },
              { id: 'standard-2', title: "Diamond Quality", desc: "Sourcing only D-F colorless diamonds of exceptional clarity.", val: "D-F", img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80" },
              { id: 'standard-3', title: "Craft Time", desc: "Over 450 hours of meticulous hand-finishing for each creation.", val: "450H", img: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80" }
            ].map((card, i) => (
              <motion.div 
                key={card.title}
                whileHover={{ y: -15, scale: 1.02 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                className="glass-card-3d p-8 md:p-16 flex flex-col items-center text-center group bg-white/[0.01]"
              >
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                  className="text-4xl md:text-6xl font-serif text-accent-gold mb-6 md:mb-10 group-hover:scale-110 transition-transform duration-700 luxury-shimmer"
                >
                  <CountUp value={card.val} />
                </motion.div>
                <h3 className="text-xl md:text-2xl tracking-[0.3em] uppercase mb-4 md:mb-6 text-white/90">{card.title}</h3>
                <p className="small-text !lowercase !tracking-wider leading-relaxed opacity-60 group-hover:text-white/60 transition-colors">
                  {card.desc}
                </p>
                <div className="absolute inset-0 border border-accent-gold/0 group-hover:border-accent-gold/20 transition-all duration-1000 rounded-inherit pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <SectionDivider />

      {/* 💎 MASTERPIECE COLLECTIONS */}
      <section id="collections" className="section-padding px-6 md:px-40 bg-deep-black">
        <ScrollReveal>
          <SectionTitle subtitle="Curated">Masterpiece Collections</SectionTitle>
          {loadingProducts ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-gold"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-20">
              {products.map((item, i) => (
                <motion.div 
                  key={item.id || item.name}
                  whileHover={{ y: -20 }}
                  className="group cursor-none"
                >
                  <div className="aspect-[4/5] relative overflow-hidden rounded-[4px] mb-8 md:mb-12 shadow-3xl glass-card-3d !p-0 border border-white/5">
                    <motion.img 
                      whileHover={{ scale: 1.05 }}
                      src={item.imageUrl} 
                      alt={item.name}
                      className="w-full h-full object-cover transition-all duration-[1.5s]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-6 left-6">
                      <p className="text-accent-gold text-[10px] tracking-[0.3em] uppercase mb-1">{item.category}</p>
                      <div className="w-8 h-[1px] bg-accent-gold/40" />
                    </div>
                  </div>
                  <h4 className="text-center group-hover:text-accent-gold transition-all duration-700 tracking-[0.2em] font-light text-white/90 group-hover:tracking-[0.3em] uppercase text-sm md:text-base">
                    {item.name}
                  </h4>
                </motion.div>
              ))}
            </div>
          )}
        </ScrollReveal>
      </section>

      <SectionDivider />

      {/* ✨ ART OF CREATION */}
      <section id="craftsmanship" className="section-padding px-6 md:px-40 bg-rich-black bg-marble bg-texture-overlay bg-vignette">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-16 md:gap-32 lg:gap-48">
          <div className="w-full lg:w-1/2">
            <ScrollReveal>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[8px] shadow-2xl group">
                <img 
                  src="https://images.unsplash.com/photo-1531995811006-35cb42e1a022?auto=format&fit=crop&q=80" 
                  className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
                  alt="Art of Creation"
                />
                <div className="absolute inset-0 bg-deep-black/20 group-hover:bg-transparent transition-colors duration-1000" />
              </div>
            </ScrollReveal>
          </div>
          <div className="w-full lg:w-1/2 max-w-2xl text-center lg:text-left">
            <ScrollReveal delay={0.4}>
              <SectionTitle subtitle="Process">The Art of Creation</SectionTitle>
              <p className="mb-10 md:mb-20 text-base md:text-xl">
                Every VSKK creation is a story of precision, crafted by master artisans and refined through timeless techniques that have been passed down through generations. Our Doharighat showroom remains the beating heart of our innovation.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-12 md:gap-24">
                <div className="group">
                  <div className="text-3xl md:text-5xl font-serif text-accent-gold mb-2 md:mb-4 group-hover:scale-110 transition-transform duration-500">100%</div>
                  <p className="small-text !text-white/40 group-hover:text-white/60">Handcrafted</p>
                </div>
                <div className="group">
                  <div className="text-3xl md:text-5xl font-serif text-accent-gold mb-2 md:mb-4 group-hover:scale-110 transition-transform duration-500">24K</div>
                  <p className="small-text !text-white/40 group-hover:text-white/60">Purest Gold</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ⚔️ RARE MATERIALS */}
      <section className="section-padding px-6 md:px-40 bg-deep-black">
        <ScrollReveal>
          <SectionTitle subtitle="Foundation">Rare Materials</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-20">
            {[
              { name: "Imperial Gold", desc: "Refined to perfection with unmatched brilliance and durability." },
              { name: "VVS Diamonds", desc: "Selected for exceptional clarity, fire, and ethical sourcing." },
              { name: "Platinum Core", desc: "Strength that lasts generations, forging an eternal bond." },
              { name: "Sustainable Gems", desc: "Ethically sourced, timeless beauty that respects the earth." }
            ].map((mat, i) => (
              <motion.div 
                key={mat.name} 
                whileHover={{ x: 10 }}
                className="border-l border-white/10 pl-10 py-6 transition-colors hover:border-accent-gold/40"
              >
                <h4 className="text-accent-gold mb-4 md:mb-6 text-lg md:text-[20px] uppercase tracking-widest font-light">{mat.name}</h4>
                <p className="small-text !lowercase !tracking-wider leading-relaxed">{mat.desc}</p>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <SectionDivider />

      {/* 📜 TIMELINE */}
      <section className="section-padding px-6 md:px-40 bg-rich-black relative overflow-hidden">
        <ScrollReveal>
          <SectionTitle subtitle="Heritage">Brand Timeline</SectionTitle>
          <div className="relative mt-16 md:mt-32">
            <div className="timeline-line hidden lg:block opacity-30" />
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
              {[
                { year: "1999", event: "Foundation of VSKK" },
                { year: "2008", event: "First Masterpiece Collection" },
                { year: "2016", event: "Expansion to New Horizons" },
                { year: "2024", event: "The Sovereign Era" }
              ].map((step, i) => (
                <motion.div 
                  key={step.year} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="flex-1 relative pt-8 lg:pt-16 group border-l lg:border-l-0 border-white/10 pl-8 lg:pl-0"
                >
                  <div className="hidden lg:block absolute top-0 left-0 w-4 h-4 rounded-full bg-accent-gold -translate-x-1/2 -translate-y-1/2 shadow-[0_0_20px_#D4AF37]" />
                  <h4 className="text-3xl md:text-4xl font-serif text-accent-gold mb-2 md:mb-4">{step.year}</h4>
                  <p className="small-text !lowercase !tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">
                    {step.event}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      <SectionDivider />

      {/* 📧 CONTACT SECTION */}
      <section id="bespoke" className="flex flex-col lg:flex-row min-h-screen bg-rich-black">
        <div className="w-full lg:w-1/2 p-10 md:p-24 lg:p-40 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/5">
          <ScrollReveal>
            <SectionTitle subtitle="Concierge">Contact Us</SectionTitle>
            <p className="text-lg md:text-xl mb-16 md:mb-24 opacity-60 text-center lg:text-left">
              Visit our showroom at Main Chowk, Doharighat. Our master artisans are ready to translate your vision into a timeless masterpiece.
            </p>
            
            <div className="space-y-10 md:space-y-16 flex flex-col items-center lg:items-start">
              <div className="group cursor-none text-center lg:text-left">
                <p className="small-text mb-2 md:mb-4 !text-accent-gold">Showroom Address</p>
                <p className="text-white/80 text-base md:text-[18px] group-hover:text-white transition-colors">
                  {BUSINESS_DETAILS.address.split(',').slice(0, 2).join(',')} <br />
                  {BUSINESS_DETAILS.address.split(',').slice(2).join(',')}
                </p>
              </div>
              <div className="group cursor-none text-center lg:text-left">
                <p className="small-text mb-2 md:mb-4 !text-accent-gold">Phone Numbers</p>
                <div className="flex flex-col gap-2">
                  {BUSINESS_DETAILS.phones.map((phone, i) => (
                    <a key={i} href={`tel:${phone.value}`} className="text-white/80 text-base md:text-[18px] group-hover:text-white transition-colors hover:text-accent-gold flex items-center gap-3">
                      <Phone size={18} /> {phone.display}
                    </a>
                  ))}
                </div>
              </div>
              <div className="group cursor-none text-center lg:text-left">
                <p className="small-text mb-2 md:mb-4 !text-accent-gold">WhatsApp Enquiry</p>
                <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="text-white/80 text-base md:text-[18px] group-hover:text-white transition-colors hover:text-accent-gold flex items-center gap-3">
                  <MessageCircle size={18} /> Chat with us on WhatsApp
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 1.1 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="w-full lg:w-1/2 min-h-[500px] bg-deep-black relative overflow-hidden"
        >
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3586.2415740441!2d83.5186!3d26.2736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDE2JzI1LjAiTiA4M8KwMzEnMDcuMCJF!5e0!3m2!1sen!2sin!4v1713270000000!5m2!1sen!2sin"
            className="w-full h-full border-0 grayscale invert opacity-40 hover:opacity-60 transition-opacity duration-1000"
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="VSKK Location"
          ></iframe>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 md:py-40 px-6 md:px-40 bg-deep-black border-t border-white/5 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-1/3 h-full bg-gradient-to-tl from-accent-gold/5 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start gap-16 md:gap-24 mb-20 md:mb-40">
          <div className="max-w-md text-center md:text-left group">
            <div className="mb-8 md:mb-12">
              <span className="logo-vskk text-4xl md:text-6xl">VSKK</span>
              <div className="text-[10px] tracking-[1em] text-white/20 mt-2 uppercase font-light group-hover:text-accent-gold/40 transition-colors duration-700">Swarn Kala Kendra</div>
            </div>
            <p className="small-text !lowercase !tracking-widest leading-loose text-white/30">
              Defining digital luxury through traditional craftsmanship and Mau's rich heritage. A legacy of excellence since 1990. Crafted in Doharighat, available globally.
            </p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-12 md:gap-40 w-full md:w-auto">
            <div>
              <h4 className="small-text mb-8 md:mb-12 !text-white !tracking-[0.6em]">Contact</h4>
              <ul className="space-y-4 md:space-y-6 small-text !lowercase !text-white/20">
                {BUSINESS_DETAILS.phones.map((phone, i) => (
                  <li key={i}><a href={`tel:${phone.value}`} className="hover:text-accent-gold transition-all duration-500">{phone.display}</a></li>
                ))}
                <li><a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="hover:text-accent-gold transition-all duration-500">WhatsApp Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="small-text mb-8 md:mb-12 !text-white !tracking-[0.6em]">Social</h4>
              <ul className="space-y-4 md:space-y-6 small-text !lowercase !text-white/20">
                <li><a href="#" className="hover:text-accent-gold transition-all duration-500">Instagram</a></li>
                <li><a href="#" className="hover:text-accent-gold transition-all duration-500">Facebook</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="pt-12 md:pt-20 border-t border-white/5 text-center">
          <span className="small-text !text-white/10 !tracking-[0.5em] md:tracking-[0.8em] text-[8px] md:text-[10px]">© 2026 {BUSINESS_DETAILS.name}. All Rights Reserved.</span>
        </div>
      </footer>
    </div>
  );
};

export { Overlay };
export default Experience;
