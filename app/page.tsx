'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import dynamic from 'next/dynamic';

// Define VantaEffect interface inline
interface VantaEffect {
  destroy: () => void;
}

// Dynamic import for VantaTopology
const VantaTopology = dynamic(
  () => import('vanta/dist/vanta.topology.min').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => null,
  }
);

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const isHoveringText = useRef(false);
  const isHoveringName = useRef(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const [showIntro, setShowIntro] = useState(true);
  const vantaEffect = useRef<VantaEffect | null>(null);

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode);
    document.body.classList.toggle('light', !isDarkMode);
    if (mainRef.current) {
      mainRef.current.style.background = isDarkMode ? '#1F2A44' : '#FFFFFF';
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        animationFrameId = requestAnimationFrame(() => {
          cursorRef.current!.style.left = `${e.clientX}px`;
          cursorRef.current!.style.top = `${e.clientY}px`;
        });
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('nav')) {
        return;
      }
      if (target.tagName === 'H1' && target.className.includes('cursor-default')) {
        isHoveringName.current = true;
        if (cursorRef.current) {
          cursorRef.current.classList.add('cursor-name');
          cursorRef.current.classList.remove('hidden');
        }
      } else if (target.tagName === 'P' || target.tagName === 'A' || target.tagName === 'BUTTON') {
        isHoveringText.current = true;
        if (cursorRef.current) {
          cursorRef.current.classList.add('cursor-text');
          cursorRef.current.classList.remove('hidden');
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('nav')) {
        return;
      }
      if (target.tagName === 'H1' && target.className.includes('cursor-default')) {
        isHoveringName.current = false;
        if (cursorRef.current) {
          cursorRef.current.classList.remove('cursor-name');
          cursorRef.current.classList.add('hidden');
        }
      } else if (target.tagName === 'P' || target.tagName === 'A' || target.tagName === 'BUTTON') {
        isHoveringText.current = false;
        if (cursorRef.current) {
          cursorRef.current.classList.remove('cursor-text');
          cursorRef.current.classList.add('hidden');
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && mainRef.current && !isDarkMode) {
      VantaTopology({
        el: mainRef.current,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0xa6b6b6,
        backgroundColor: 0xfafcfc,
      }).then((effect) => {
        vantaEffect.current = effect;
      });
    }

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        if (mainRef.current) {
          mainRef.current.style.background = isDarkMode ? '#1F2A44' : '#FFFFFF';
        }
        vantaEffect.current = null;
      }
    };
  }, [isDarkMode]);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const childVariants = (index: number) => ({
    hidden: { opacity: 0, x: -30, scale: 0.7 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  });

  const introBoxVariants = {
    hidden: { y: '-100vh', rotateX: 90 },
    visible: {
      y: 0,
      rotateX: 0,
      transition: { duration: 1, ease: 'easeOut' },
    },
    exit: {
      y: '100vh',
      rotateX: -90,
      transition: { duration: 1, ease: 'easeIn' },
    },
  };

  const techContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const techChildVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const TypingText = ({ text }: { text: string }) => {
    const [displayText, setDisplayText] = useState('');
    useEffect(() => {
      let i = 0;
      const typing = setInterval(() => {
        if (i < text.length) {
          setDisplayText(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(typing);
        }
      }, 100);
      return () => clearInterval(typing);
    }, [text]);
    return <span>{displayText}</span>;
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Poppins:wght@900&display=swap');
        body {
          background-color: ${isDarkMode ? '#1A202C' : '#F5F7FA'};
          color: ${isDarkMode ? '#D1D5DB' : '#1F2937'};
          transition: background-color 0.3s, color 0.3s;
        }
        .dark {
          background-color: #1A202C;
          color: #D1D5DB;
        }
        .light {
          background-color: #F5F7FA;
          color: #1F2937;
        }
        .custom-cursor {
          position: fixed;
          width: 0;
          height: 0;
          pointer-events: none;
          z-index: 1000;
          transition: width 0.1s ease, height 0.1s ease, transform 0.05s ease;
        }
        .custom-cursor.cursor-text {
          width: 4px;
          height: 40px;
          border-radius: 0;
          background: ${isDarkMode ? '#00BCD4' : '#2DD4BF'};
          transform: translateX(-50%) translateY(-50%);
        }
        .custom-cursor.cursor-name {
          width: 6px;
          height: 50px;
          border-radius: 0;
          background: #008FFF;
          transform: translateX(-50%) translateY(-50%);
        }
        .custom-cursor.hidden {
          width: 0;
          height: 0;
          background: transparent;
        }
        .theme-box {
          background-color: ${isDarkMode ? '#1F2A44' : '#FFFFFF'};
          color: ${isDarkMode ? '#D1D5DB' : '#1F2937'};
          box-shadow: 0 4px 12px rgba(${isDarkMode ? '0, 188, 212, 0.2' : '45, 212, 191, 0.2'});
          border: 2px solid ${isDarkMode ? 'rgba(0, 188, 212, 0.2)' : 'rgba(45, 212, 191, 0.2)'};
          backdrop-filter: blur(10px);
        }
        .theme-btn {
          pointer-events: auto;
          cursor: pointer;
        }
        .name-gradient {
          background: linear-gradient(90deg, ${isDarkMode ? '#00BCD4' : '#2DD4BF'}, ${isDarkMode ? '#F472B6' : '#FBBF24'});
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 2px 6px rgba(${isDarkMode ? '0, 188, 212, 0.3' : '45, 212, 191, 0.3'});
        }
        .social-icon {
          width: 36px;
          height: 36px;
          transition: transform 0.2s ease;
        }
        .social-icon:hover {
          transform: scale(1.2);
        }
        .btn-hover {
          background-color: ${isDarkMode ? '#1F2A44' : '#FFFFFF'};
          color: ${isDarkMode ? '#D1D5DB' : '#1F2937'};
          transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
        }
        .btn-hover:hover {
          background-color: ${isDarkMode ? '#00BCD4' : '#2DD4BF'};
          color: ${isDarkMode ? '#000000' : '#FFFFFF'};
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(${isDarkMode ? '0, 188, 212, 0.3' : '45, 212, 191, 0.3'});
        }
        nav {
          background-color: ${isDarkMode ? '#1A202C' : '#F5F7FA'};
          box-shadow: 0 2px 10px rgba(${isDarkMode ? '0, 0, 0, 0.3' : '0, 0, 0, 0.1'});
        }
        a,
        p {
          color: ${isDarkMode ? '#D1D5DB' : '#1F2937'};
        }
        a:hover {
          color: ${isDarkMode ? '#00BCD4' : '#2DD4BF'};
        }
        .tech-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 1.5rem;
          padding: 1.5rem 0;
        }
        .tech-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1.25rem;
          border-radius: 0.75rem;
          background: ${isDarkMode ? 'rgba(31, 42, 68, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
          border: 1px solid ${isDarkMode ? 'rgba(0, 188, 212, 0.2)' : 'rgba(45, 212, 191, 0.2)'};
          animation: pulse 3s infinite ease-in-out;
        }
        .tech-logo {
          width: 36px;
          height: 36px;
          margin-bottom: 0.5rem;
        }
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }
        .intro-box {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: ${isDarkMode ? '#1A202C' : '#F5F7FA'};
          z-index: 2000;
          perspective: 1000px;
        }
      `}</style>

      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="intro-box"
            variants={introBoxVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          />
        )}
      </AnimatePresence>

      <div ref={cursorRef} className="custom-cursor hidden" />

      <motion.nav
        className={`fixed top-0 w-full z-50 transition-all duration-200 ${
          scrolled ? 'py-3 shadow-md backdrop-blur-md bg-black/30' : 'py-6 bg-transparent'
        }`}
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: showIntro ? 3 : 0 }}
      >
        <div className="container mx-auto flex items-center justify-between px-6">
          <div className="font-bold text-xl name-gradient">A₹UN</div>
          <div className="hidden md:flex gap-6 items-center absolute left-1/2 transform -translate-x-1/2">
            <a href="#" className="hover:text-blue-400 transition">
              Home
            </a>
            <a href="#projects" className="hover:text-blue-400 transition">
              Projects
            </a>
            <a href="#" className="hover:text-blue-400 transition">
              Resume
            </a>
            <a href="mailto:arunshekhram@gmail.com" className="hover:text-blue-400 transition">
              📋
            </a>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-2 text-white focus:outline-none"
              aria-label="Toggle theme"
            >
              {isDarkMode ? '🌞' : '🌙'}
            </button>
          </div>
          <button
            className="md:hidden text-white focus:outline-none text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span aria-hidden="true">{menuOpen ? '✖' : '☰'}</span>
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden flex flex-col items-center gap-4 mt-4 pb-4">
            <a href="#" className="hover:text-blue-400 transition">
              Home
            </a>
            <a href="#projects" className="hover:text-blue-400 transition">
              Projects
            </a>
            <a href="#" className="hover:text-blue-400 transition">
              Resume
            </a>
            <a href="mailto:arunshekhram@gmail.com" className="hover:text-blue-400 transition">
              📋
            </a>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-2 text-white focus:outline-none"
              aria-label="Toggle theme"
            >
              {isDarkMode ? '🌞' : '🌙'}
            </button>
          </div>
        )}
      </motion.nav>

      <motion.main
        ref={mainRef}
        className="theme-box max-w-4xl mx-auto rounded-2xl p-10 text-center mt-24"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: showIntro ? 3.3 : 0.3, duration: 0.6 }}
      >
        <motion.h1
          className="text-6xl font-black mb-6 flex justify-center flex-wrap gap-3 cursor-default"
          style={{ fontFamily: 'Poppins' }}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {'A₹UN'.split('').map((char, index) => (
            <motion.span
              key={index}
              className="name-gradient hover:scale-125 transition-transform duration-300"
              variants={childVariants(index)}
              whileHover={{ textShadow: `0px 0px 8px ${isDarkMode ? '#00BCD4' : '#2DD4BF'}` }}
            >
              <TypingText text={char} />
            </motion.span>
          ))}
          <motion.span
            className="name-gradient"
            variants={childVariants(4)}
            whileHover={{ textShadow: `0px 0px 8px ${isDarkMode ? '#00BCD4' : '#2DD4BF'}` }}
          >
            <TypingText text=" $HEKHAR" />
          </motion.span>
        </motion.h1>

        <div className="mt-6">
          <a
            href="https://github.com/arun9557"
            className="inline-block text-sm px-5 py-2 rounded-full font-inter mr-3 btn-hover transition"
          >
            GitHub
          </a>
          <a
            href="https://arun-shekhar-blog.example.com"
            className="inline-block text-sm px-5 py-2 rounded-full font-inter btn-hover transition"
          >
            Blog →
          </a>
        </div>

        <p className="mt-8 text-lg font-inter">
          <TypingText text="AI & Data Science @ IIT Jodhpur | From 12th-pass to Full-Stack Developer & Ethical Hacker in the making — building, breaking, and learning every day." />
        </p>
        <p className="text-sm mt-3 opacity-75 font-inter">
          <TypingText text="From a 12th-pass student with big dreams to an AI & Data Science learner at IIT Jodhpur — on a mission to master Full-Stack Development and Ethical Hacking. Building real projects, breaking limits, and sharing the journey from zero to impact." />
        </p>

        <motion.div
          className="flex justify-center gap-1 mt-8 text-2xl"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: showIntro ? 3.5 : 0.5, duration: 0.8, staggerChildren: 0.2 }}
        >
          {[
            { href: 'https://github.com/arun9557', img: 'github', alt: 'GitHub' },
            { href: 'https://x.com/ArunShekha_?t=gsrx3cvBePkqSbZLeai8EQ&s=08', img: 'twitterx--v1', alt: 'X' },
            { href: 'https://www.linkedin.com/in/arun-shekar-209483364', img: 'linkedin', alt: 'LinkedIn' },
            { href: 'mailto:arunshekhram@gmail.com', img: 'gmail', alt: 'Gmail' },
            { href: 'https://arun-shekhar-blog.example.com', img: 'blog', alt: 'Blog' },
            { href: 'https://www.instagram.com/arunshekhar.in/', img: 'instagram-new', alt: 'Instagram' },
          ].map(({ href, img, alt }, index) => (
            <motion.a
              key={img}
              href={href}
              className="hover:scale-110 transition"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <img src={`https://img.icons8.com/color/48/${img}.png`} alt={alt} className="social-icon" />
            </motion.a>
          ))}
        </motion.div>

        <p className="text-xs mt-4 font-inter">Based in India</p>
        <p
          className="text-xs text-right mt-6 font-inter"
          style={{ color: isDarkMode ? '#00BCD4' : '#2DD4BF' }}
        >
          Available for projects
        </p>
      </motion.main>

      <motion.section
        className="theme-box max-w-5xl mx-auto mt-16 px-8 rounded-xl p-10 shadow-2xl border border-white/10 backdrop-blur-md"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2
          className="uppercase text-xs font-inter tracking-wide"
          style={{ color: isDarkMode ? '#00BCD4' : '#2DD4BF' }}
        >
          Technologies
        </h2>
        <h3 className="text-2xl mt-2 mb-8 font-inter font-semibold">Tools I work with</h3>
        <motion.div
          className="tech-grid"
          variants={techContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            { name: 'JavaScript', logo: 'javascript' },
            { name: 'HTML', logo: 'html-5--v1' },
            { name: 'CSS', logo: 'css3' },
            { name: 'Python', logo: 'python' },
            { name: 'GitHub', logo: 'github' },
            { name: 'Kali Linux', logo: 'kali' },
            { name: 'Dark Web', logo: 'dark-web' },
            { name: 'Hx', logo: 'hacker' },
            { name: 'AI', logo: 'artificial-intelligence' },
            { name: 'Parrot OS', logo: 'parrot' },
          ].map(({ name, logo }, index) => (
            <motion.div
              key={index}
              className="tech-item"
              variants={techChildVariants}
              whileHover={{
                scale: 1.05,
                rotateX: 8,
                rotateY: 8,
                boxShadow: `0 8px 24px ${isDarkMode ? 'rgba(0, 188, 212, 0.4)' : 'rgba(45, 212, 191, 0.4)'}`,
                zIndex: 10,
              }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <img src={`https://img.icons8.com/color/36/${logo}.png`} alt={`${name} logo`} className="tech-logo" />
              <span className="text-base font-inter">{name}</span>
            </motion.div>
          ))}
        </motion.div>
        <p
          className="mt-6 text-sm font-inter italic"
          style={{ color: isDarkMode ? '#00BCD4' : '#2DD4BF' }}
        >
          Always learning, always evolving
        </p>
      </motion.section>

      <motion.section
        id="projects"
        className="theme-box max-w-5xl mx-auto mt-16 px-8 rounded-xl p-10 shadow-2xl border border-white/10 backdrop-blur-md"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2
          className="uppercase text-xs font-inter tracking-wide"
          style={{ color: isDarkMode ? '#00BCD4' : '#2DD4BF' }}
        >
          Projects
        </h2>
        <h3 className="text-2xl mt-2 mb-8 font-inter font-semibold">Some Projects I've Built</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="rounded-xl p-6 shadow-lg border border-white/10 bg-white/5">
            <h4 className="text-lg font-bold mb-2">Portfolio Website</h4>
            <p className="text-sm mb-4">React, Next.js, TailwindCSS, Framer Motion</p>
            <div className="flex gap-4">
              <a href="https://my-portfolio-kappa-five-34.vercel.app" target="_blank" rel="noopener noreferrer">
                Live
              </a>
              <a
                href="https://github.com/arun9557/my-portfolio"
                target="_blank"
                className="text-blue-400 underline"
              >
                Code
              </a>
            </div>
          </div>
          <div className="rounded-xl p-6 shadow-lg border border-white/10 bg-white/5">
            <h4 className="text-lg font-bold mb-2">My Blog (Coming Soon)</h4>
            <p className="text-sm mb-4">Next.js, Markdown, Content Layer</p>
            <div className="flex gap-4">
              <span className="text-gray-400">Live</span>
              <span className="text-gray-400">Code</span>
            </div>
          </div>
        </div>
      </motion.section>
    </>
  );
}

interface ToolProps {
  icon: string;
  label: string;
  isDarkMode: boolean;
}

function Tool({ icon, label, isDarkMode }: ToolProps) {
  return (
    <motion.div
      whileHover={{
        scale: 1.1,
        rotateX: 5,
        rotateY: 5,
        boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
      }}
      className="rounded-xl p-4 transition duration-300 hover:shadow-lg hover:ring-2"
      style={{
        background: isDarkMode ? '#1F2A44' : '#FFFFFF',
        color: isDarkMode ? '#D1D5DB' : '#1F2937',
        border: `1px solid ${isDarkMode ? 'rgba(0, 188, 212, 0.2)' : 'rgba(45, 212, 191, 0.2)'}`,
      }}
    >
      <img src={`https://img.icons8.com/color/48/${icon}.png`} alt={label} className="mx-auto mb-2" />
      <p className="text-xs font-inter">{label}</p>
    </motion.div>
  );
}