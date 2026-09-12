import fs from "fs";
import path from "path";
import CertificatesCarousel, {
  CertificateItem,
} from "./certificates-carousel";

const certificateCatalog = [
  ["Oracle Agentic AI Certified Foundations Associate.pdf", "Oracle Agentic AI Certified Foundations", "Oracle"],
  ["Cisco Introduction to Cybersecurity.pdf", "Introduction to Cybersecurity", "Cisco"],
  ["HPE Juniper - JUNOS Associate.pdf", "JUNOS Associate", "HPE Juniper"],
  ["Google Introduction to Large Language Models.pdf", "Introduction to Large Language Models", "Google"],
  ["Microsoft Introduction to the Basics of Azure Services.pdf", "Introduction to the Basics of Azure Services", "Microsoft"],
  ["Introduction to Machine Learning NPTEL.pdf", "Introduction to Machine Learning", "NPTEL"],
  ["HackerRank Software_Engineer_Intern.pdf", "Software Engineer Intern", "HackerRank"],
  ["HackerRank  SQL_Basic.pdf", "SQL Basic", "HackerRank"],
  ["HackerRank Python_Basic.pdf", "Python Basic", "HackerRank"],
  ["Forage TATA GenAI Powered Data Analytics.pdf", "GenAI Powered Data Analytics", "TATA"],
  ["Forage Software Engineering.pdf", "Forage Software Engineering", "Forage"],
  ["Forage Deloitte Australia Data Analytics.pdf", "Deloitte Australia Data Analytics", "Forage"],
  ["Infosys DEVOPS.pdf", "DevOps Mindset", "Infosys"],
  ["Infosys JENKIN.pdf", "Jenkins for DevOps", "Infosys"],
  ["SGCNSP 2025 Presentation Certificate.pdf", "SCGNSP 2025 - Presentation Certificate", "SCGNSP 2025"],
  ["NABH Certificate.pdf", "Digital Health", "NABH"],
  ["PrepInsta CN.pdf", "Computer Networks", "PrepInsta"],
  ["PrepInsta CPP.pdf", "C++", "PrepInsta"],
  ["PrepInsta HTML.pdf", "HTML", "PrepInsta"],
] as const;

function createCertificate(fileName: string, title: string, issuer: string): CertificateItem {
  const ext = path.extname(fileName).toLowerCase();
  const type: "image" | "pdf" = [".jpg", ".jpeg", ".png", ".webp"].includes(ext)
    ? "image"
    : "pdf";

  return {
    id: fileName,
    fileName,
    fileUrl: `/certificates/${encodeURIComponent(fileName)}`,
    type,
    title,
    issuer,
  };
}

export default function Certificates() {
  const certsDir = path.join(process.cwd(), "public", "certificates");
  let certificates: CertificateItem[] = [];

  try {
    if (fs.existsSync(certsDir)) {
      const availableFiles = new Set(fs.readdirSync(certsDir));
      certificates = certificateCatalog
        .filter(([fileName]) => availableFiles.has(fileName))
        .map(([fileName, title, issuer]) => createCertificate(fileName, title, issuer));
    }
  } catch (error) {
    console.error("Error reading certificates directory:", error);
  }

  if (certificates.length === 0) {
    return null;
  }

  return (
    <section
      id="certificates"
      className="section-rule py-16 md:py-24 border-t border-border/40"
    >
      <div className="max-w-[1100px] mx-auto px-6">
        {/* Section Heading - consistent typography system */}
        <div className="mb-10 md:mb-14">
          <div className="flex items-center gap-3 font-eyebrow mb-3">
            <span className="h-px w-8 bg-accent-soft" />
            <span className="josefin-sans-2 text-xs uppercase tracking-[0.2em] text-accent-soft">
              CREDENTIALS &amp; CERTIFICATIONS
            </span>
          </div>
          <h2 className="h-section text-[clamp(1.75rem,4vw,3rem)]">
            Certificates
          </h2>
          <p className="josefin-sans-1 text-subheading mt-2.5 max-w-xl">
            Course certifications, technical training, and academic credentials.
          </p>
        </div>

        {/* Carousel Component */}
        <CertificatesCarousel certificates={certificates} />
      </div>
    </section>
  );
}
