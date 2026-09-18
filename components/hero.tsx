"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import WarpText from "./WarpText";

const Lanyard = dynamic(() => import("./Lanyard"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[520px] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-accent/40 border-t-accent animate-spin" />
    </div>
  ),
});

export default function Hero() {
  const [loadLanyard, setLoadLanyard] = useState(false);

  useEffect(() => {
    let timeoutId: number | undefined;
    let idleCallbackId: number | undefined;
    const load = () => setLoadLanyard(true);

    if (typeof window.requestIdleCallback === "function") {
      idleCallbackId = window.requestIdleCallback(load, { timeout: 120 });
    } else {
      timeoutId = window.setTimeout(load, 60);
    }

    return () => {
      if (idleCallbackId !== undefined) window.cancelIdleCallback(idleCallbackId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <section
      id="hero"
      className="relative overflow-visible pt-36 sm:pt-44 md:pt-48 lg:pt-52 pb-16 md:pb-28"
    >
      <div className="relative max-w-[1120px] mx-auto px-6 z-10">
        {/* Asymmetric Hero Header Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center mb-16 md:mb-24">
          {/* Left Column: Typography Hierarchy */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col items-start"
          >
            {/* 1. Restrained Uppercase Availability Badge */}
            <div className="mb-5">
              <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-md border border-border/80 bg-[var(--surface-soft)] backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="josefin-sans-2 text-[10px] font-eyebrow uppercase tracking-[0.22em] text-foreground">
                  AVAILABLE
                </span>
                <span className="h-2.5 w-px bg-border/80" />
                <span className="josefin-sans-1 text-xs font-body text-muted font-normal tracking-normal whitespace-nowrap">
                  For Research &amp; Project Work
                </span>
              </div>
            </div>

            {/* 2. Primary Display Name: Aniket Patil */}
            <div className="w-full">
              <WarpText
                text="Aniket Patil"
                color="#EDE8F6"
                fontSize="clamp(3.5rem, 8.5vw, 7.2rem)"
                fontWeight={700}
                fontFamily="var(--font-heading), 'Libre Baskerville', Georgia, serif"
                letterSpacing="-0.035em"
                lineHeight={0.92}
                align="left"
                warpStrength={0.04}
                warpScale={1.6}
                speed={0.3}
                pointerInfluence={0}
                pointerStrength={0}
                refraction={0.01}
                ripple={false}
                className="min-h-[96px] sm:min-h-[120px] md:min-h-[148px] lg:min-h-[175px]"
              />
            </div>

            {/* 3. Small uppercase descriptor with generous letter spacing */}
            <div className="flex items-center gap-3 text-[11px] font-eyebrow uppercase tracking-[0.22em] text-accent-soft mt-4">
              <span className="h-px w-8 bg-accent-soft" />
              <span className="josefin-sans-2">RESEARCHER / INTELLIGENT SYSTEMS / COMPUTATIONAL BUILDER</span>
            </div>

            {/* 4. Refined editorial summary */}
            <p className="josefin-sans-1 text-base sm:text-[1.0625rem] text-[var(--foreground-soft)] font-body font-light max-w-lg leading-relaxed mt-6">
              Computer Science (Artificial Intelligence) undergraduate at KLE Technological University, working across machine learning, RF/SDR, embedded systems, and computational biology through applied research and projects.
            </p>

            {/* 5. Minimal Ghost/Outline Action Buttons */}
            <div className="flex items-center gap-3.5 pt-8 flex-wrap">
              <motion.a
                href="#contact"
                whileHover={{ y: -1 }}
                whileTap={{ y: 0 }}
                transition={{ duration: 0.2 }}
                className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-accent/50 bg-transparent text-foreground font-medium text-sm hover:border-accent hover:text-accent-soft hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all duration-200"
              >
                <span>Get in touch</span>
                <ArrowUpRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
              </motion.a>

              <motion.a
                href="#projects"
                whileHover={{ y: -1 }}
                whileTap={{ y: 0 }}
                transition={{ duration: 0.2 }}
                className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-[var(--surface-soft)] backdrop-blur-sm text-foreground/90 font-medium text-sm hover:border-border-strong hover:text-foreground hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all duration-200"
              >
                <span>Explore research</span>
                <ArrowDown className="w-3.5 h-3.5 opacity-60 group-hover:translate-y-0.5 transition-all duration-200" />
              </motion.a>
            </div>
          </motion.div>

          {/* Right Column: React Bits 3D Lanyard Component */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="lg:col-span-5 flex justify-center items-start relative"
            style={{ zIndex: 10, overflow: "visible" }}
          >
            {/* Soft Ambient Glow BEHIND the 3D Lanyard */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center"
            >
              <div
                className="w-72 h-72 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(113,134,154,0.08) 0%, transparent 70%)",
                  filter: "blur(48px)",
                }}
              />
            </div>

            {/* Lanyard container - canvas fills the right column, band anchor maps
              to above the visible area, card hangs naturally in the mid section */}
            <div
              className="w-full flex items-start justify-center"
              style={{
                height: "760px",
                marginTop: "-5rem",
                paddingTop: 0,
              }}
            >
              {loadLanyard ? (
                <Lanyard
                  position={[0, 0, 22]}
                  gravity={[0, -40, 0]}
                  fov={20}
                  frontImage="/profile-picture/aniket-card-front.png"
                  backImage="/profile-picture/aniket-card-back.png"
                  imageFit="cover"
                  lanyardWidth={1.35}
                  cardScale={4.2}
                />
              ) : (
                <div className="w-full h-[520px] flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border-2 border-accent/40 border-t-accent animate-spin" />
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Major Section Editorial Statement */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[1050px] mt-12 md:mt-20 pt-12 border-t border-border/30"
        >
          <WarpText
            text={"BUILDING SYSTEMS THAT CONNECT\nAI, HARDWARE, AND RESEARCH."}
            color="#EDE8F6"
            fontSize="clamp(2.1rem, 5.4vw, 4.4rem)"
            fontWeight={700}
            fontFamily="var(--font-heading), 'Libre Baskerville', Georgia, serif"
            letterSpacing="-0.02em"
            lineHeight={1.1}
            align="left"
            warpStrength={0.04}
            warpScale={1.6}
            speed={0.32}
            pointerInfluence={0}
            pointerStrength={0}
            refraction={0.01}
            ripple={false}
            className="min-h-[130px] sm:min-h-[150px] md:min-h-[180px]"
          />
        </motion.div>

        {/* Narrative & Focus Breakdown */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 max-w-[1050px] mt-8"
        >
          <div className="md:col-span-5 flex flex-col justify-start gap-4">
            <p className="josefin-sans-1 text-base sm:text-lg font-body font-medium leading-relaxed text-foreground border-l-2 border-accent pl-4 py-1">
              Building end-to-end systems across machine learning, embedded systems, and computational research.
            </p>
            <div className="pl-4 text-[11px] sm:text-xs font-body font-light leading-snug text-muted">
              <h3 className="josefin-sans-2 text-[10px] uppercase tracking-[0.16em] text-accent-soft mb-1.5">
                Key Focus Areas
              </h3>
              <ul className="josefin-sans-1 list-none pl-0 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 whitespace-nowrap text-left text-[11px] sm:text-xs text-foreground/75">
                <li className="flex items-center justify-start gap-2"><span className="font-bold text-accent-soft">-</span><span>Machine Learning &amp; Deep Learning</span></li>
                <li className="flex items-center justify-start gap-2"><span className="font-bold text-accent-soft sm:translate-x-1">-</span><span>Software &amp; Backend Development</span></li>
                <li className="flex items-center justify-start gap-2"><span className="font-bold text-accent-soft">-</span><span>Embedded Systems, IoT &amp; Hardware</span></li>
                <li className="flex items-center justify-start gap-2"><span className="font-bold text-accent-soft sm:translate-x-1">-</span><span>RF / SDR &amp; Signal Processing</span></li>
                <li className="flex items-center justify-start gap-2"><span className="font-bold text-accent-soft">-</span><span>Computer Vision &amp; Medical Imaging</span></li>
                <li className="flex items-center justify-start gap-2"><span className="font-bold text-accent-soft sm:translate-x-1">-</span><span>Computational Biology</span></li>
              </ul>
            </div>
          </div>

          <div className="md:col-span-7 flex flex-col gap-4 text-muted font-body font-light text-sm sm:text-base leading-relaxed">
            <p className="josefin-sans-1">
              My work ranges from Wi-Fi RSSI fingerprinting for indoor localization to multi-scale digital twin simulations, machine learning, and edge-optimized medical imaging pipelines.
            </p>
            <p className="josefin-sans-1">
              Whether training neural models on RF signals, developing ML systems, building backend applications, working with embedded hardware, analyzing medical images, or simulating biological systems with VCell, I focus on taking ideas from research to complete, reliable systems that work in the real world.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
