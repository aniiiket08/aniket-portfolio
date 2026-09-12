"use client";

import { motion } from "framer-motion";
import { Briefcase, Medal, Palette, Video, Users, Target } from "lucide-react";

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

export default function BeyondTheCode() {
  const experience = [
    {
      icon: <Users className="w-5 h-5" />,
      role: "Treasurer, ARC Stack Tech Club - Event Organizer & Coordinator - HR & Literary Club",
      period: "2023 - Present",
      description:
        "Managed financing and fund allocation of Rs. 3,00,000 across department clusters as Treasurer; led technical event planning and community engagement initiatives. Organized HR and Esports college events reaching 150+ students; contributed to literary activities and student engagement initiatives.",
    },
    {
      icon: (
        <div className="flex -space-x-1.5">
          <Palette className="w-5 h-5" />
          <Video className="w-5 h-5" />
        </div>
      ),
      role: "Freelance Graphic Designer & Video Editor",
      period: "2018 - Present",
      description:
        "Delivered branding, promotional, and digital content projects; built client coordination and visual storytelling skills.",
    },
  ];

  const extracurricular = [
    {
      icon: <Target className="w-5 h-5" />,
      role: "NCC Sergeant & Contingent Leader - Belagavi Division",
      period: "2019 - 2021",
      description:
        "Represented Karnataka & Goa Directorate; attended All India Thal Sainik Camp (TSC), New Delhi - Top 10 All India Rank, 0.22 Cal Rifle Shooting (National Level). Participated in IDSSC; qualified for AIGVMSC national-level selection stages.",
    },
  ];

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
          {/* SUB-SECTION: EXPERIENCE */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Briefcase className="w-4 h-4 text-accent" />
              <span className="josefin-sans-2 font-eyebrow">Experience</span>
              <div className="flex-1 h-px bg-border/60" />
            </div>

            <div className="relative">
              <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border/60 hidden sm:block" />

              <div className="flex flex-col gap-6">
                {experience.map((item, idx) => (
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
                        <h3 className="h-card text-base sm:text-lg">
                          {item.role}
                        </h3>
                        <span className="josefin-sans-2 font-eyebrow whitespace-nowrap">
                          {item.period}
                        </span>
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

          {/* SUB-SECTION: EXTRACURRICULAR ACTIVITIES */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Medal className="w-4 h-4 text-accent" />
              <span className="josefin-sans-2 font-eyebrow">Extracurricular Activities</span>
              <div className="flex-1 h-px bg-border/60" />
            </div>

            <div className="relative">
              <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border/60 hidden sm:block" />

              <div className="flex flex-col gap-6">
                {extracurricular.map((item, idx) => (
                  <motion.div
                    key={idx}
                    custom={idx + experience.length}
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
                        <h3 className="h-card text-base sm:text-lg">
                          {item.role}
                        </h3>
                        <span className="josefin-sans-2 font-eyebrow whitespace-nowrap">
                          {item.period}
                        </span>
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
    </motion.section>
  );
}
