"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Briefcase, Medal, FlaskConical, Users, Target, X, ExternalLink } from "lucide-react";
import dynamic from "next/dynamic";

const PdfCanvas = dynamic(() => import("./pdf-canvas"), { ssr: false });

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

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: 0.08 + i * 0.13,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const EXPERIENCE = [
  {
    icon: <Briefcase className="w-4 h-4" />,
    role: "Machine Learning Researcher - Carnegie Mellon University",
    period: "Oct 2026 – Present",
    description:
      "Part of the CMU ML Research Collective, working on LLM reasoning, multi-agent systems and efficient ML through literature reviews, experimentation and model evaluation, with a focus on contributing to research for leading ML conferences.",
    certificate: undefined,
  },
  {
    icon: <Briefcase className="w-4 h-4" />,
    role: "AI/ML Intern - IIIT Dharwad",
    period: "Mar 2026 – Present",
    description:
      "Developed a non-contact rPPG pipeline with ROI-based RGB extraction, Butterworth band-pass filtering and Eulerian Video Magnification (EVM) to enhance subtle visual variations in palm recordings during chanting. Extending the pipeline to a multimodal EEG and rPPG framework to compare resting and chanting states.",
    certificate: undefined,
  },
];

const RESEARCH = [
  {
    icon: <FlaskConical className="w-4 h-4" />,
    role: "3D Wi-Fi Based Floor Localization System",
    period: "Jan 2026 – May 2026",
    description:
      "Research on indoor floor-level localization using Wi-Fi RSSI fingerprinting, USRP B210 SDR data and a 1D CNN model. Published at the IEEE International Conference on Advanced Networks and Telecommunications (IEEE ICONAT) 2026.",
    certificate: {
      title: "ICONAT 2026 Presentation Certificate",
      issuer: "IEEE",
      fileUrl: "/certificates/ICONAT 2026 Presentation Certificate.pdf",
    },
  },
  {
    icon: <FlaskConical className="w-4 h-4" />,
    role: "Automated Prostate Cancer Detection from Histopathology Images",
    period: "Sep 2025 – Jan 2026",
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
    icon: <Users className="w-4 h-4" />,
    role: "Treasurer, ARC Stack Tech Club - Event Organizer & Coordinator - HR & Literary Club",
    period: "2023 – Present",
    description:
      "Managed financing and fund allocation of Rs. 4,00,000+ across department clusters as Treasurer; led technical event planning and community engagement initiatives. Organized HR and Esports college events reaching 300+ students; contributed to literary activities and student engagement initiatives.",
    certificate: undefined,
  },
  {
    icon: <Target className="w-4 h-4" />,
    role: "NCC Sergeant & Contingent Leader - Belagavi Division",
    period: "2018 – 2020",
    description:
      "Represented Karnataka & Goa Directorate; attended All India Thal Sainik Camp (TSC), New Delhi - Top 10 All India Rank, 0.22 Cal Rifle Shooting (National Level). Participated in IDSSC; qualified for AIGVMSC national-level selection stages.",
    certificate: undefined,
  },
];

type CertInfo = { title: string; issuer: string; fileUrl: string };

function TimelineGroup({
  items,
  indexOffset = 0,
  onCertClick,
}: {
  items: typeof EXPERIENCE | typeof RESEARCH | typeof COCURRICULAR;
  indexOffset?: number;
  onCertClick: (cert: CertInfo) => void;
}) {
  return (
    <div className="relative">
      {/* Vertical rule — sits behind markers, starts at first marker center */}
      <div
        className="absolute hidden sm:block w-px bg-border/50"
        style={{ left: "11px", top: "12px", bottom: "12px" }}
      />

      <div className="flex flex-col gap-12 sm:gap-14">
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            custom={indexOffset + idx}
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="relative flex gap-6 sm:gap-8"
          >
            {/* Marker */}
            <div className="relative z-10 flex-shrink-0 flex flex-col items-center">
              {/* Circle icon */}
              <div className="w-[22px] h-[22px] rounded-full border border-border-strong bg-[var(--surface-elevated)] flex items-center justify-center text-accent-soft mt-1">
                {item.icon}
              </div>
            </div>

            {/* Content — no card, sits directly beside the line */}
            <div className="flex-1 pb-2 min-w-0">
              {/* Period eyebrow */}
              <span className="space-grotesk-2 font-eyebrow text-[10px] tracking-[0.22em] text-muted/60 mb-2 block">
                {item.period}
              </span>

              {/* Role / title */}
              <h3 className="font-heading font-bold text-[1.15rem] sm:text-[1.25rem] leading-snug tracking-[-0.01em] text-foreground mb-3">
                {item.role}
              </h3>

              {/* Description */}
              <p className="space-grotesk-1 text-[0.925rem] sm:text-[0.975rem] leading-[1.8] text-muted/80 max-w-[720px]">
                {item.description}
              </p>

              {/* Certificate button — outline style, consistent with navbar */}
              {"certificate" in item && item.certificate && (
                <button
                  type="button"
                  onClick={() => onCertClick(item.certificate!)}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-white/20 bg-white/[0.04] text-[11px] space-grotesk-2 tracking-[0.12em] uppercase text-foreground/70 hover:text-foreground hover:border-white/40 hover:bg-white/[0.08] transition-all duration-200 cursor-pointer"
                >
                  <span>View Certificate</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function WorkGrowthImpact() {
  const [selectedCert, setSelectedCert] = useState<CertInfo | null>(null);
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
      viewport={{ once: true, amount: 0.15 }}
      className="section-rule py-16 md:py-24 border-t border-border/40"
    >
      <div className="max-w-[1200px] mx-auto px-6">

        {/* Section heading */}
        <div className="mb-14 md:mb-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-8 bg-accent-soft" />
            <span className="space-grotesk-2 text-[11px] uppercase tracking-[0.22em] text-accent-soft">
              Work, Growth &amp; Impact
            </span>
          </div>
          <h2 className="h-section text-[clamp(1.75rem,4vw,3rem)]">
            Experience &amp; Activities
          </h2>
          <p className="space-grotesk-1 text-subheading mt-3 max-w-lg text-[0.9rem]">
            Leadership, creative pursuits and meaningful contributions alongside technical work.
          </p>
        </div>

        <div className="space-y-16 md:space-y-20">

          {/* ── EXPERIENCE ── */}
          <div>
            {/* Sub-section label */}
            <div className="flex items-center gap-3 mb-8">
              <Briefcase className="w-3.5 h-3.5 text-accent/70" />
              <span className="space-grotesk-2 font-eyebrow text-[10px] tracking-[0.22em] text-muted/60">
                Experience
              </span>
              <div className="flex-1 h-px bg-border/40" />
            </div>

            <TimelineGroup
              items={EXPERIENCE}
              indexOffset={0}
              onCertClick={setSelectedCert}
            />
          </div>

          {/* ── RESEARCH EXPERIENCE ── */}
          <div>
            {/* Sub-section label */}
            <div className="flex items-center gap-3 mb-8">
              <FlaskConical className="w-3.5 h-3.5 text-accent/70" />
              <span className="space-grotesk-2 font-eyebrow text-[10px] tracking-[0.22em] text-muted/60">
                Research Experience
              </span>
              <div className="flex-1 h-px bg-border/40" />
            </div>

            <TimelineGroup
              items={RESEARCH}
              indexOffset={EXPERIENCE.length}
              onCertClick={setSelectedCert}
            />
          </div>

          {/* ── CO-CURRICULAR ACTIVITIES ── */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Medal className="w-3.5 h-3.5 text-accent/70" />
              <span className="space-grotesk-2 font-eyebrow text-[10px] tracking-[0.22em] text-muted/60">
                Co-Curricular Activities
              </span>
              <div className="flex-1 h-px bg-border/40" />
            </div>

            <TimelineGroup
              items={COCURRICULAR}
              indexOffset={EXPERIENCE.length + RESEARCH.length}
              onCertClick={setSelectedCert}
            />
          </div>

        </div>
      </div>

      {/* ── Certificate Modal ── */}
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
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center border-b border-white/10 px-5 py-3.5 bg-white/[0.02] pr-14">
              <div>
                <span className="space-grotesk-2 text-[10px] uppercase tracking-[0.22em] text-accent-soft block mb-0.5">
                  {selectedCert.issuer}
                </span>
                <h2
                  id="certificate-dialog-title"
                  className="font-heading text-sm sm:text-base font-bold text-foreground"
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
              className="absolute right-3.5 top-3.5 z-10 rounded-lg border border-white/20 bg-black/60 p-2 text-white transition-colors hover:border-accent hover:bg-white/[0.1] cursor-pointer"
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
