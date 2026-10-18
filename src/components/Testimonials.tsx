import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ArrowLeft, ArrowRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { Draggable } from './Draggable';
import { easeLux } from '../lib/animations';

export default function Testimonials() {
  const { content } = useContent();
  const testimonials = content.testimonials;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = testimonials.items.length;

  const go = useCallback(
    (dir: number) => {
      setIndex((i) => (i + dir + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, 6000);
    return () => clearInterval(id);
  }, [paused, count]);

  useEffect(() => {
    if (index >= count) setIndex(0);
  }, [count, index]);

  const t = testimonials.items[index];

  return (
    <section className="bg-offwhite py-24 md:py-40 overflow-hidden">
      <div className="container-lux">
        <div className="mb-16 md:mb-20 flex items-end justify-between gap-8">
          <div className="max-w-2xl">
            <Draggable id="testimonials-eyebrow">
              <span className="eyebrow mb-6 block">{testimonials.eyebrow}</span>
            </Draggable>
            <Draggable id="testimonials-heading">
              <h2 className="font-serif text-ink text-[clamp(2rem,5vw,4rem)] leading-[1.05] tracking-tight">
                {testimonials.heading}
              </h2>
            </Draggable>
          </div>
          <Draggable id="testimonials-nav">
            <div className="hidden sm:flex gap-3">
              <button
                onClick={() => go(-1)}
                className="w-12 h-12 border border-hairline flex items-center justify-center text-charcoal hover:bg-ink hover:text-white hover:border-ink transition-all duration-500 ease-lux"
                aria-label="Previous testimonial"
              >
                <ArrowLeft size={18} strokeWidth={1.5} />
              </button>
              <button
                onClick={() => go(1)}
                className="w-12 h-12 border border-hairline flex items-center justify-center text-charcoal hover:bg-ink hover:text-white hover:border-ink transition-all duration-500 ease-lux"
                aria-label="Next testimonial"
              >
                <ArrowRight size={18} strokeWidth={1.5} />
              </button>
            </div>
          </Draggable>
        </div>

        {/* Glass card stage */}
        <Draggable id="testimonials-card">
          <div
            className="relative min-h-[340px] md:min-h-[300px]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={index}
                initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
                transition={{ duration: 0.9, ease: easeLux }}
                className="glass-card relative p-8 sm:p-10 md:p-16 max-w-4xl"
              >
                <Quote size={36} strokeWidth={1} className="text-ink/20 mb-6" />
                <p className="font-serif text-ink text-xl sm:text-2xl md:text-[2rem] leading-[1.4] tracking-tight text-balance">
                  "{t.quote}"
                </p>
                <footer className="mt-10 flex items-center gap-4">
                  <span className="w-10 h-px bg-ink/40" />
                  <div>
                    <p className="text-ink font-medium text-sm tracking-wide">{t.name}</p>
                    <p className="text-charcoal text-sm font-light mt-0.5">
                      {t.title} — {t.location}
                    </p>
                  </div>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>
        </Draggable>

        {/* Progress indicators */}
        <div className="mt-12 flex items-center gap-3">
          {testimonials.items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`h-px transition-all duration-700 ease-lux ${
                i === index ? 'w-12 bg-ink' : 'w-6 bg-hairline hover:bg-charcoal'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
