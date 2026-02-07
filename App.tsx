import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { HorrorCursor } from './components/Cursor';
import { SoundManager } from './components/SoundManager';
import { Ritual } from './components/Ritual';

export default function App() {
  const [userInteracted, setUserInteracted] = useState(false);
  const [screamTriggered, setScreamTriggered] = useState(false);
  const [postScream, setPostScream] = useState(false);
  const [ritualStarted, setRitualStarted] = useState(false);
  const [ritualComplete, setRitualComplete] = useState(false);
  const [decision, setDecision] = useState<'YES' | 'NO' | null>(null);
  const [drips, setDrips] = useState<{id: number, left: number}[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const fogOpacity = useTransform(scrollY, [0, 2000], [0.1, 0.6]);

  // Listen for the ENTER button click from index.html
  useEffect(() => {
    const handleUserInteraction = () => {
      setUserInteracted(true);
    };

    window.addEventListener('userInteracted', handleUserInteraction);
    
    return () => {
      window.removeEventListener('userInteracted', handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Trigger scare at a specific point
      if (!screamTriggered && window.scrollY > 1500) {
        setScreamTriggered(true);
      }
      // Random blood drips for atmosphere
      if (Math.random() < 0.02) {
        setDrips(prev => [...prev.slice(-15), { id: Date.now(), left: Math.random() * 100 }]);
      }
    };
    
    if (userInteracted) {
      window.addEventListener('scroll', handleScroll);
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, [userInteracted, screamTriggered]);

  // Ending Screen
  if (decision) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center relative overflow-hidden z-[200]">
        <SoundManager started={userInteracted} triggerScream={false} onScreamComplete={() => {}} finalDecision={decision} />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 2 }} className="z-10 text-center px-6">
          <h1 className="text-red-900 font-horror text-4xl md:text-7xl tracking-widest mb-8 uppercase">
            {decision === 'YES' ? 'SHE IS WAITING.' : 'THERE IS NO ESCAPE.'}
          </h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 2 }} className="mt-12">
            <p className="text-gray-500 font-serif text-xl md:text-2xl mb-2 tracking-[0.8em] uppercase">MEERA</p>
            <p className="text-red-900/40 font-serif text-sm tracking-[0.3em]">BITS PILANI HINDI DRAMA CLUB</p>
          </motion.div>
        </motion.div>
        <div className="absolute inset-0 bg-red-950/10 pointer-events-none"></div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="bg-black relative selection:bg-red-900 selection:text-white">
      <HorrorCursor />
      <SoundManager 
        started={userInteracted} 
        triggerScream={screamTriggered} 
        onScreamComplete={() => setPostScream(true)} 
        finalDecision={null} 
      />

      {/* Persistent UI */}
      <div className="fixed top-0 left-0 w-full p-6 z-50 flex justify-between pointer-events-none mix-blend-difference">
        <p className="text-white/20 font-serif text-[10px] md:text-xs uppercase tracking-widest italic">
           Hindi Drama Club
        </p>
        <p className="text-white/20 font-serif text-[10px] md:text-xs uppercase tracking-widest italic">
           BITS Pilani
        </p>
      </div>

      {/* Atmospheric Backgrounds */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div style={{ opacity: fogOpacity }} className="absolute inset-0 z-10 bg-gradient-to-t from-red-950/30 via-transparent to-black" />
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <video autoPlay loop muted playsInline className="w-full h-full object-cover grayscale brightness-[0.2] contrast-150">
          <source src="https://assets.mixkit.co/videos/preview/mixkit-horror-background-loop-303-large.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Blood Drips */}
      {drips.map(drip => (
        <motion.div 
          key={drip.id} 
          initial={{ height: 0 }} 
          animate={{ height: '100vh' }} 
          transition={{ duration: 4, ease: "linear" }} 
          className="fixed top-0 w-[1px] bg-red-900/40 z-20" 
          style={{ left: `${drip.left}%` }} 
        />
      ))}

      {/* Scrollable Content */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* Section 1: Intro */}
        <section className="h-screen flex flex-col items-center justify-center text-center px-6">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 0.6, y: 0 }} 
            transition={{ duration: 2 }} 
            className="text-gray-400 font-serif text-3xl md:text-6xl italic tracking-wide mb-4"
          >
            A memory long forgotten...
          </motion.h2>
          <motion.div 
            animate={{ opacity: [0, 0.4, 0] }} 
            transition={{ duration: 3, repeat: Infinity }} 
            className="absolute bottom-20 flex flex-col items-center gap-2"
          >
            <p className="text-gray-700 text-[10px] uppercase tracking-[0.5em]">Scroll into the abyss</p>
            <div className="w-[1px] h-10 bg-gray-800"></div>
          </motion.div>
        </section>

        {/* Section 2: The Core */}
        <section className="min-h-screen w-full flex flex-col items-center space-y-[40vh] py-40">
          <FadeText text="She was innocent." />
          <FadeText text="They were not." delay={0.5} />
          
          <div className="py-20 relative group">
            <motion.h1 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="font-hindi text-[8rem] md:text-[16rem] text-red-950 leading-none relative z-10 animate-glitch" 
              data-text="मीरा"
            >
              मीरा
            </motion.h1>
            <div className="absolute inset-0 flex items-center justify-center opacity-20 blur-2xl pointer-events-none">
              <h1 className="font-hindi text-[10rem] md:text-[18rem] text-red-700">मीरा</h1>
            </div>
          </div>

          <FragmentText text="The cradle is empty." />
          
          {/* Visual Horror Element */}
          <div className="relative w-full h-[40vh] overflow-hidden">
            <motion.div initial={{ opacity: 0, x: -100 }} whileInView={{ opacity: 0.1, x: 0 }} className="absolute left-1/4 top-0 text-red-950 text-[15rem] md:text-[25rem] rotate-12 filter blur-sm select-none">🖐</motion.div>
            <motion.div initial={{ opacity: 0, x: 100 }} whileInView={{ opacity: 0.08, x: 0 }} className="absolute right-1/4 top-20 text-red-950 text-[12rem] md:text-[20rem] -rotate-12 filter blur-sm select-none">🖐</motion.div>
          </div>

          <FragmentText text="But she is full of rage." align="right" />
          
          {/* Interaction: The Ritual */}
          <div className="w-full flex flex-col items-center py-20">
            {!ritualStarted && (
              <motion.button 
                whileHover={{ scale: 1.05, borderColor: '#7f1d1d', color: '#ef4444' }} 
                whileTap={{ scale: 0.95 }} 
                onClick={() => setRitualStarted(true)} 
                className="px-16 py-6 border border-red-900/20 text-red-900/40 font-serif tracking-[0.5em] transition-all duration-700 uppercase"
              >
                PERFORM THE RITE
              </motion.button>
            )}

            {ritualStarted && !ritualComplete && (
              <div className="w-full max-w-2xl px-6">
                <Ritual 
                  onComplete={() => setRitualComplete(true)} 
                  onFail={() => { setScreamTriggered(true); setTimeout(() => setScreamTriggered(false), 500); }} 
                />
              </div>
            )}

            {ritualComplete && (
              <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="text-red-600 font-horror text-2xl md:text-4xl tracking-widest text-center animate-pulse">
                THE SEAL IS BROKEN
              </motion.div>
            )}
          </div>

          <FragmentText text="Blood never forgets." color="text-red-800" />
        </section>

        {/* Section 3: Details */}
        <section className="min-h-screen flex flex-col items-center justify-center space-y-24 z-20 py-60 w-full">
          <RevealItem text="FEBRUARY 7TH" />
          <RevealItem text="7:00 PM" delay={0.3} />
          <RevealItem text="MAIN AUDITORIUM" delay={0.6} />
        </section>

        {/* Section 4: Final Call */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center pb-60 px-6 w-full">
          <motion.h3 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-2xl md:text-5xl font-serif text-gray-400 mb-32 tracking-[0.3em] uppercase italic"
          >
            Will you face her?
          </motion.h3>
          <div className="flex flex-col md:flex-row gap-16 md:gap-40">
            <button 
              onClick={() => setDecision('YES')} 
              className="group relative px-16 py-4 text-gray-500 hover:text-red-600 transition-colors duration-500 font-serif tracking-[0.5em] text-3xl border border-transparent hover:border-red-900/30"
            >
              I DARE
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-red-800 transition-all duration-700 group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => setDecision('NO')} 
              className="group relative px-16 py-4 text-gray-500 hover:text-gray-200 transition-colors duration-500 font-serif tracking-[0.5em] text-3xl"
            >
              I FEAR
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gray-600 transition-all duration-700 group-hover:w-full"></span>
            </button>
          </div>
        </section>
      </div>
      
      {/* Scream Flash Overlay */}
      <AnimatePresence>
        {screamTriggered && !postScream && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: [0, 1, 0.2, 0.8, 0] }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.3 }} 
            className="fixed inset-0 bg-red-600 mix-blend-hard-light z-[500] pointer-events-none" 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const FadeText = ({ text, delay = 0 }: { text: string, delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, filter: 'blur(10px)', y: 40 }} 
    whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }} 
    transition={{ duration: 2.5, delay, ease: "easeOut" }} 
    className="text-4xl md:text-8xl text-gray-400 font-serif tracking-tight px-6 text-center"
  >
    {text}
  </motion.div>
);

const FragmentText = ({ text, align = 'center', color = 'text-gray-600' }: { text: string, align?: 'left'|'center'|'right', color?: string }) => (
  <motion.div 
    initial={{ opacity: 0 }} 
    whileInView={{ opacity: 1 }} 
    transition={{ duration: 2 }} 
    className={`w-full max-w-6xl px-12 text-${align} ${color} font-serif italic text-2xl md:text-4xl tracking-[0.2em] leading-relaxed`}
  >
    {text}
  </motion.div>
);

const RevealItem = ({ text, delay = 0 }: { text: string, delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    whileInView={{ opacity: 1, y: 0 }} 
    transition={{ duration: 1.5, delay }} 
    className="text-center group w-full"
  >
    <h2 className="text-4xl md:text-7xl text-red-50/30 font-serif border-b border-red-900/10 pb-8 inline-block tracking-[0.4em] group-hover:text-red-600 group-hover:border-red-600 transition-all duration-1000 uppercase">
      {text}
    </h2>
  </motion.div>
);
