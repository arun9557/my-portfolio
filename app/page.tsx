'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, easeIn, easeOut } from 'framer-motion';
import * as THREE from 'three';
import dynamic from 'next/dynamic';
import Particles from '@tsparticles/react';

// Define VantaEffect as any (or import from Vanta if available)
type VantaEffect = any;

// Extend Window interface to include THREE
declare global {
  interface Window {
    THREE?: typeof THREE;
  }
}

// Define VantaSettings interface (if not defined elsewhere)
interface VantaSettings {
  el: HTMLElement | null;
  THREE?: typeof THREE;
  mouseControls?: boolean;
  touchControls?: boolean;
  gyroControls?: boolean;
  minHeight?: number;
  minWidth?: number;
  scale?: number;
  scaleMobile?: number;
  color?: number | string;
  backgroundColor?: number | string;
}

interface ToolProps {
  icon: string;
  label: string;
  isDarkMode: boolean;
}

interface Skill {
  icon: string;
  label: string;
  category: 'frontend' | 'backend' | 'tools';
}

interface Project {
  title: string;
  description: string;
  tags: string[];
  image: string;
  liveUrl?: string;
  codeUrl?: string;
  isFeatured?: boolean;
}

const skillsData: Skill[] = [
  // Frontend
  { icon: 'typescript', label: 'TypeScript', category: 'frontend' },
  { icon: 'react', label: 'React', category: 'frontend' },
  { icon: 'next-js', label: 'Next.js', category: 'frontend' },
  { icon: 'tailwindcss', label: 'Tailwind CSS', category: 'frontend' },
  { icon: 'sass', label: 'Sass', category: 'frontend' },
  { icon: 'graphql', label: 'GraphQL', category: 'frontend' },
  
  // Backend
  { icon: 'node-js', label: 'Node.js', category: 'backend' },
  { icon: 'express', label: 'Express', category: 'backend' },
  { icon: 'mongodb', label: 'MongoDB', category: 'backend' },
  { icon: 'postgresql', label: 'PostgreSQL', category: 'backend' },
  { icon: 'firebase', label: 'Firebase', category: 'backend' },
  
  // Tools
  { icon: 'git', label: 'Git', category: 'tools' },
  { icon: 'github', label: 'GitHub', category: 'tools' },
  { icon: 'visual-studio-code', label: 'VS Code', category: 'tools' },
  { icon: 'figma', label: 'Figma', category: 'tools' },
  { icon: 'adobe-photoshop', label: 'Photoshop', category: 'tools' },
];

const projects: Project[] = [
  {
    title: "IITCohort",
    description: "Smart Batch Collaboration Platform for IIT students to connect, collaborate, and grow together in their academic and professional journeys.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "MongoDB", "Node.js"],
    image: "/images/projects/iitcohort.png",
    liveUrl: "https://iitcohort.vercel.app/",
    isFeatured: true
  },
  {
    title: "Portfolio Website",
    description: "A modern, responsive portfolio website built with Next.js and Framer Motion, showcasing my projects and skills with smooth animations.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    image: "/images/projects/portfolio.png",
    liveUrl: "https://my-portfolio-kappa-five-34.vercel.app",
    codeUrl: "https://github.com/arun9557/my-portfolio",
    isFeatured: true
  },
  {
    title: "My Blog",
    description: "A personal blog platform built with Next.js and Markdown, featuring code syntax highlighting and responsive design.",
    tags: ["Next.js", "Markdown", "Content Layer", "Tailwind CSS"],
    image: "/images/projects/blog.png",
    isFeatured: false
  }
];

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
    let isMounted = true;
    if (typeof window !== 'undefined' && mainRef.current && !isDarkMode) {
      // Temporarily disabled Vanta.js due to compatibility issues
      // TODO: Find alternative background solution or fix Vanta integration
      console.log('Vanta.js temporarily disabled - using fallback background');
      
      // Set a simple gradient background as fallback
      if (mainRef.current) {
        mainRef.current.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
      }
      
      /* Original Vanta code - commented out for now
      // First, ensure THREE is available globally
      import('three').then((THREEModule) => {
        window.THREE = THREEModule;
        
        // Then import Vanta Topology
        import('vanta/dist/vanta.topology.min').then((VANTA) => {
          if (!isMounted) return;
          
          try {
            // Access the Vanta function - it should be the default export
            const VantaTopology = VANTA.default;
            
            if (typeof VantaTopology === 'function') {
              vantaEffect.current = VantaTopology({
                el: mainRef.current,
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.0,
                minWidth: 200.0,
                scale: 1.0,
                scaleMobile: 1.0,
                color: 0xa6b6b6,
                backgroundColor: 0xfafcfc,
              });
            } else {
              console.error('VantaTopology is not a function:', VantaTopology);
            }
          } catch (error) {
            console.error('Error initializing Vanta:', error);
          }
        }).catch((error) => {
          console.error('Error loading Vanta:', error);
        });
      }).catch((error) => {
        console.error('Error loading THREE:', error);
      });
      */
    }
    return () => {
      isMounted = false;
      if (vantaEffect.current && typeof vantaEffect.current.destroy === 'function') {
        try {
          vantaEffect.current.destroy();
        } catch (error) {
          console.warn('Error during Vanta cleanup:', error);
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
      transition: { duration: 0.3, ease: easeOut },
    },
  });

  const introBoxVariants = {
    hidden: { y: '-100vh', rotateX: 90 },
    visible: {
      y: 0,
      rotateX: 0,
      transition: { duration: 1, ease: easeOut },
    },
    exit: {
      y: '100vh',
      rotateX: -90,
      transition: { duration: 1, ease: easeIn },
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
      transition: { duration: 0.5, ease: easeOut },
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
          color:rgb(46, 83, 138);
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
          background: #ffffff !important;
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
          scrolled ? 'py-2 sm:py-3 shadow-md backdrop-blur-md bg-black/30' : 'py-4 sm:py-6 bg-transparent'
        }`}
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: showIntro ? 3 : 0 }}
      >
        <div className="container mx-auto flex items-center justify-between px-4 sm:px-6">
          <div className="font-bold text-lg sm:text-xl name-gradient">A₹UN</div>
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
          </div>
          <button
            className="md:hidden text-white focus:outline-none text-xl sm:text-2xl p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span aria-hidden="true">{menuOpen ? '✖' : '☰'}</span>
          </button>
        </div>
        {menuOpen && (
          <motion.div 
            className="md:hidden flex flex-col items-center gap-4 mt-4 pb-4 px-4 bg-black/20 backdrop-blur-md border-t border-white/10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <a href="#" className="hover:text-blue-400 transition py-2 w-full text-center">
              Home
            </a>
            <a href="#projects" className="hover:text-blue-400 transition py-2 w-full text-center">
              Projects
            </a>
            <a href="#" className="hover:text-blue-400 transition py-2 w-full text-center">
              Resume
            </a>
            <a href="mailto:arunshekhram@gmail.com" className="hover:text-blue-400 transition py-2 w-full text-center">
              📋 Contact
            </a>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-3 text-white focus:outline-none hover:scale-110 transition-transform"
              aria-label="Toggle theme"
            >
              {isDarkMode ? '🌞' : '🌙'}
            </button>
          </motion.div>
        )}
      </motion.nav>

      <motion.main
        ref={mainRef}
        className="theme-box max-w-4xl mx-auto rounded-2xl p-10 text-center mt-24"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: showIntro ? 3.3 : 0.3, duration: 0.6 }}
      >
        <div className="flex items-center justify-center gap-4 mb-6">
          <motion.h1
            className="text-6xl font-black flex justify-center flex-wrap gap-3 cursor-default"
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
            <motion.span
              className="name-gradient ml-2"
              variants={childVariants(5)}
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.2, 1],
                y: [0, -8, 0],
                x: [0, 4, -4, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
              }}
            >
              🚀
            </motion.span>
          </motion.h1>
          <motion.button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-4 text-white focus:outline-none hover:scale-110 transition-transform shadow-lg relative overflow-hidden"
            aria-label="Toggle theme"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: showIntro ? 3.4 : 0.4, duration: 0.6 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{
              boxShadow: isDarkMode 
                ? '0 0 20px rgba(255, 193, 7, 0.6), 0 0 40px rgba(255, 193, 7, 0.3)' 
                : '0 0 20px rgba(59, 130, 246, 0.6), 0 0 40px rgba(59, 130, 246, 0.3)'
            }}
          >
            {/* Light glow effect */}
            <div 
              className="absolute inset-0 rounded-full opacity-50"
              style={{
                background: isDarkMode 
                  ? 'radial-gradient(circle, rgba(255, 193, 7, 0.8) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, transparent 70%)'
              }}
            />
            
            <motion.span 
              className="text-2xl block relative z-10"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1],
                y: [0, -8, 0]
              }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 3 },
                scale: { duration: 0.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.4 },
                y: { duration: 0.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.4 }
              }}
            >
              {isDarkMode ? '🌞' : '🌙'}
            </motion.span>
          </motion.button>
        </div>

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
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
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
                scale: 1.09,
                rotate: [0, 3, -3, 0],
                boxShadow: `0 0 32px ${isDarkMode ? '#00BCD4' : '#764ba2'}`,
                zIndex: 10,
              }}
              animate={{
                y: [0, -8, 0, 8, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.18,
              }}
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

      {/* Skills Section */}
      <motion.section
        className="relative max-w-6xl mx-auto mt-24 px-4 sm:px-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="relative">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              Skills & Technologies
            </motion.h2>
          </div>

          {/* Skills Grid */}
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            {skillsData.map((skill, index) => (
              <motion.div
                key={skill.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index % 5) }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <Tool 
                  icon={skill.icon} 
                  label={skill.label} 
                  isDarkMode={isDarkMode} 
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        id="projects"
        className="relative max-w-6xl mx-auto mt-24 px-4 sm:px-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="relative">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              Featured Projects
            </motion.h2>
            <motion.p 
              className="max-w-2xl mx-auto text-gray-400"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              Here are some of my recent projects. Each one was built to solve a specific problem or explore new technologies.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.article
                key={`${project.title}-${index}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.1,
                  type: 'spring',
                  stiffness: 100
                }}
                viewport={{ once: true, margin: "-50px" }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                tabIndex={0}
                aria-label={`Project: ${project.title}`}
              >
                <div className="relative h-48 overflow-hidden">
                  {/* Project Image with Gradient Overlay */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 z-10 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300"
                    aria-hidden="true"
                  />
                  
                  {/* Project Image */}
                  <img
                    src={project.image}
                    alt={`Screenshot of ${project.title} project`}
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110 group-focus:scale-110"
                    loading="lazy"
                    width={600}
                    height={300}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/projects/placeholder.png';
                    }}
                  />
                  
                  {/* Project Title Overlay */}
                  <div 
                    className="absolute inset-0 flex items-end p-6 bg-gradient-to-t from-black/90 via-black/30 to-transparent"
                    aria-hidden="true"
                  >
                    <h3 className="text-xl font-bold text-white">
                      <span className="sr-only">Project: </span>
                      {project.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-300 mb-4 line-clamp-2">{project.description}</p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6" role="list" aria-label="Technologies used">
                    {project.tags.map((tag) => (
                      <motion.span 
                        key={`${tag}-${project.title}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                        className="px-3 py-1 text-xs font-medium rounded-full backdrop-blur-sm select-none"
                        style={{
                          background: 'rgba(0, 188, 212, 0.1)',
                          color: '#00BCD4',
                          border: '1px solid rgba(0, 188, 212, 0.2)'
                        }}
                        role="listitem"
                        aria-label={tag}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-4 py-2 text-center rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 group/button focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                        }}
                        aria-label={`View ${project.title} live demo (opens in new tab)`}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 10px 20px -5px rgba(102, 126, 234, 0.5)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Live Demo
                      </a>
                    )}
                    
                    {project.codeUrl ? (
                      <a
                        href={project.codeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-4 py-2 text-center rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        View Code
                      </a>
                    ) : (
                      <button
                        disabled
                        className="flex-1 px-4 py-2 text-center rounded-lg font-medium opacity-50 cursor-not-allowed flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Private Code
                      </button>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* View More Button */}
          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            <a
              href="https://github.com/arun9557"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 rounded-full font-medium transition-all duration-300"
              style={{
                background: isDarkMode 
                  ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)' 
                  : 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                color: isDarkMode ? '#667eea' : '#764ba2',
                border: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(118, 75, 162, 0.2)'}`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isDarkMode 
                  ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)'
                  : 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isDarkMode 
                  ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)' 
                  : 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)';
              }}
            >
              View All Projects on GitHub
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        id="contact"
        className="theme-box max-w-5xl mx-auto mt-16 px-8 rounded-xl p-10 shadow-2xl border border-white/10 backdrop-blur-md"
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
        viewport={{ once: true }}
      >
        <div className="flex flex-col md:flex-row gap-8">
          <form className="flex-1 rounded-lg p-6" style={{ minWidth: '280px', background: isDarkMode ? '#1F2A44' : '#FFFFFF', color: isDarkMode ? '#D1D5DB' : '#1F2937' }}>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-1" htmlFor="name">Name</label>
              <input className="w-full border-b border-gray-400 bg-transparent outline-none py-2 mb-2" id="name" name="name" type="text" placeholder="Enter your Name" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-1" htmlFor="email">Email</label>
              <input className="w-full border-b border-gray-400 bg-transparent outline-none py-2 mb-2" id="email" name="email" type="email" placeholder="Enter a valid email address" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-1" htmlFor="phone">Phone</label>
              <input className="w-full border-b border-gray-400 bg-transparent outline-none py-2 mb-2" id="phone" name="phone" type="tel" placeholder="Enter your phone (e.g. +14155552675)" />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-bold mb-1" htmlFor="message">Message</label>
              <textarea className="w-full border-b border-gray-400 bg-transparent outline-none py-2 mb-2 resize-none" id="message" name="message" placeholder="Enter your message" rows={3}></textarea>
            </div>
            <button type="submit" className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-6 py-2 rounded-full font-bold mt-2">SUBMIT</button>
          </form>
          <div className="flex-1 flex flex-col items-center justify-center">
            <h3 className="text-2xl font-inter font-semibold mb-6">Follow us</h3>
            <div className="flex flex-col gap-4 w-full max-w-xs">
              <a href="https://www.linkedin.com/in/arun-shekar-209483364" target="_blank" rel="noopener noreferrer" className="w-full py-2 rounded-full text-white font-bold text-center bg-gradient-to-r from-[#667eea] to-[#764ba2]">LINKEDIN</a>
              <a href="#" className="w-full py-2 rounded-full text-white font-bold text-center bg-gradient-to-r from-[#667eea] to-[#764ba2]">YOUTUBE</a>
              <a href="https://x.com/ArunShekha_?t=gsrx3cvBePkqSbZLeai8EQ&s=08" target="_blank" rel="noopener noreferrer" className="w-full py-2 rounded-full text-white font-bold text-center bg-gradient-to-r from-[#667eea] to-[#764ba2]">X</a>
              <a href="https://www.instagram.com/arunshekhar.in/" target="_blank" rel="noopener noreferrer" className="w-full py-2 rounded-full text-white font-bold text-center bg-gradient-to-r from-[#667eea] to-[#764ba2]">INSTAGRAM</a>
            </div>
          </div>
        </div>
      </motion.section>
    </>
  );
}



function Tool({ icon, label, isDarkMode }: ToolProps) {
  return (
    <motion.div
      className="relative group h-full"
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
    >
      <div className="absolute inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl opacity-0 group-hover:opacity-100 blur transition duration-500 group-hover:duration-200" />
      <motion.div
        className="relative h-full flex flex-col items-center justify-center p-5 rounded-xl transition-all duration-300 overflow-hidden"
        style={{
          background: isDarkMode ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${isDarkMode ? 'rgba(0, 188, 212, 0.1)' : 'rgba(45, 212, 191, 0.1)'}`,
        }}
        whileHover={{
          borderColor: isDarkMode ? 'rgba(0, 188, 212, 0.5)' : 'rgba(45, 212, 191, 0.5)',
          boxShadow: isDarkMode 
            ? '0 8px 32px rgba(0, 188, 212, 0.1)' 
            : '0 8px 32px rgba(45, 212, 191, 0.1)',
        }}
      >
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-12 h-12 flex items-center justify-center mb-3">
            <img 
              src={`https://img.icons8.com/color/96/${icon}.png`} 
              alt={label} 
              className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <p className="text-sm font-medium text-center">{label}</p>
        </div>
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-hidden="true"
        />
      </motion.div>
    </motion.div>
  );
}