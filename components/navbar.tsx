"use client";

import { useEffect, useState } from "react";
import { Linkedin } from "@/components/icons";
import { ArrowDownToLine } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { id: "hero", label: "Home" },
  { id: "tech", label: "Stack" },
  { id: "projects", label: "Projects" },
  { id: "beyond", label: "Experience" },
  { id: "certificates", label: "Certificates" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("hero");

  // ScrollSpy to track active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (let i = navItems.length - 1; i >= 0; i--) {
        const item = navItems[i];
        if (item.id === "hero") {
          if (window.scrollY < 300) {
            setActiveSection("hero");
            break;
          }
        } else {
          const el = document.getElementById(item.id);
          if (el && el.offsetTop <= scrollPosition) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (id === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const el = document.getElementById(id);
      if (el) {
        const yOffset = -90;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
    setActiveSection(id);
  };

  return (
    <header className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-[920px]">
      <nav
        aria-label="Main navigation"
        className="flex items-center justify-between px-3 sm:px-5 py-2 rounded-2xl bg-[#080808]/85 backdrop-blur-md border border-[#292929] shadow-[0_12px_40px_rgba(0,0,0,0.7)]"
      >
        {/* Left: Stylized Wordmark */}
        <a
          href="#"
          onClick={(e) => scrollToSection(e, "hero")}
          className="font-heading font-bold text-sm sm:text-base tracking-tight text-foreground hover:text-accent-soft transition-colors pl-2 sm:pl-3 flex items-center gap-2 group"
        >
          <span>Aniket Patil</span>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_2px_rgba(74,222,128,0.7)] opacity-90 group-hover:scale-125 transition-transform" />
        </a>

        {/* Center: Nav links in refined container */}
        <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-none py-0.5 px-1 max-w-[55vw] sm:max-w-none">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => scrollToSection(e, item.id)}
                className={`relative px-2.5 sm:px-3.5 py-1 text-xs sm:text-sm font-body font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? "text-foreground font-semibold"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeNavPill"
                    className="absolute inset-0 rounded-lg bg-accent/15 border border-accent/30"
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </a>
            );
          })}
        </div>

        {/* Right: Header prioritized actions: LinkedIn + Download Resume */}
        <div className="hidden md:flex items-center gap-2.5 pr-1">
          <a
            href="https://www.linkedin.com/in/aniket0804/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-accent-soft p-1.5 rounded-lg border border-transparent hover:border-border hover:bg-white/[0.04] transition-all"
            aria-label="LinkedIn Profile"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href="/resume/Resume_Aniket.pdf"
            download
            className="group inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg border border-border-strong bg-transparent text-foreground hover:border-accent hover:text-accent-soft transition-all duration-200"
          >
            <span>Download Resume</span>
            <ArrowDownToLine className="w-3.5 h-3.5 opacity-70 group-hover:translate-y-0.5 group-hover:opacity-100 transition-all duration-200" />
          </a>
        </div>
      </nav>
    </header>
  );
}
