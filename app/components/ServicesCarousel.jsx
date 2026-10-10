'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  BanknotesIcon,
  CreditCardIcon,
  ArrowsRightLeftIcon,
  HandRaisedIcon,
  DocumentChartBarIcon,
  ChatBubbleLeftRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

const SERVICE_ICONS = [
  BanknotesIcon,
  CreditCardIcon,
  ArrowsRightLeftIcon,
  HandRaisedIcon,
  DocumentChartBarIcon,
  ChatBubbleLeftRightIcon,
];

// Carrousel des services : défilement automatique, flèches et points.
export default function ServicesCarousel({ cards }) {
  const [perView, setPerView] = useState(3);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      setPerView(w < 640 ? 1 : w < 1024 ? 2 : 3);
    }
    const raf = requestAnimationFrame(update);
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', update);
    };
  }, []);

  const maxIndex = Math.max(0, cards.length - perView);
  const currentIndex = Math.min(index, maxIndex);

  const next = useCallback(() => {
    setIndex((i) => (i >= maxIndex ? 0 : i + 1));
  }, [maxIndex]);

  const prev = () => setIndex((i) => (i <= 0 ? maxIndex : i - 1));

  useEffect(() => {
    if (paused) return undefined;
    const timer = setInterval(next, 4500);
    return () => clearInterval(timer);
  }, [next, paused]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * (100 / perView)}%)` }}
        >
          {cards.map((card, i) => {
            const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length];
            return (
              <div
                key={i}
                className="shrink-0 px-3"
                style={{ width: `${100 / perView}%` }}
              >
                <div className="h-full rounded-xl border border-gray-200 p-6 hover:border-[#3C50E0]/40 transition">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[#3C50E0]/10 text-[#3C50E0] mb-4">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-semibold mb-2">{card.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{card.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Flèches */}
      <button
        type="button"
        onClick={prev}
        aria-label="Précédent"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-white border border-gray-200 shadow-sm items-center justify-center text-gray-500 hover:text-[#3C50E0] hover:border-[#3C50E0]/40 transition hidden md:inline-flex cursor-pointer"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Suivant"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-10 w-10 rounded-full bg-white border border-gray-200 shadow-sm items-center justify-center text-gray-500 hover:text-[#3C50E0] hover:border-[#3C50E0]/40 transition hidden md:inline-flex cursor-pointer"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>

      {/* Points */}
      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Page ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              i === currentIndex ? 'w-6 bg-[#3C50E0]' : 'w-2 bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
