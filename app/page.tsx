'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Theme {
  bg: string;
  accent: string;
  secondary: string;
  text: string;
  name: string;
  emoji: string;
}

const themes: Record<string, Theme> = {
  moonlight: {
    bg: 'linear-gradient(to right, #232526, #414345)',
    accent: '#00ADB5',
    secondary: '#EEEEEE',
    text: '#FFFFFF',
    name: 'Moonlight Glow',
    emoji: '🌙',
  },
  tropical: {
    bg: 'linear-gradient(to right,rgb(229, 231, 249),rgb(242, 242, 240))',
    accent: '#FF6B6B',
    secondary: '#FFD647',
    text: '#1E1E1E',
    name: 'Tropical Pop',
    emoji: '🍍',
  },
  cyberpunk: {
    bg: 'linear-gradient(to right, #0f0c29, #302b63, #24243e)',
    accent: '#FF2E63',
    secondary: '#08D9D6',
    text: '#EAEAEA',
    name: 'Cyberpunk Edge',
    emoji: '🧬',
  },
};

export default function Home() {
  const [currentTheme, setCurrentTheme] = useState<keyof typeof themes>('moonlight');

  useEffect(() => {
    document.body.className = currentTheme;
  }, [currentTheme]);

  const theme = themes[currentTheme];

  return (
    <>
      <style jsx global>{`
        body {
          background: ${theme.bg};
          color: ${theme.text};
          transition: all 0.3s ease;
        }
        .theme-box {
          background: ${theme.bg.includes('gradient') ? theme.bg : theme.secondary};
          color: ${theme.text};
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .name-gradient {
          background: linear-gradient(to right, ${theme.accent}, ${theme.secondary});
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      {/* Theme switcher */}
      <motion.div
        className="fixed top-4 right-4 z-50"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="theme-box p-3 rounded-xl">
          <div className="flex gap-2">
            {Object.entries(themes).map(([key, themeData]) => (
              <button
                key={key}
                onClick={() => setCurrentTheme(key as keyof typeof themes)}
                className={`w-10 h-10 rounded-lg transition-all duration-300 theme-btn ${
                  currentTheme === key ? 'ring-2 ring-offset-2' : ''
                }`}
                style={{
                  backgroundColor: themeData.accent,
                  color: currentTheme === 'tropical' ? '#fff' : '#000',
                }}
                title={themeData.name}
              >
                {themeData.emoji}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Top Navbar */}
      <motion.nav
        className="theme-box flex justify-center gap-8 p-6 relative"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div className="relative group">
          <a
            href="#"
            className="rounded-full px-4 py-2 text-sm font-semibold transition bg-gradient-to-r from-purple-500 to-orange-400 text-white shadow-md"
          >
            Home
          </a>
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 text-xs px-2 py-1 bg-black bg-opacity-70 text-white rounded opacity-0 group-hover:opacity-100 transition pointer-events-none">
            Go to Home
          </span>
        </div>

        <div className="relative group">
          <a
            href="#projects"
            className="text-sm font-semibold px-2 py-1 hover:text-blue-400 transition"
          >
            Projects
          </a>
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 text-xs px-2 py-1 bg-black bg-opacity-70 text-white rounded opacity-0 group-hover:opacity-100 transition pointer-events-none">
            View Projects
          </span>
        </div>

        <div className="relative group">
          <a
            href="mailto:arunshekhram@gmail.com"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-green-400 shadow-lg hover:scale-105 transition"
          >
            📋
          </a>
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 text-xs px-2 py-1 bg-black bg-opacity-70 text-white rounded opacity-0 group-hover:opacity-100 transition pointer-events-none">
            Copy Email
          </span>
        </div>
      </motion.nav>

      {/* Main Section */}
      <motion.main
        className="theme-box max-w-4xl mx-auto rounded-2xl p-10 text-center mt-12"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <motion.h1
          className="text-6xl font-black mb-6 flex justify-center flex-wrap gap-1 cursor-default"
          style={{ fontFamily: 'Poppins' }}
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {'A₹UN   $HEKHAR'.split('').map((char, index) => (
            <motion.span
              key={index}
              className="name-gradient hover:scale-125 transition-transform duration-300"
              variants={{
                hidden: { opacity: 0, y: -30 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ textShadow: `0px 0px 8px ${theme.accent}` }}
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>

        <div className="mt-6">
          <a href="https://github.com/arun9557" className="inline-block text-sm px-5 py-2 rounded-full font-inter mr-3 btn-hover transition">GitHub</a>
          <a href="https://arun-shekhar-blog.example.com" className="inline-block text-sm px-5 py-2 rounded-full font-inter btn-hover transition">Blog →</a>
        </div>

        <p className="mt-8 text-lg font-inter">
        "AI & Data Science @ IIT Jodhpur | From 12th-pass to Full-Stack Developer & Ethical Hacker in the making — building, breaking, and learning every day."
        </p>
        <p className="text-sm mt-3 opacity-75 font-inter">
          "From a 12th-pass student with big dreams to an AI & Data Science learner at IIT Jodhpur — on a mission to master Full-Stack Development and Ethical Hacking. Building real projects, breaking limits, and sharing the journey from zero to impact."
        </p>

        {/* Social Icons Animated Left Slide */}
        <motion.div
          className="flex justify-center gap-5 mt-8 text-2xl"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {[
            { href: "https://github.com/arun9557", img: "github" },
            { href: "https://x.com/ArunShekha_?t=gsrx3cvBePkqSbZLeai8EQ&s=08", img: "twitterx--v1" },
            { href: "https://www.linkedin.com/in/arun-shekar-209483364", img: "linkedin" },
            { href: "mailto:arunshekhram@gmail.com", img: "gmail" },
            { href: "https://arun-shekhar-blog.example.com", img: "blog" },
            { href: "https://www.instagram.com/arunshekhar.in/", img: "instagram" },
          ].map(({ href, img }) => (
            <a key={img} href={href} className="hover:scale-110 transition">
              <img src={`https://img.icons8.com/ios-filled/30/ffffff/${img}.png`} alt={img} />
            </a>
          ))}
        </motion.div>

        <p className="text-xs mt-4 font-inter">Based in India</p>
        <p className="text-xs text-right mt-6 font-inter" style={{ color: theme.accent }}>
          Available for projects
        </p>
      </motion.main>

      {/* Technologies Section */}
      <motion.section
  className="theme-box max-w-5xl mx-auto mt-16 px-8 rounded-xl p-10 shadow-2xl border border-white/10 backdrop-blur-md"
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  viewport={{ once: true }}
>
  <h2 className="uppercase text-xs font-inter tracking-wide" style={{ color: theme.accent }}>
    Technologies
  </h2>
  <h3 className="text-2xl mt-2 mb-8 font-inter font-semibold">
    Stack I’m Growing With
  </h3>

  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 place-items-center">
  {[
  { icon: "javascript", label: "JavaScript" },
  { icon: "html-5--v1", label: "HTML 5" },
  { icon: "css3", label: "CSS3" },
  { icon: "tailwind_css", label: "Tailwind CSS" },
  { icon: "typescript", label: "TypeScript" },
  { icon: "react-native", label: "React Native" },
].map(({ icon, label }, index) => (
  <Tool key={index} icon={icon} label={label} theme={theme} />
))}

  </div>
</motion.section>


      {/* Theme info bottom left */}
      <motion.div
        className="fixed bottom-4 left-4 z-40"
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="theme-box px-4 py-2 rounded-full text-xs">
          <span style={{ color: theme.accent }}>{theme.emoji}</span> {theme.name} Theme
        </div>
      </motion.div>
    </>
  );
}

interface ToolProps {
  icon: string;
  label: string;
  theme: Theme;
}

function Tool({ icon, label, theme  }: ToolProps) {
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
    background: theme.secondary,
    color: theme.text,
    border: `1px solid ${theme.accent}`,
  }}
>
  <img
    src={`https://img.icons8.com/color/48/${icon}.png`}
    alt={label}
    className="mx-auto mb-2"
  />
  <p className="text-xs font-inter">{label}</p>
</motion.div>

  );
}


