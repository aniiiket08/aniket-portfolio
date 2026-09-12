"use client";

import { Mail } from "lucide-react";
import { Github, Linkedin, Instagram } from "@/components/icons";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-auto border-t border-white/[0.08] bg-black/40 backdrop-blur-sm py-14 md:py-16">
      <div className="max-w-[800px] mx-auto px-6 flex flex-col items-center justify-center text-center space-y-6">
        {/* 1. Name / Brand */}
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground font-heading">
          Aniket Patil
        </h2>

        {/* 2. Navigation Row */}
        <nav className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-[11px] font-mono tracking-[0.2em] uppercase text-muted/70">
          <a
            href="#hero"
            className="hover:text-foreground transition-colors"
          >
            HOME
          </a>
          <a
            href="#tech"
            className="hover:text-foreground transition-colors"
          >
            TECH STACK
          </a>
          <a
            href="#projects"
            className="hover:text-foreground transition-colors"
          >
            PROJECTS
          </a>
          <a
            href="#certificates"
            className="hover:text-foreground transition-colors"
          >
            CERTIFICATES
          </a>
          <a
            href="#contact"
            className="hover:text-foreground transition-colors"
          >
            CONTACT
          </a>
        </nav>

        {/* 3. Circular Social Icons */}
        <div className="flex items-center justify-center gap-3 pt-1">
          <a
            href="https://github.com/aniiiket08"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-muted/70 hover:text-foreground hover:border-white/40 hover:bg-white/[0.05] transition-all duration-200"
            aria-label="GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href="https://www.linkedin.com/in/aniket0804/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-muted/70 hover:text-foreground hover:border-white/40 hover:bg-white/[0.05] transition-all duration-200"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href="https://www.instagram.com/aniiiket08/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-muted/70 hover:text-foreground hover:border-white/40 hover:bg-white/[0.05] transition-all duration-200"
            aria-label="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href="mailto:iamaniketpatil08@gmail.com"
            className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-muted/70 hover:text-foreground hover:border-white/40 hover:bg-white/[0.05] transition-all duration-200"
            aria-label="Email"
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>

        {/* 4. Subtle Minimal Copyright */}
        <p className="text-[11px] text-muted/40 font-mono tracking-wider pt-2">
          &copy; {currentYear} Aniket Patil
        </p>
      </div>
    </footer>
  );
}
