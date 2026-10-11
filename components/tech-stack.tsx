/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import {
  Cpu,
  Radio,
  Network,
  Activity,
  Terminal,
  Binary,
  Database,
  TrendingUp,
  HeartPulse,
  Navigation,
  Gamepad2,
} from "lucide-react";

interface TechItem {
  name: string;
  icon?: string;
  lucideIcon?: any;
  accentColor?: string;
}

interface TechCategory {
  title: string;
  description: string;
  items: TechItem[];
}

// Defined at module scope — never recreated on re-render
const CATEGORIES: TechCategory[] = [
  {
    title: "Languages",
    description: "Systems programming, algorithmic modeling and database querying",
    items: [
      { name: "Python",  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
      { name: "C++",    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
      { name: "Java",   icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
      { name: "SQL",    lucideIcon: Database, accentColor: "#A5B5C2" },
    ],
  },
  {
    title: "Embedded / Hardware",
    description: "Embedded systems, RF & IoT",
    items: [
      { name: "ESP32",           lucideIcon: Cpu,        accentColor: "#A5B5C2" },
      { name: "AD8232 (ECG)",    lucideIcon: HeartPulse, accentColor: "#A5B5C2" },
      { name: "Arduino IDE",     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg" },
      { name: "USRP B210 (SDR)", lucideIcon: Radio,      accentColor: "#A5B5C2" },
      { name: "GPS Modules",     lucideIcon: Navigation, accentColor: "#A5B5C2" },
      { name: "Raspberry Pi",    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/raspberrypi/raspberrypi-original.svg" },
    ],
  },
  {
    title: "AI / ML & Computational Tools",
    description: "Neural networks, computer vision & computational biology",
    items: [
      { name: "TensorFlow / Keras", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" },
      { name: "Scikit-learn",       icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg" },
      { name: "XGBoost",            lucideIcon: Binary,     accentColor: "#A5B5C2" },
      { name: "NumPy",              icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg" },
      { name: "Pandas",             icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg" },
      { name: "Matplotlib",         icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matplotlib/matplotlib-original.svg" },
      { name: "Seaborn",            lucideIcon: TrendingUp, accentColor: "#A5B5C2" },
      { name: "OpenCV",             icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg" },
      { name: "SFML",               lucideIcon: Gamepad2,   accentColor: "#A5B5C2" },
      { name: "VCell Simulation",   lucideIcon: Activity,   accentColor: "#A5B5C2" },
      { name: "Cytoscape.js",       lucideIcon: Network,    accentColor: "#A5B5C2" },
    ],
  },
  {
    title: "Backend / Tools / DevOps",
    description: "Cloud, DevOps & application development",
    items: [
      { name: "Firebase",     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" },
      { name: "MongoDB",      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
      { name: "MySQL",        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
      { name: "Docker",       icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
      { name: "Jenkins",      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg" },
      { name: "Git / GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
      { name: "VS Code",      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
      { name: "REST APIs",    lucideIcon: Terminal, accentColor: "#A5B5C2" },
      { name: "React",        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
      { name: "React Native", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
      { name: "Spring Boot",  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" },
      { name: "LaTeX (IEEE)", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/latex/latex-original.svg" },
    ],
  },
];

export default function TechStack() {
  return (
    <section
      id="tech"
      className="relative section-rule py-12 md:py-16 border-t border-border/30"
    >
      <div id="tech-stack" className="absolute -top-10 left-0" aria-hidden="true" />
      <div className="relative section-container z-10">

        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-14">
          <span className="space-grotesk-2 inline-block text-[11px] font-eyebrow uppercase tracking-[0.22em] text-accent-soft mb-3">
            TECHNICAL ARCHITECTURE
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-foreground">
            Tech Stack
          </h2>
          <p className="space-grotesk-1 text-sm sm:text-base text-muted font-body font-light mt-3 leading-relaxed max-w-lg mx-auto">
            Technologies I work with.
          </p>
        </div>

        {/* 2×2 editorial grid: row heights fit content naturally, equal per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
          {CATEGORIES.map((category, idx) => (
            <motion.article
              key={idx}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: 0.5, delay: idx * 0.07 }}
              className="group flex flex-col h-full rounded-xl border border-white/[0.045] bg-white/[0.012] p-6 sm:p-7 hover:border-white/[0.09] transition-colors duration-200"
            >
              {/* Category heading & description */}
              <header className="mb-5 pb-3.5 border-b border-white/[0.04] flex flex-col justify-start">
                <h3 className="font-heading font-medium text-[1.1rem] sm:text-[1.15rem] text-foreground/90 tracking-tight leading-snug">
                  {category.title}
                </h3>
                <p className="space-grotesk-1 text-xs sm:text-[13px] leading-relaxed text-muted/70 font-body font-light mt-1.5">
                  {category.description}
                </p>
              </header>

              {/* Technology items — comfortable, natural spacing */}
              <ul
                className="flex flex-wrap gap-x-5 sm:gap-x-6 gap-y-3 sm:gap-y-3.5"
                aria-label={`${category.title} technologies`}
              >
                {category.items.map((item, itemIdx) => {
                  const LucideIconComp = item.lucideIcon;
                  return (
                    <li
                      key={itemIdx}
                      className="group/item inline-flex items-center gap-2.5 cursor-default"
                    >
                      {/* Icon */}
                      <span className="shrink-0 opacity-60 group-hover/item:opacity-95 transition-opacity duration-150">
                        {item.icon ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={item.icon}
                            alt=""
                            width={14}
                            height={14}
                            loading="lazy"
                            className="w-3.5 h-3.5 object-contain"
                          />
                        ) : LucideIconComp ? (
                          <LucideIconComp
                            className="w-3.5 h-3.5"
                            style={{ color: item.accentColor ?? "var(--accent-soft)" }}
                          />
                        ) : null}
                      </span>

                      {/* Name */}
                      <span className="space-grotesk-1 text-[13px] sm:text-[13.5px] text-foreground/75 group-hover/item:text-foreground transition-colors duration-150 leading-snug whitespace-nowrap">
                        {item.name}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
