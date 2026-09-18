"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { Github } from "@/components/icons";

export interface FeaturedProject {
  number: string;
  category: string;
  title: string;
  image: string;
  description: string;
  tags: string[];
  githubUrl: string;
  liveUrl?: string;
  visualAlign: "right" | "left";
}

export default function ProjectsGrid() {
  const [showAll, setShowAll] = useState(false);

  // 1. Featured Top 3 Projects (Always shown on Homepage)
  const featuredProjects: FeaturedProject[] = [
    {
      number: "01",
      category: "RF SIGNAL PROCESSING & SDR",
      title: "3D Wi-Fi Based Floor Localization System",
      image: "/projects/wifi-localization.webp",
      description:
        "Indoor floor localization system using Wi-Fi RSSI fingerprinting with a USRP B210 SDR and a 1D CNN, achieving 93.34% validation accuracy. Published at IEEE ICONAT 2026.",
      tags: ["Python", "SDR", "Deep Learning", "CNN"],
      githubUrl: "https://github.com/aniiiket08/indoor-floor-prediction-wifi-sdr",
      visualAlign: "right",
    },
    {
      number: "02",
      category: "EDGE AI & MEDICAL HISTOPATHOLOGY",
      title: "Automated Prostate Cancer Detection",
      image: "/projects/prostate-detection.webp",
      description:
        "Edge-optimized prostate cancer detection pipeline from histopathology images using MobileNetV3 and XGBoost, achieving 84.37% accuracy and 0.9243 ROC-AUC on the SICAPv2 dataset. Presented at SGCNSP 2025, Singapore.",
      tags: ["MobileNetV3", "XGBoost", "Medical Imaging", "Edge AI"],
      githubUrl: "https://github.com/aniiiket08/automated-prostate-cancer-detection",
      visualAlign: "left",
    },
    {
      number: "03",
      category: "EMBEDDED IOT & BIOMETRICS",
      title: "Smart Wearable Attendance System",
      image: "/projects/wearable-attendance.webp",
      description:
        "ESP32-based wearable for automated attendance using ECG-based authentication and GPS geofencing, with real-time sync to Firebase.",
      tags: ["ESP32", "IoT", "Firebase", "ECG Biometrics"],
      githubUrl: "https://github.com/aniiiket08/smart-wearable-attendance-esp32",
      visualAlign: "right",
    },
  ];

  // 2. Remaining Projects (Revealed behind "View All Projects")
  const additionalProjects: FeaturedProject[] = [
    {
      number: "04",
      category: "COMPUTATIONAL BIOLOGY & DIGITAL TWINS",
      title: "NeuroSleep Digital Twin Platform",
      image: "/projects/neurosleep-digital-twin.webp",
      description:
        "A multi-scale computational Digital Twin linking cellular metabolic simulation (VCell), a spiking neuronal model, brain connectivity mapping (Cytoscape.js), and ML-based brain-state classification into one interactive dashboard for studying simulated sleep-deprivation effects.",
      tags: ["Python", "React", "VCell", "Cytoscape.js"],
      githubUrl: "https://github.com/aniiiket08/neurosleep-digital-twin",
      visualAlign: "left",
    },
  ];

  return (
    <section
      id="projects"
      className="section-rule py-20 md:py-32 border-t border-border/30"
    >
      <div className="section-container">
        {/* Section Intro Heading */}
        <div className="max-w-2xl mb-16 md:mb-24">
          <span className="josefin-sans-2 inline-block text-[11px] font-eyebrow uppercase tracking-[0.22em] text-accent-soft mb-3">
            FEATURED WORK
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Projects
          </h2>
          <p className="josefin-sans-1 text-sm sm:text-base text-muted font-body font-light mt-3.5 leading-relaxed">
            Selected research, machine learning, signal processing, and computational work.
          </p>
        </div>

        {/* Vertical Editorial Sequence (Alternating Left/Right) */}
        <div className="space-y-24 md:space-y-36">
          {featuredProjects.map((project) => {
            const isVisualRight = project.visualAlign === "right";

            return (
              <motion.article
                key={project.number}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="group relative"
              >
                <div
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
                    isVisualRight ? "" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Text Column (approx 45% on desktop) */}
                  <div
                    className={`lg:col-span-5 flex flex-col items-start ${
                      isVisualRight ? "order-2 lg:order-1" : "order-2 lg:order-2"
                    }`}
                  >
                    {/* Top Metadata: Number + Category + Archivo CASE STUDY badge */}
                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                      <span className="font-heading text-lg text-accent-soft font-bold">
                        {project.number}
                      </span>
                      <span className="h-3 w-px bg-white/10" />
                      <span className="josefin-sans-2 px-2.5 py-1 rounded-md border border-border bg-[var(--surface-soft)] backdrop-blur-md font-body text-[10px] font-medium uppercase tracking-widest text-accent-soft">
                        Case Study
                      </span>
                      <span className="h-3 w-px bg-white/10" />
                      <span className="josefin-sans-2 text-[10.5px] font-eyebrow uppercase tracking-[0.18em] text-muted/90">
                        {project.category}
                      </span>
                    </div>

                    {/* Project Title (Serif Display Typography) */}
                    <h3 className="josefin-sans-1 font-heading text-2xl sm:text-3xl md:text-[2.1rem] font-bold text-foreground leading-tight tracking-tight mb-4 group-hover:text-accent-soft transition-colors duration-200">
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline underline-offset-4 decoration-accent/40"
                      >
                        {project.title}
                      </a>
                    </h3>

                    {/* Exact Project Description */}
                    <p className="josefin-sans-1 text-sm sm:text-[15px] font-body font-light text-muted leading-relaxed mb-6">
                      {project.description}
                    </p>

                    {/* Technology Tags (Subtle, Compact) */}
                    <div className="flex flex-wrap gap-2 mb-7">
                      {project.tags.map((tag, tagIdx) => (
                        <span
                          key={tagIdx}
                          className="px-2.5 py-1 rounded-lg border border-white/[0.08] bg-white/[0.03] text-[11.5px] font-body font-normal text-muted/90"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Refined Secondary Action Link */}
                    <div className="flex items-center gap-4">
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link inline-flex items-center gap-2 text-xs font-body font-medium text-foreground hover:text-accent-soft transition-colors duration-200 py-1"
                      >
                        <Github className="w-4 h-4 opacity-70 group-hover/link:opacity-100 transition-opacity" />
                        <span>View Repository</span>
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all duration-200" />
                      </a>
                    </div>
                  </div>

                  {/* Visual Column (occupies 55% on desktop, real screenshot assets) */}
                  <div
                    className={`lg:col-span-7 ${
                      isVisualRight ? "order-1 lg:order-2" : "order-1 lg:order-1"
                    }`}
                  >
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block relative rounded-2xl border border-border bg-[var(--surface-glass)] overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.65)] hover:border-accent/40 transition-all duration-300 group/img"
                    >
                      <div className="absolute top-0 right-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none -z-10" />

                      <div className="relative aspect-[16/10] w-full overflow-hidden">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          loading="lazy"
                          sizes="(max-width: 1024px) 100vw, 55vw"
                          className="object-cover object-top transition-transform duration-500 ease-out group-hover/img:scale-[1.03]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)]/70 via-transparent to-transparent pointer-events-none" />
                      </div>
                    </a>
                  </div>
                </div>

                {/* Subtle Divider between projects */}
                <div className="mt-20 md:mt-28 border-b border-white/[0.06]" />
              </motion.article>
            );
          })}

          {/* Remaining Projects Revealed via "View All Projects" */}
          <AnimatePresence>
            {showAll && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-24 md:space-y-36 overflow-hidden pt-4"
              >
                {additionalProjects.map((project, idx) => {
                  const isVisualRight = project.visualAlign === "right";

                  return (
                    <motion.article
                      key={project.number}
                      initial={{ opacity: 0, y: 28 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: idx * 0.1 }}
                      className="group relative"
                    >
                      <div
                        className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
                          isVisualRight ? "" : "lg:flex-row-reverse"
                        }`}
                      >
                        {/* Text Column */}
                        <div
                          className={`lg:col-span-5 flex flex-col items-start ${
                            isVisualRight ? "order-2 lg:order-1" : "order-2 lg:order-2"
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-4 flex-wrap">
                            <span className="font-heading text-lg text-accent-soft font-bold">
                              {project.number}
                            </span>
                            <span className="h-3 w-px bg-white/10" />
                            <span className="josefin-sans-2 px-2.5 py-1 rounded-md border border-border bg-[var(--surface-soft)] backdrop-blur-md font-body text-[10px] font-medium uppercase tracking-widest text-accent-soft">
                              Case Study
                            </span>
                            <span className="h-3 w-px bg-white/10" />
                            <span className="josefin-sans-2 text-[10.5px] font-eyebrow uppercase tracking-[0.18em] text-muted/90">
                              {project.category}
                            </span>
                          </div>

                          <h3 className="josefin-sans-1 font-heading text-2xl sm:text-3xl md:text-[2.1rem] font-bold text-foreground leading-tight tracking-tight mb-4 group-hover:text-accent-soft transition-colors duration-200">
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline underline-offset-4 decoration-accent/40"
                            >
                              {project.title}
                            </a>
                          </h3>

                          <p className="josefin-sans-1 text-sm sm:text-[15px] font-body font-light text-muted leading-relaxed mb-6">
                            {project.description}
                          </p>

                          <div className="flex flex-wrap gap-2 mb-7">
                            {project.tags.map((tag, tagIdx) => (
                              <span
                                key={tagIdx}
                                className="px-2.5 py-1 rounded-lg border border-white/[0.08] bg-white/[0.03] text-[11.5px] font-body font-normal text-muted/90"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-4">
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group/link inline-flex items-center gap-2 text-xs font-body font-medium text-foreground hover:text-accent-soft transition-colors duration-200 py-1"
                            >
                              <Github className="w-4 h-4 opacity-70 group-hover/link:opacity-100 transition-opacity" />
                              <span>View Repository</span>
                              <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all duration-200" />
                            </a>
                          </div>
                        </div>

                        {/* Visual Column */}
                        <div
                          className={`lg:col-span-7 ${
                            isVisualRight ? "order-1 lg:order-2" : "order-1 lg:order-1"
                          }`}
                        >
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block relative rounded-2xl border border-border bg-[var(--surface-glass)] overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.65)] hover:border-accent/40 transition-all duration-300 group/img"
                          >
                            <div className="absolute top-0 right-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none -z-10" />

                            <div className="relative aspect-[16/10] w-full overflow-hidden">
                              <Image
                                src={project.image}
                                alt={project.title}
                                fill
                                loading="lazy"
                                sizes="(max-width: 1024px) 100vw, 55vw"
                                className="object-cover object-top transition-transform duration-500 ease-out group-hover/img:scale-[1.03]"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)]/70 via-transparent to-transparent pointer-events-none" />
                            </div>
                          </a>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 4. View All Projects CTA */}
        <div className="flex justify-center pt-14 md:pt-20">
          <button
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
            className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-xl border border-border bg-[var(--surface-soft)] hover:border-accent/70 hover:bg-[var(--surface-elevated)] hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] text-xs sm:text-[13px] font-body font-medium text-foreground transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.6)] cursor-pointer"
          >
            <span>{showAll ? "Show Less" : "View All Projects"}</span>
            <ChevronDown
              className={`w-4 h-4 text-accent-soft transition-transform duration-300 ${
                showAll ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>
    </section>
  );
}
