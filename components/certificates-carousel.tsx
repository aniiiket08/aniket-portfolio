"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  ChevronLeft,
  ChevronRight,
  Award,
  X,
  ExternalLink,
  FileText,
} from "lucide-react";

const PdfCanvas = dynamic(() => import("./pdf-canvas"), {
  ssr: false,
});

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

export default function CertificatesCarousel({
  certificates,
}: CertificatesCarouselProps) {
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
  const [inView, setInView] = useState(true);

  // Measure group width and set initial scroll position to middle group
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

  // Pause off-screen rendering
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

  // Infinite Auto-Scroll RAF Loop
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let rafId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const gw = groupWidthRef.current;
      if (
        gw > 0 &&
        !isHoverPaused &&
        !isInteractionPaused &&
        !selectedCert &&
        inView
      ) {
        scrollPosRef.current += 38 * dt;

        // Infinite wrap check
        if (scrollPosRef.current >= 2 * gw) {
          scrollPosRef.current -= gw;
        } else if (scrollPosRef.current <= 50) {
          scrollPosRef.current += gw;
        }

        container.scrollLeft = scrollPosRef.current;
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [isHoverPaused, isInteractionPaused, selectedCert, inView]);

  // Wrap check on native scroll (touch, wheel, etc.)
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

  const openCertificate = (cert: CertificateItem) => {
    setSelectedCert(cert);
  };

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

  // Mouse drag handlers that don't block clicks
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0 || !scrollContainerRef.current) return;
    dragStartRef.current = {
      startX: e.clientX,
      scrollLeft: scrollContainerRef.current.scrollLeft,
    };
    isDraggingRef.current = false;
    pauseForInteraction();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragStartRef.current || !scrollContainerRef.current) return;
    const dx = e.clientX - dragStartRef.current.startX;
    if (Math.abs(dx) > 6) {
      isDraggingRef.current = true;
    }
    if (isDraggingRef.current) {
      scrollContainerRef.current.scrollLeft = dragStartRef.current.scrollLeft - dx;
      scrollPosRef.current = scrollContainerRef.current.scrollLeft;
    }
  };

  const handleMouseUp = () => {
    dragStartRef.current = null;
    resumeAfterInteraction();
    window.setTimeout(() => {
      isDraggingRef.current = false;
    }, 80);
  };

  const handleScrollNav = (direction: "left" | "right") => {
    const viewport = scrollContainerRef.current;
    if (!viewport) return;
    pauseForInteraction();
    const delta = direction === "left" ? -340 : 340;
    viewport.scrollBy({ left: delta, behavior: "smooth" });
    resumeAfterInteraction();
  };

  useEffect(() => {
    if (selectedCert) {
      document.body.style.overflow = "hidden";
      const frame = requestAnimationFrame(() => closeButtonRef.current?.focus());
      return () => {
        cancelAnimationFrame(frame);
        document.body.style.overflow = "unset";
      };
    }

    document.body.style.overflow = "unset";
    return undefined;
  }, [selectedCert]);

  const handleModalKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setSelectedCert(null);
    }
  };

  const renderCertificateGroup = (copy: number) => (
    <div className="certificates-marquee-group" aria-hidden={copy > 0} key={copy}>
      {certificates.map((cert, idx) => (
        <div
          key={`${copy}-${cert.id || idx}`}
          onClick={() => {
            if (!isDraggingRef.current) {
              openCertificate(cert);
            }
          }}
          className="group flex-shrink-0 w-[250px] sm:w-[295px] lg:w-[315px] flex flex-col rounded-2xl surface-glass certificate-card-glow transition-all duration-300 overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent select-none"
        >
          {/* Thumbnail Preview without overlaid badge */}
          <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border/40 bg-black/40 flex items-center justify-center p-4">
            {cert.type === "image" ? (
              <>
                <Image
                  src={cert.fileUrl}
                  alt={cert.title}
                  fill
                  sizes="(max-width: 640px) 250px, (max-width: 1024px) 295px, 315px"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              </>
            ) : (
              <div className="relative h-full w-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.06] rounded-xl pointer-events-none">
                <div className="w-11 h-11 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center text-accent-soft mb-2 group-hover:scale-110 transition-transform">
                  <Award className="w-5 h-5 text-accent-soft" />
                </div>
                <span className="josefin-sans-2 text-xs font-semibold uppercase tracking-wider text-foreground/90 text-center line-clamp-1">
                  {cert.issuer}
                </span>
                <span className="josefin-sans-2 text-[10px] uppercase tracking-[0.2em] text-muted/70 mt-1 flex items-center gap-1">
                  <FileText className="w-3 h-3 text-accent-soft/70" />
                  Certificate · PDF
                </span>
              </div>
            )}
          </div>

          {/* Card Body - Styled with josefin-sans-2 */}
          <div className="flex flex-col flex-1 p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="josefin-sans-2 text-[11px] font-medium uppercase tracking-[0.2em] text-accent-soft truncate">
                {cert.issuer}
              </span>
            </div>

            <h3 className="josefin-sans-2 text-[15px] sm:text-base font-semibold text-foreground group-hover:text-accent-soft transition-colors duration-200 line-clamp-2 leading-snug mb-3">
              {cert.title}
            </h3>

            <div className="mt-auto pt-3 border-t border-border/40 flex items-center justify-between transition-colors">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/[0.12] bg-[var(--surface-soft)] text-xs josefin-sans-2 font-medium uppercase tracking-[0.16em] text-foreground/90 group-hover:text-foreground group-hover:border-accent-soft transition-colors cursor-pointer"
                onClick={(event) => {
                  event.stopPropagation();
                  openCertificate(cert);
                }}
              >
                <span>View Certificate</span>
                <ExternalLink className="w-3 h-3 text-accent-soft opacity-70 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative w-full">
      {/* Top Controls: Counter & Nav Buttons */}
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-accent-soft" />
          <span className="josefin-sans-2 uppercase tracking-[0.2em] text-xs text-muted-foreground">
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

      {/* Carousel Container with Edge Mask & Infinite Looping Track */}
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
        <div
          ref={trackRef}
          className="certificates-marquee-track select-none pb-6 pt-2"
        >
          {/* 3 seamless groups ensure the carousel loops infinitely without ever ending */}
          {renderCertificateGroup(0)}
          {renderCertificateGroup(1)}
          {renderCertificateGroup(2)}
        </div>
      </div>

      {/* Certificate Inspection Modal */}
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
            onClick={(event) => event.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between border-b border-white/10 px-4 py-3 bg-white/[0.02] pr-14 text-left sm:px-6">
              <div>
                <span className="josefin-sans-2 text-xs uppercase tracking-[0.2em] text-accent-soft">
                  {selectedCert.issuer}
                </span>
                <h2
                  id="certificate-dialog-title"
                  className="josefin-sans-2 mt-0.5 text-base sm:text-lg font-bold text-foreground"
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
