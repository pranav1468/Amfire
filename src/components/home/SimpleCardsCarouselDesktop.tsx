"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type SimpleCard = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const VISIBLE = 3;
const GAP = 20; // px

export function SimpleCardsCarouselDesktop({ cards }: { cards: SimpleCard[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(0);
  const [current, setCurrent] = useState(0);
  const paused = useRef(false);

  const positions = Math.max(1, cards.length - VISIBLE + 1);

  useLayoutEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        setCardWidth((w - GAP * (VISIBLE - 1)) / VISIBLE);
      }
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!paused.current) setCurrent((c) => (c + 1) % positions);
    }, 4000);
    return () => clearInterval(timer);
  }, [positions]);

  const prev = () => setCurrent((c) => (c - 1 + positions) % positions);
  const next = () => setCurrent((c) => (c + 1) % positions);

  const translateX = cardWidth > 0 ? -current * (cardWidth + GAP) : 0;

  return (
    <div
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
    >
      <div
        ref={containerRef}
        className="overflow-hidden"
        style={{ paddingTop: 16, paddingBottom: 16, marginTop: -16, marginBottom: -16 }}
      >
        <div
          className="flex items-stretch"
          style={{
            gap: GAP,
            transform: `translateX(${translateX}px)`,
            transition: cardWidth > 0 ? "transform 0.45s cubic-bezier(0.4,0,0.2,1)" : "none",
          }}
        >
          {cards.map((card, i) => (
            <div
              key={i}
              style={{
                flex: cardWidth > 0
                  ? `0 0 ${cardWidth}px`
                  : `0 0 calc((100% - ${GAP * (VISIBLE - 1)}px) / ${VISIBLE})`,
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div className="group p-6 rounded-xl border border-border bg-card hover:border-primary/25 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 h-full flex flex-col active:scale-[0.98]">
                <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center mb-4 shrink-0">
                  {card.icon}
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-2">{card.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex gap-2">
          {Array.from({ length: positions }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to position ${i + 1}`}
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
            aria-label="Previous"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={next}
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
            aria-label="Next"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
