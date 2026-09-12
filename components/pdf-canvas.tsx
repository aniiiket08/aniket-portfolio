/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

export default function PdfCanvas({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let loadingTask: any = null;

    async function loadPdf() {
      try {
        setLoading(true);
        setError(false);
        const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

        loadingTask = pdfjs.getDocument({ url: src });
        const pdf = await loadingTask.promise;
        if (cancelled) return;

        const page = await pdf.getPage(1);
        if (cancelled || !canvasRef.current) return;

        const viewport = page.getViewport({ scale: 2 });
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvas, canvasContext: context, viewport }).promise;
        if (!cancelled) setLoading(false);
      } catch (err) {
        if (!cancelled) {
          console.error("PDF rendering error:", err);
          setError(true);
          setLoading(false);
        }
      }
    }

    loadPdf();

    return () => {
      cancelled = true;
      if (loadingTask) {
        try {
          void loadingTask.destroy();
        } catch {
          // ignore
        }
      }
    };
  }, [src]);

  return (
    <div className="relative flex items-center justify-center min-h-[300px] w-full">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted">
          <Loader2 className="w-8 h-8 animate-spin text-accent-soft" />
          <span className="text-xs font-eyebrow uppercase tracking-widest">
            Loading Document...
          </span>
        </div>
      )}
      {error && (
        <div className="flex flex-col items-center justify-center p-8 text-center text-muted">
          <p className="text-sm">Unable to preview PDF document in canvas.</p>
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 px-4 py-2 text-xs font-medium rounded-lg border border-border bg-[var(--surface-soft)] text-foreground hover:border-accent"
          >
            Open PDF directly
          </a>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className={`${className || ""} ${
          loading ? "opacity-0" : "opacity-100 transition-opacity duration-300"
        }`}
        aria-label="Certificate Preview"
      />
    </div>
  );
}
