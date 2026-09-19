"use client";

import { motion } from "framer-motion";
import { ArrowDownToLine, ArrowUpRight, MapPin, Mail } from "lucide-react";
import { Github, Linkedin, Instagram } from "@/components/icons";

// Module scope — never recreated on re-render
const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

const SOCIAL_LINKS = [
  { icon: <Github className="w-4 h-4" />, url: "https://github.com/aniiiket08", label: "GitHub" },
  { icon: <Linkedin className="w-4 h-4" />, url: "https://www.linkedin.com/in/aniket0804/", label: "LinkedIn" },
  { icon: <Instagram className="w-4 h-4" />, url: "https://www.instagram.com/aniiiket08/", label: "Instagram" },
];

export default function Contact() {
  return (
    <motion.section
      id="contact"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="section-rule pt-24 pb-20 md:pt-36 md:pb-28 border-t border-border/40 relative overflow-hidden"
    >
      <div className="relative section-container z-10">
        {/* Top Eyebrow */}
        <div className="flex items-center gap-3 font-eyebrow mb-8">
          <span className="h-px w-8 bg-accent-soft" />
          <span className="josefin-sans-2">CONTACT &amp; COLLABORATION</span>
        </div>

        {/* Headline */}
        <div className="mb-10 md:mb-14">
          <h2 className="font-heading font-bold text-[clamp(2.25rem,5vw,4.25rem)] leading-[1.05] tracking-tight text-foreground max-w-[900px]">
            Let&apos;s Build Something.
          </h2>
          <p className="josefin-sans-1 text-subheading mt-4 max-w-[640px] text-base sm:text-lg">
            Open for research collaborations, engineering opportunities, and ambitious technical projects.
          </p>
        </div>

        {/* Contact grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 pt-10 border-t border-border/40">
          {/* Primary Column */}
          <div className="lg:col-span-8 flex flex-col items-start gap-5">
            <span className="josefin-sans-2 font-label text-accent-soft tracking-[0.2em]">
              DIRECT INQUIRIES
            </span>
            <div className="flex flex-col gap-4">
              <a
                href="mailto:iamaniketpatil08@gmail.com"
                className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-foreground hover:text-accent-soft transition-colors duration-200 tracking-tight break-all"
              >
                iamaniketpatil08@gmail.com
              </a>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="mailto:iamaniketpatil08@gmail.com"
                  className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl border border-border-strong bg-transparent text-foreground hover:border-accent hover:text-accent-soft hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all duration-200 font-medium text-sm"
                >
                  <Mail className="w-4 h-4 text-accent-soft" />
                  <span>Send an email</span>
                  <ArrowUpRight className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
                </a>
                <a
                  href="/resume/Resume_Aniket.pdf"
                  download
                  className="group inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-sm font-medium rounded-xl border border-border-strong bg-transparent text-foreground hover:border-accent hover:text-accent-soft hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all duration-200"
                >
                  <span>Download Resume</span>
                  <ArrowDownToLine className="w-4 h-4 opacity-70 group-hover:translate-y-0.5 group-hover:opacity-100 transition-all duration-200" />
                </a>
              </div>
            </div>
          </div>

          {/* Secondary Column */}
          <div className="lg:col-span-4 flex flex-col justify-start gap-2 lg:pl-6 lg:border-l lg:border-border/30">
            <span className="josefin-sans-2 font-label text-muted/70 tracking-[0.2em]">
              LOCATION / BASE
            </span>
            <div className="flex items-center gap-2 text-foreground/90 text-xl font-body font-normal">
              <MapPin className="w-4 h-4 text-accent-soft/80 flex-shrink-0" />
              <span className="josefin-sans-1">Belagavi, Karnataka, India</span>
            </div>
            <p className="josefin-sans-1 text-sm text-muted font-body font-light mt-1">
              Available for remote engagements and on-site roles worldwide.
            </p>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-14 pt-8 border-t border-border/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="josefin-sans-2 font-label text-muted/80 tracking-[0.2em]">
              NETWORK &amp; PROFILES
            </span>
            <div className="flex items-center gap-2.5">
              {SOCIAL_LINKS.map((social, idx) => (
                <motion.a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.45, delay: 0.08 + idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                  className="p-2.5 rounded-xl border border-border bg-[var(--surface-soft)] text-muted hover:text-accent-soft hover:border-accent/60 transition-all duration-200"
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
