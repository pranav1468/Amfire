"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type SubpageCaseStudy = {
  title: string;
  desc: string;
  tags: string[];
  result?: string;
};

export function SubpageCaseStudyCarousel({ items }: { items: SubpageCaseStudy[] }) {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);
  const paused = useRef(false);
  const total = items.length;

  const goTo = (idx: number) => {
    setVisible(false);
    setTimeout(() => {
      setCurrent(idx);
      setVisible(true);
    }, 280);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (!paused.current) {
        setVisible(false);
        setTimeout(() => {
          setCurrent((c) => (c + 1) % total);
          setVisible(true);
        }, 280);
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [total]);

  const prev = () => goTo((current - 1 + total) % total);
  const next = () => goTo((current + 1) % total);

  const item = items[current];

  return (
    <div
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
    >
      {/* Card */}
      <div
        className="min-h-[220px]"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(6px)",
          transition: "opacity 0.28s ease, transform 0.28s ease",
        }}
      >
        <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card hover:border-primary/25 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex flex-col gap-4">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground leading-snug">
            {item.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
          <div className="flex flex-wrap gap-2">
            {item.tags.map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 rounded-full bg-secondary border border-border text-xs font-medium text-foreground"
              >
                {t}
              </span>
            ))}
          </div>
          {item.result && (
            <div className="w-fit inline-flex items-center px-3 py-1.5 rounded-full gradient-bg text-white text-xs font-semibold">
              {item.result}
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-5">
        <div className="flex gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to case study ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "gradient-bg w-5" : "bg-border w-1.5"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
            aria-label="Previous case study"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={next}
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
            aria-label="Next case study"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
