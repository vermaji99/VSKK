import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useScroll, useTransform } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const CinematicExperience = () => {
  const mainRef = useRef(null);
  const scene1Ref = useRef(null);
  const scene2Ref = useRef(null);
  const scene3Ref = useRef(null);
  const scene4Ref = useRef(null);
  const scene5Ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: mainRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Scene 1 to 2: Into the Gem Zoom
      gsap.timeline({
        scrollTrigger: {
          trigger: scene1Ref.current,
          start: "center center",
          end: "bottom top",
          scrub: true,
          pin: true,
        }
      })
      .to(".hero-jewelry", { scale: 15, filter: "blur(20px)", opacity: 0, duration: 2 })
      .from(".scene-2-content", { scale: 0.1, opacity: 0, filter: "blur(30px)", duration: 2 }, "-=1");

      // Scene 3: Floating Gallery
      gsap.timeline({
        scrollTrigger: {
          trigger: scene3Ref.current,
          start: "top center",
          end: "bottom bottom",
          scrub: 1,
        }
      })
      .from(".gallery-item", {
        z: -1000,
        opacity: 0,
        stagger: 0.2,
        rotateX: 45,
        rotateY: 45,
      });

      // Scene 5: Particle Explosion (Simulated with scaling/blur)
      gsap.timeline({
        scrollTrigger: {
          trigger: scene4Ref.current,
          start: "bottom center",
          end: "bottom top",
          scrub: true,
        }
      })
      .to(".scene-4-product", { 
        scale: 2, 
        filter: "blur(50px)", 
        opacity: 0,
        display: "none"
      });

    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="relative bg-luxury-black">
      {/* SCENE 1: THE ENTRY */}
      <section ref={scene1Ref} className="scene-container perspective-view z-50">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="relative text-center"
        >
          <div className="hero-jewelry w-[80vw] md:w-[60vw] h-[40vh] md:h-[60vh] mx-auto bg-cover bg-center rounded-sm shadow-[0_0_100px_rgba(212,175,55,0.1)]"
               style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80")' }} />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <h1 className="text-5xl md:text-9xl font-premium tracking-tighter shimmer-text uppercase">Vaibhav</h1>
            <p className="text-luxury-gold tracking-[0.5em] md:tracking-[1em] text-[8px] md:text-xs mt-4 opacity-50">ESTABLISHED 1990</p>
          </div>
        </motion.div>
      </section>

      {/* SCENE 2: INTO THE GEM */}
      <section ref={scene2Ref} className="scene-container bg-black z-40">
        <div className="scene-2-content text-center max-w-4xl px-6">
          <h2 className="text-4xl md:text-8xl font-premium gold-text leading-none mb-8 md:mb-12">DEEP_PRECISION</h2>
          <p className="text-white/30 text-lg md:text-xl tracking-[0.1em] md:tracking-[0.2em] font-light leading-relaxed">
            Traveling through the atomic structure of perfection. Every facet is a galaxy of light.
          </p>
        </div>
      </section>

      {/* SCENE 3: FLOATING GALLERY */}
      <section ref={scene3Ref} className="min-h-screen relative py-20 md:py-40 bg-luxury-black overflow-hidden">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-16">
            {[1, 2, 3].map((i) => (
              <div key={i} className="gallery-item aspect-[3/4] glass-panel p-4 md:p-8 rounded-sm">
                <div className="w-full h-full bg-deep-black/50 rounded-sm" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCENE 4: PRODUCT SPOTLIGHT */}
      <section ref={scene4Ref} className="scene-container bg-deep-black z-30">
        <div className="scene-4-product relative w-[80vw] md:w-[40vw] aspect-square">
          <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80" 
               alt="Core Product"
               className="w-full h-full object-contain filter drop-shadow-[0_0_50px_rgba(212,175,55,0.2)]" />
          
          <div className="absolute bottom-10 md:bottom-20 left-0 text-left">
            <h3 className="text-2xl md:text-4xl font-premium text-white tracking-widest uppercase mb-2 md:mb-4">The_Crown_Jewel</h3>
            <div className="w-12 md:w-20 h-[1px] bg-luxury-gold mb-2 md:mb-4" />
            <p className="text-white/20 text-[8px] md:text-[10px] tracking-[0.5em]">UNIQUE_SERIAL: 001-X</p>
          </div>
        </div>
      </section>

      {/* SCENE 6: LEGACY */}
      <section ref={scene5Ref} className="scene-container bg-white text-black z-10">
        <div className="max-w-5xl text-center px-6 md:px-12">
          <h2 className="text-4xl md:text-9xl font-premium tracking-tighter mb-8 md:mb-16">THE_LEGACY</h2>
          <p className="text-black/40 text-lg md:text-2xl font-light tracking-[0.1em] leading-relaxed italic">
            "We don't just sell jewelry. We preserve time in gold and diamonds."
          </p>
          <button className="mt-10 md:mt-20 px-10 md:px-16 py-4 md:py-6 border border-black/10 hover:bg-black hover:text-white transition-all duration-700 uppercase tracking-[0.3em] md:tracking-[0.5em] text-[8px] md:text-[10px] font-bold">
            Our_Full_Story
          </button>
        </div>
      </section>
    </div>
  );
};

export default CinematicExperience;
