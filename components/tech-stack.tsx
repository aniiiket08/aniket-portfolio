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
  badge: string;
  description: string;
  items: TechItem[];
}

export default function TechStack() {
  const categories: TechCategory[] = [
    {
      title: "Languages",
      badge: "CORE FOUNDATION",
      description: "Fundamental systems programming, algorithmic modeling, and database querying",
      items: [
        {
          name: "Python",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
        },
        {
          name: "C++",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
        },
        {
          name: "Java",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
        },
        {
          name: "SQL",
          lucideIcon: Database,
          accentColor: "#E2E8F0",
        },
      ],
    },
    {
      title: "Embedded / Hardware",
      badge: "SYSTEMS & RF",
      description: "Microcontrollers, RF instrumentation, physiological sensors, and edge computing",
      items: [
        {
          name: "ESP32",
          lucideIcon: Cpu,
          accentColor: "#E2E8F0",
        },
        {
          name: "AD8232 (ECG)",
          lucideIcon: HeartPulse,
          accentColor: "#CBD5E1",
        },
        {
          name: "Arduino IDE",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg",
        },
        {
          name: "USRP B210 (SDR)",
          lucideIcon: Radio,
          accentColor: "#E2E8F0",
        },
        {
          name: "GPS Modules",
          lucideIcon: Navigation,
          accentColor: "#CBD5E1",
        },
        {
          name: "Raspberry Pi",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/raspberrypi/raspberrypi-original.svg",
        },

      ],
    },
    {
      title: "AI/ML & Computational Tools",
      badge: "INTELLIGENCE & SIMULATION",
      description: "Neural architectures, signal classifiers, computer vision, and biological simulations",
      items: [
        {
          name: "TensorFlow / Keras",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
        },
        {
          name: "Scikit-learn",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg",
        },
        {
          name: "XGBoost",
          lucideIcon: Binary,
          accentColor: "#E2E8F0",
        },
        {
          name: "NumPy",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg",
        },
        {
          name: "Pandas",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg",
        },
        {
          name: "Matplotlib",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matplotlib/matplotlib-original.svg",
        },
        {
          name: "Seaborn",
          lucideIcon: TrendingUp,
          accentColor: "#CBD5E1",
        },
        {
          name: "OpenCV",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg",
        },
        {
          name: "SFML",
          lucideIcon: Gamepad2,
          accentColor: "#E2E8F0",
        },
        {
          name: "VCell Simulation",
          lucideIcon: Activity,
          accentColor: "#CBD5E1",
        },
        {
          name: "Cytoscape.js",
          lucideIcon: Network,
          accentColor: "#E2E8F0",
        },
      ],
    },
    {
      title: "Backend / Tools / DevOps",
      badge: "INFRASTRUCTURE & PROTOCOLS",
      description: "Cloud datastores, CI/CD pipelines, containerization, and modern client applications",
      items: [
        {
          name: "Firebase",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
        },
        {
          name: "MongoDB",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
        },
        {
          name: "MySQL",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
        },
        {
          name: "Docker",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
        },
        {
          name: "Jenkins",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg",
        },
        {
          name: "Git / GitHub",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
        },
        {
          name: "VS Code",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
        },
        {
          name: "REST APIs",
          lucideIcon: Terminal,
          accentColor: "#E2E8F0",
        },
        {
          name: "React",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
        },
        {
          name: "React Native",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
        },
        {
          name: "Spring Boot",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg",
        },
        {
          name: "LaTeX (IEEE)",
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/latex/latex-original.svg",
        },
      ],
    },
  ];

  return (
    <section
      id="tech"
      className="relative section-rule py-12 md:py-16 border-t border-border/30 overflow-hidden"
    >
      <div id="tech-stack" className="absolute -top-10 left-0" aria-hidden="true" />
      <div className="relative section-container z-10">
        {/* Large Centered Heading + Supporting Text */}
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-10">
          <span className="josefin-sans-2 inline-block text-[11px] font-eyebrow uppercase tracking-[0.22em] text-accent-soft mb-3">
            TECHNICAL ARCHITECTURE
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-foreground">
            Tech Stack
          </h2>
          <p className="josefin-sans-1 text-sm sm:text-base text-muted font-body font-light mt-4 leading-relaxed max-w-lg mx-auto">
            Technologies I work with.
          </p>
        </div>

        {/* Categorized Layered Panels (2x2 on desktop, single column on mobile) */}
        <div className="relative max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 sm:gap-x-6 gap-y-4 relative z-10">
            {categories.map((category, idx) => (
              <motion.article
                key={idx}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.55, delay: idx * 0.08 }}
                className="group relative rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md px-6 pt-6 pb-5 sm:px-7 sm:pt-7 sm:pb-5 hover:border-white/[0.15] hover:bg-white/[0.04] transition-all duration-300 shadow-[0_12px_36px_rgba(0,0,0,0.5)] flex flex-col"
              >
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3.5 mb-4">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-accent-soft">
                      {category.title}
                    </h3>
                  </div>
                </div>

                <p className="josefin-sans-1 text-xs text-muted/80 font-body font-light mb-5 leading-relaxed">
                  {category.description}
                </p>

                {/* Technology Items (Compact, Authentic icons, subtle hover) */}
                <div className="flex flex-wrap gap-2">
                  {category.items.map((item, itemIdx) => {
                    const LucideIconComp = item.lucideIcon;
                    return (
                      <motion.div
                        key={itemIdx}
                        whileHover={{ y: -1.5 }}
                        transition={{ duration: 0.15 }}
                        className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] text-xs sm:text-[12.5px] font-body text-foreground/85 hover:border-accent/50 hover:bg-white/[0.06] hover:text-foreground transition-all duration-200 cursor-default"
                      >
                        {item.icon ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={item.icon}
                            alt=""
                            width={14}
                            height={14}
                            loading="lazy"
                            className="w-3.5 h-3.5 object-contain shrink-0"
                          />
                        ) : LucideIconComp ? (
                          <LucideIconComp
                            className="w-3.5 h-3.5 shrink-0"
                            style={{ color: item.accentColor || "#E2E8F0" }}
                          />
                        ) : null}
                        <span>{item.name}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
