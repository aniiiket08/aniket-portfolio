"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";

const PdfCanvas = dynamic(() => import("./pdf-canvas"), { ssr: false });

export interface CertificateItem {
  id: string;
  fileName: string;
  fileUrl: string;
  type: "image" | "pdf";
  title: string;
  issuer: string;
}

interface CertificatesCarouselProps {
  certificates: CertificateItem[];
}

// ── Category metadata ─────────────────────────────────────────────────────────
type Category = "ai-ml" | "cloud" | "security" | "networking" | "data" | "devops" | "web" | "health" | "achievement";

const CATEGORY_META: Record<Category, { label: string; color: string }> = {
  "ai-ml":       { label: "AI & Machine Learning", color: "var(--accent-soft)" },
  "cloud":       { label: "Cloud Computing",        color: "#8FAABC" },
  "security":    { label: "Cybersecurity",          color: "#A5B5C2" },
  "networking":  { label: "Networking",             color: "#96A8B4" },
  "data":        { label: "Data Analytics",         color: "#A0B2BE" },
  "devops":      { label: "DevOps",                 color: "#8FA6B6" },
  "web":         { label: "Web Development",        color: "#9AAEBB" },
  "health":      { label: "Digital Health",         color: "#A2B4C0" },
  "achievement": { label: "Achievement",            color: "#B0BEC9" },
};

// Map each cert fileName → category
const CERT_CATEGORY: Record<string, Category> = {
  "Oracle Agentic AI Certified Foundations Associate.pdf": "ai-ml",
  "Cisco Introduction to Cybersecurity.pdf":              "security",
  "Google Cloud Data Analytics.pdf":                      "cloud",
  "HPE Juniper - JUNOS Associate.pdf":                    "networking",
  "Google Introduction to Large Language Models.pdf":     "ai-ml",
  "Microsoft Introduction to the Basics of Azure Services.pdf": "cloud",
  "NPTEL Introduction to Machine Learning.pdf":           "ai-ml",
  "HackerRank Software_Engineer_Intern.pdf":              "achievement",
  "HackerRank  SQL_Basic.pdf":                            "data",
  "HackerRank Python_Basic.pdf":                          "achievement",
  "Forage TATA GenAI Powered Data Analytics.pdf":         "data",
  "Infosys DEVOPS.pdf":                                   "devops",
  "Infosys JENKIN.pdf":                                   "devops",
  "Forage Deloitte Australia Data Analytics.pdf":         "data",
  "NABH Certificate.pdf":                                 "health",
  "PrepInsta CN.pdf":                                     "networking",
  "PrepInsta HTML.pdf":                                   "web",
};

// ── Lightweight inline SVG icons per category ─────────────────────────────────
function CategoryIcon({ category, color }: { category: Category; color: string }) {
  const style = { width: 16, height: 16, flexShrink: 0 } as const;
  switch (category) {
    case "ai-ml":
      return (
        // Neural network: 5 nodes with weighted connections → AI / ML
        <svg viewBox="0 0 16 16" fill="none" style={style} aria-hidden="true">
          {/* input layer */}
          <circle cx="2.5" cy="5"  r="1.2" stroke={color} strokeWidth="1.1" />
          <circle cx="2.5" cy="11" r="1.2" stroke={color} strokeWidth="1.1" />
          {/* hidden node */}
          <circle cx="8"   cy="8"  r="1.4" stroke={color} strokeWidth="1.1" />
          {/* output layer */}
          <circle cx="13.5" cy="5"  r="1.2" stroke={color} strokeWidth="1.1" />
          <circle cx="13.5" cy="11" r="1.2" stroke={color} strokeWidth="1.1" />
          {/* edges */}
          <path d="M3.7 5.4 L6.6 7.4M3.7 10.6 L6.6 8.6M9.4 7.4 L12.3 5.4M9.4 8.6 L12.3 10.6" stroke={color} strokeWidth="0.9" strokeLinecap="round" opacity="0.7" />
        </svg>
      );
    case "cloud":
      return (
        // Cloud + upload arrow → cloud computing / provisioning
        <svg viewBox="0 0 16 16" fill="none" style={style} aria-hidden="true">
          <path d="M11.5 9.5a2.2 2.2 0 0 0 0-4.4 2.2 2.2 0 0 0-4.3-.7A1.8 1.8 0 1 0 5.2 8" stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M8 14V9.5M8 9.5L6 11.5M8 9.5L10 11.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "security":
      return (
        // Padlock with keyhole → cybersecurity
        <svg viewBox="0 0 16 16" fill="none" style={style} aria-hidden="true">
          <rect x="3.5" y="7" width="9" height="7" rx="1.5" stroke={color} strokeWidth="1.2" />
          <path d="M5.5 7V5.5a2.5 2.5 0 0 1 5 0V7" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="8" cy="10" r="1.1" stroke={color} strokeWidth="1.1" />
          <path d="M8 11.1v1.4" stroke={color} strokeWidth="1.1" strokeLinecap="round" />
        </svg>
      );
    case "networking":
      return (
        // Router box + wifi signal arcs → networking
        <svg viewBox="0 0 16 16" fill="none" style={style} aria-hidden="true">
          <rect x="3" y="8.5" width="10" height="5" rx="1.2" stroke={color} strokeWidth="1.2" />
          <circle cx="5.5" cy="11" r="0.7" fill={color} />
          <path d="M8 3.5a5 5 0 0 1 3.5 1.5M8 3.5a5 5 0 0 0-3.5 1.5" stroke={color} strokeWidth="1.1" strokeLinecap="round" opacity="0.5" />
          <path d="M8 5.5a2.8 2.8 0 0 1 1.9.9M8 5.5a2.8 2.8 0 0 0-1.9.9" stroke={color} strokeWidth="1.1" strokeLinecap="round" opacity="0.75" />
          <line x1="8" y1="7.5" x2="8" y2="8.5" stroke={color} strokeWidth="1.1" strokeLinecap="round" />
        </svg>
      );
    case "data":
      return (
        // Bar chart + rising trend line → data analytics
        <svg viewBox="0 0 16 16" fill="none" style={style} aria-hidden="true">
          <rect x="2"   y="10" width="2.5" height="4" rx="0.4" stroke={color} strokeWidth="1.1" />
          <rect x="6"   y="7"  width="2.5" height="7" rx="0.4" stroke={color} strokeWidth="1.1" />
          <rect x="10"  y="4"  width="2.5" height="10" rx="0.4" stroke={color} strokeWidth="1.1" />
          <path d="M2.5 9.5 L6.5 6.5 L10.5 3.5" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
          <circle cx="10.5" cy="3.5" r="1" fill={color} opacity="0.7" />
        </svg>
      );
    case "devops":
      return (
        // Infinity loop (∞) → the canonical DevOps symbol
        <svg viewBox="0 0 16 16" fill="none" style={style} aria-hidden="true">
          <path
            d="M6 8c-.8-1.6-2-2.5-3-2.5a2.5 2.5 0 0 0 0 5c1 0 2.2-.9 3-2.5Z"
            stroke={color} strokeWidth="1.2" strokeLinejoin="round"
          />
          <path
            d="M10 8c.8 1.6 2 2.5 3 2.5a2.5 2.5 0 0 0 0-5c-1 0-2.2.9-3 2.5Z"
            stroke={color} strokeWidth="1.2" strokeLinejoin="round"
          />
          <path d="M6 8 C7 6, 9 6, 10 8 C9 10, 7 10, 6 8Z" stroke={color} strokeWidth="1.2" />
        </svg>
      );
    case "web":
      return (
        // </> code brackets → web development
        <svg viewBox="0 0 16 16" fill="none" style={style} aria-hidden="true">
          <path d="M5.5 5L2 8l3.5 3" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10.5 5L14 8l-3.5 3" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9.5 3.5l-3 9" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
        </svg>
      );
    case "health":
      return (
        // Medical cross → digital health
        <svg viewBox="0 0 16 16" fill="none" style={style} aria-hidden="true">
          <rect x="6" y="2" width="4" height="12" rx="1" stroke={color} strokeWidth="1.2" />
          <rect x="2" y="6" width="12" height="4" rx="1" stroke={color} strokeWidth="1.2" />
        </svg>
      );
    case "achievement":
    default:
      return (
        // Ribbon medal → achievement / skill badge
        <svg viewBox="0 0 16 16" fill="none" style={style} aria-hidden="true">
          <circle cx="8" cy="6.5" r="3.5" stroke={color} strokeWidth="1.2" />
          <path d="M5.5 9.5L4 14l4-2 4 2-1.5-4.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}

// ── Card component ────────────────────────────────────────────────────────────
function CertCard({
  cert,
  index,
  onClick,
}: {
  cert: CertificateItem;
  index: number;
  onClick: () => void;
}) {
  const category: Category = CERT_CATEGORY[cert.fileName] ?? "achievement";
  const meta = CATEGORY_META[category];
  const certNumber = String(index + 1).padStart(2, "0");

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(); }}
      aria-label={`View ${cert.title} by ${cert.issuer}`}
      className="group flex-shrink-0 w-[250px] sm:w-[295px] lg:w-[315px] flex flex-col rounded-xl border border-[var(--border)] bg-[var(--surface-glass)] cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors duration-200 hover:border-[var(--accent)]/50"
      style={{ minHeight: 172 }}
    >
      {/* Card body */}
      <div className="flex flex-col flex-1 p-5 gap-0">

        {/* Top row: category icon + label + cert number */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CategoryIcon category={category} color={meta.color} />
            <span
              className="space-grotesk-2 text-[10px] uppercase tracking-[0.2em]"
              style={{ color: meta.color, opacity: 0.8 }}
            >
              {meta.label}
            </span>
          </div>
          <span
            className="space-grotesk-2 text-[11px] tabular-nums"
            style={{ color: "var(--muted)", opacity: 0.35 }}
          >
            {certNumber}
          </span>
        </div>

        {/* Certificate title */}
        <h3
          className="font-heading font-bold leading-snug text-[0.95rem] sm:text-[1rem] text-foreground line-clamp-3 mb-2 tracking-[-0.01em] transition-colors duration-200 group-hover:text-[var(--accent-soft)]"
        >
          {cert.title}
        </h3>

        {/* Issuer */}
        <p
          className="space-grotesk-2 text-[11px] uppercase tracking-[0.18em] mb-0"
          style={{ color: "var(--muted)", opacity: 0.6 }}
        >
          {cert.issuer}
        </p>

        {/* Bottom divider + link */}
        <div
          className="mt-auto pt-4 border-t flex items-center justify-between"
          style={{ borderColor: "var(--border)" }}
        >
          <span
            className="space-grotesk-2 text-[11px] uppercase tracking-[0.18em] flex items-center gap-1 transition-colors duration-200"
            style={{ color: "var(--muted)", opacity: 0.55 }}
          >
            View credential
            <svg viewBox="0 0 10 10" fill="none" width={10} height={10} aria-hidden="true" style={{ opacity: 0.7 }}>
              <path d="M2 8L8 2M8 2H4M8 2v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>

      </div>
    </div>
  );
}

// ── Main carousel ─────────────────────────────────────────────────────────────
export default function CertificatesCarousel({ certificates }: CertificatesCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const groupWidthRef = useRef<number>(0);
  const scrollPosRef = useRef<number>(0);

  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ startX: number; scrollLeft: number } | null>(null);

  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);
  const [isHoverPaused, setIsHoverPaused] = useState(false);
  const [isInteractionPaused, setIsInteractionPaused] = useState(false);
  const [inView, setInView] = useState(false);

  const measureGroupWidth = useCallback(() => {
    if (trackRef.current && trackRef.current.children.length > 0) {
      const firstGroup = trackRef.current.children[0] as HTMLElement;
      if (firstGroup) {
        const width = firstGroup.offsetWidth;
        if (width > 0) {
          groupWidthRef.current = width;
          if (scrollContainerRef.current && scrollContainerRef.current.scrollLeft === 0) {
            scrollContainerRef.current.scrollLeft = width;
            scrollPosRef.current = width;
          }
        }
      }
    }
  }, []);

  useEffect(() => {
    measureGroupWidth();
    const handleResize = () => measureGroupWidth();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [measureGroupWidth, certificates]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    let rafId: number;
    let lastTime = performance.now();
    const loop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;
      const gw = groupWidthRef.current;
      if (gw > 0 && !isHoverPaused && !isInteractionPaused && !selectedCert && inView) {
        scrollPosRef.current += 38 * dt;
        if (scrollPosRef.current >= 2 * gw) scrollPosRef.current -= gw;
        else if (scrollPosRef.current <= 50) scrollPosRef.current += gw;
        container.scrollLeft = scrollPosRef.current;
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [isHoverPaused, isInteractionPaused, selectedCert, inView]);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container || groupWidthRef.current <= 0) return;
    const gw = groupWidthRef.current;
    scrollPosRef.current = container.scrollLeft;
    if (container.scrollLeft >= 2 * gw) {
      container.scrollLeft -= gw;
      scrollPosRef.current = container.scrollLeft;
    } else if (container.scrollLeft <= 50) {
      container.scrollLeft += gw;
      scrollPosRef.current = container.scrollLeft;
    }
  };

  const openCertificate = (cert: CertificateItem) => setSelectedCert(cert);

  const pauseForInteraction = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    setIsInteractionPaused(true);
  };

  const resumeAfterInteraction = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => setIsInteractionPaused(false), 1400);
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) || !scrollContainerRef.current) return;
    event.preventDefault();
    pauseForInteraction();
    scrollContainerRef.current.scrollLeft += event.deltaX;
    scrollPosRef.current = scrollContainerRef.current.scrollLeft;
    resumeAfterInteraction();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0 || !scrollContainerRef.current) return;
    dragStartRef.current = { startX: e.clientX, scrollLeft: scrollContainerRef.current.scrollLeft };
    isDraggingRef.current = false;
    pauseForInteraction();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragStartRef.current || !scrollContainerRef.current) return;
    const dx = e.clientX - dragStartRef.current.startX;
    if (Math.abs(dx) > 6) isDraggingRef.current = true;
    if (isDraggingRef.current) {
      scrollContainerRef.current.scrollLeft = dragStartRef.current.scrollLeft - dx;
      scrollPosRef.current = scrollContainerRef.current.scrollLeft;
    }
  };

  const handleMouseUp = () => {
    dragStartRef.current = null;
    resumeAfterInteraction();
    window.setTimeout(() => { isDraggingRef.current = false; }, 80);
  };

  const handleScrollNav = (direction: "left" | "right") => {
    const viewport = scrollContainerRef.current;
    if (!viewport) return;
    pauseForInteraction();
    viewport.scrollBy({ left: direction === "left" ? -340 : 340, behavior: "smooth" });
    resumeAfterInteraction();
  };

  useEffect(() => {
    if (selectedCert) {
      document.body.style.overflow = "hidden";
      const frame = requestAnimationFrame(() => closeButtonRef.current?.focus());
      return () => { cancelAnimationFrame(frame); document.body.style.overflow = "unset"; };
    }
    document.body.style.overflow = "unset";
    return undefined;
  }, [selectedCert]);

  const handleModalKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") { event.preventDefault(); setSelectedCert(null); }
  };

  const carouselGroups = useMemo(() => {
    const renderGroup = (copy: number) => (
      <div className="certificates-marquee-group" aria-hidden={copy > 0} key={copy}>
        {certificates.map((cert, idx) => (
          <CertCard
            key={`${copy}-${cert.id || idx}`}
            cert={cert}
            index={idx}
            onClick={() => { if (!isDraggingRef.current) openCertificate(cert); }}
          />
        ))}
      </div>
    );
    return [renderGroup(0), renderGroup(1), renderGroup(2)];
  }, [certificates]);

  return (
    <div className="relative w-full">
      {/* Top Controls */}
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-accent-soft" />
          <span className="space-grotesk-2 uppercase tracking-[0.2em] text-xs text-muted-foreground">
            {certificates.length} Certificates
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleScrollNav("left")}
            aria-label="Previous certificate"
            className="p-2 rounded-lg border border-border bg-[var(--surface-soft)] text-muted hover:text-foreground hover:border-accent transition-all duration-200 cursor-pointer backdrop-blur-md"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleScrollNav("right")}
            aria-label="Next certificate"
            className="p-2 rounded-lg border border-border bg-[var(--surface-soft)] text-muted hover:text-foreground hover:border-accent transition-all duration-200 cursor-pointer backdrop-blur-md"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="certificates-marquee-viewport relative overflow-x-auto overflow-y-hidden scrollbar-none [mask-image:linear-gradient(to_right,transparent_0%,black_1.5rem,black_calc(100%-1.5rem),transparent_100%)] sm:[mask-image:linear-gradient(to_right,transparent_0%,black_2.5rem,black_calc(100%-2.5rem),transparent_100%)]"
        onMouseEnter={() => setIsHoverPaused(true)}
        onMouseLeave={() => setIsHoverPaused(false)}
        onFocus={() => setIsHoverPaused(true)}
        onBlur={() => setIsHoverPaused(false)}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={pauseForInteraction}
        onTouchEnd={resumeAfterInteraction}
        style={{ touchAction: "pan-y" }}
      >
        <div ref={trackRef} className="certificates-marquee-track select-none pb-6 pt-2">
          {carouselGroups}
        </div>
      </div>

      {/* Modal — unchanged */}
      {selectedCert && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="certificate-dialog-title"
          onKeyDown={handleModalKeyDown}
          onClick={() => setSelectedCert(null)}
        >
          <div
            ref={modalRef}
            className="relative flex max-h-[92vh] w-full max-w-4xl flex-col items-center bg-[#080808] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between border-b border-white/10 px-4 py-3 bg-white/[0.02] pr-14 text-left sm:px-6">
              <div>
                <span className="space-grotesk-2 text-xs uppercase tracking-[0.2em] text-accent-soft">
                  {selectedCert.issuer}
                </span>
                <h2
                  id="certificate-dialog-title"
                  className="space-grotesk-2 mt-0.5 text-base sm:text-lg font-bold text-foreground"
                >
                  {selectedCert.title}
                </h2>
              </div>
            </div>
            <button
              type="button"
              ref={closeButtonRef}
              onClick={() => setSelectedCert(null)}
              aria-label="Close certificate"
              className="absolute right-3.5 top-3.5 z-10 rounded-lg border border-white/20 bg-black/60 p-2 text-white shadow-lg transition-colors hover:border-accent hover:bg-white/[0.1] cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="w-full overflow-auto max-h-[82vh] p-2 flex items-center justify-center">
              {selectedCert.type === "image" ? (
                <Image
                  src={selectedCert.fileUrl}
                  alt={selectedCert.title}
                  width={1600}
                  height={2200}
                  className="max-h-[80vh] w-auto max-w-full object-contain"
                  sizes="100vw"
                  priority
                />
              ) : (
                <PdfCanvas
                  src={selectedCert.fileUrl}
                  className="max-h-[80vh] max-w-full object-contain"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
