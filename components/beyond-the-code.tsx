"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Briefcase, Medal, FlaskConical, Users, Target, X, ExternalLink } from "lucide-react";
import dynamic from "next/dynamic";

const PdfCanvas = dynamic(() => import("./pdf-canvas"), {
  ssr: false,
});

// Module scope — never recreated on re-render
const sectionVariants = {
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

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.1 + i * 0.12,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const RESEARCH = [
  {
    icon: <FlaskConical className="w-5 h-5" />,
    role: "3D Wi-Fi Based Floor Localization System",
    period: "Jan 2026 - May 2026",
    description:
      "Research on indoor floor-level localization using Wi-Fi RSSI fingerprinting, USRP B210 SDR data, and a 1D CNN model. Published at the IEEE International Conference on Advanced Networks and Telecommunications (IEEE ICONAT) 2026.",
    certificate: {
      title: "ICONAT 2026 Presentation Certificate",
      issuer: "IEEE",
      fileUrl: "/certificates/ICONAT 2026 Presentation Certificate.pdf",
    },
  },
  {
    icon: <FlaskConical className="w-5 h-5" />,
    role: "Automated Prostate Cancer Detection from Histopathology Images",
    period: "Sep 2025 - Jan 2026",
    description:
      "Research using the SICAPv2 histopathology dataset with MobileNetV3 feature extraction and XGBoost classification for automated prostate cancer detection. Presented at the Singapore Global Conference on Networking, Signal Processing and Communications (SGCNSP) 2025, Singapore.",
    certificate: {
      title: "SGCNSP 2025 Presentation Certificate",
      issuer: "SGCNSP",
      fileUrl: "/certificates/SGCNSP 2025 Presentation Certificate.pdf",
    },
  },
];

const COCURRICULAR = [
  {
    icon: <Users className="w-5 h-5" />,
    role: "Treasurer, ARC Stack Tech Club - Event Organizer & Coordinator - HR & Literary Club",
    period: "2023 - Present",
    description:
      "Managed financing and fund allocation of Rs. 4,00,000+ across department clusters as Treasurer; led technical event planning and community engagement initiatives. Organized HR and Esports college events reaching 300+ students; contributed to literary activities and student engagement initiatives.",
  },
  {
    icon: <Target className="w-5 h-5" />,
    role: "NCC Sergeant & Contingent Leader - Belagavi Division",
    period: "2019 - 2021",
    description:
      "Represented Karnataka & Goa Directorate; attended All India Thal Sainik Camp (TSC), New Delhi - Top 10 All India Rank, 0.22 Cal Rifle Shooting (National Level). Participated in IDSSC; qualified for AIGVMSC national-level selection stages.",
  },
];

export default function BeyondTheCode() {
  const [selectedCert, setSelectedCert] = useState<{title: string, issuer: string, fileUrl: string} | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

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

  return (
    <motion.section
      id="beyond"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="section-rule py-16 md:py-24 border-t border-border/40"
    >
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="mb-12 md:mb-16">
          <h2 className="h-section text-[clamp(1.75rem,4vw,3rem)]">
            Beyond The Code
          </h2>
          <p className="josefin-sans-1 text-subheading mt-3 max-w-xl">
            Leadership, creative pursuits, and meaningful contributions alongside technical work.
          </p>
        </div>

        <div className="space-y-16">
          {/* SUB-SECTION: RESEARCH EXPERIENCE */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Briefcase className="w-4 h-4 text-accent" />
              <span className="josefin-sans-2 font-eyebrow">Research Experience</span>
              <div className="flex-1 h-px bg-border/60" />
            </div>

            <div className="relative">
              <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border/60 hidden sm:block" />
              <div className="flex flex-col gap-6">
                {RESEARCH.map((item, idx) => (
                  <motion.div
                    key={idx}
                    custom={idx}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="relative flex gap-5 sm:gap-6"
                  >
                    <div className="relative z-10 flex-shrink-0">
                      <div className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center bg-[var(--surface-elevated)] border border-border-strong text-accent">
                        {item.icon}
                      </div>
                      <div className="sm:hidden w-1.5 h-1.5 rounded-full bg-accent mt-2.5" />
                    </div>
                    <div className="flex-1 surface-glass surface-hover p-5 sm:p-6">
                      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2.5">
                        <div className="flex items-center flex-wrap gap-4 sm:gap-5">
                          <h3 className="h-card text-base sm:text-lg">{item.role}</h3>
                          {item.certificate && (
                            <button
                              type="button"
                              onClick={() => setSelectedCert(item.certificate)}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/20 bg-white/[0.03] text-[11px] sm:text-[12px] josefin-sans-1 text-foreground/90 hover:text-white hover:border-white/40 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                            >
                              <span>View Certificate</span>
                              <ExternalLink className="w-[11px] h-[11px] text-accent-soft opacity-80 group-hover:opacity-100 transition-opacity" />
                            </button>
                          )}
                        </div>
                        <span className="josefin-sans-2 font-eyebrow whitespace-nowrap">{item.period}</span>
                      </div>
                      <p className="josefin-sans-1 text-subheading text-sm sm:text-[0.95rem]">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* SUB-SECTION: CO-CURRICULAR ACTIVITIES */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Medal className="w-4 h-4 text-accent" />
              <span className="josefin-sans-2 font-eyebrow">Co-Curricular Activities</span>
              <div className="flex-1 h-px bg-border/60" />
            </div>

            <div className="relative">
              <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border/60 hidden sm:block" />
              <div className="flex flex-col gap-6">
                {COCURRICULAR.map((item, idx) => (
                  <motion.div
                    key={idx}
                    custom={idx + RESEARCH.length}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="relative flex gap-5 sm:gap-6"
                  >
                    <div className="relative z-10 flex-shrink-0">
                      <div className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center bg-[var(--surface-elevated)] border border-border-strong text-accent">
                        {item.icon}
                      </div>
                      <div className="sm:hidden w-1.5 h-1.5 rounded-full bg-accent mt-2.5" />
                    </div>
                    <div className="flex-1 surface-glass surface-hover p-5 sm:p-6">
                      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2.5">
                        <h3 className="h-card text-base sm:text-lg">{item.role}</h3>
                        <span className="josefin-sans-2 font-eyebrow whitespace-nowrap">{item.period}</span>
                      </div>
                      <p className="josefin-sans-1 text-subheading text-sm sm:text-[0.95rem]">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
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
              <PdfCanvas
                src={selectedCert.fileUrl}
                className="max-h-[80vh] max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </motion.section>
  );
}
