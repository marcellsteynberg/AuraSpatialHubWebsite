import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';
import { LazyVideo } from './LazyVideo';
import { Draggable } from './Draggable';
import { useContent } from '../context/ContentContext';
import { fadeUp, staggerContainer, viewportOnce, easeLux } from '../lib/animations';
import { transformStyle } from '../lib/mediaTransform';
import type { ProjectItem } from '../data/content';

export default function Portfolio() {
  const { content } = useContent();
  const projects = content.portfolio.items;
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const next = useCallback(
    () => setActive((i) => (i === null ? i : (i + 1) % projects.length)),
    [projects.length],
  );
  const prev = useCallback(
    () => setActive((i) => (i === null ? i : (i - 1 + projects.length) % projects.length)),
    [projects.length],
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [active, close, next, prev]);

  return (
    <section id="portfolio" className="bg-offwhite py-24 md:py-40">
      <div className="container-lux">
        <motion.div
          variants={staggerContainer(0.15)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mb-16 md:mb-24"
        >
          <Draggable id="portfolio-eyebrow">
            <motion.span variants={fadeUp} className="eyebrow mb-6 block">
              {content.portfolio.eyebrow}
            </motion.span>
          </Draggable>
          <Draggable id="portfolio-heading">
            <motion.h2
              variants={fadeUp}
              className="font-serif text-ink text-[clamp(2rem,5vw,4rem)] leading-[1.05] tracking-tight max-w-3xl"
            >
              {content.portfolio.heading}
            </motion.h2>
          </Draggable>
        </motion.div>

        {/* Masonry grid using CSS columns for a natural editorial rhythm */}
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="columns-1 sm:columns-2 lg:columns-3 gap-6 md:gap-8 [&>*]:mb-6 md:[&>*]:mb-8"
        >
          {projects.map((project, i) => (
            <PortfolioCard key={project.id} project={project} index={i} onOpen={() => setActive(i)} />
          ))}
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {active !== null && (
          <Lightbox project={projects[active]} onClose={close} onNext={next} onPrev={prev} />
        )}
      </AnimatePresence>
    </section>
  );
}

function PortfolioCard({
  project,
  index,
  onOpen,
}: {
  project: ProjectItem;
  index: number;
  onOpen: () => void;
}) {
  const aspect =
    project.span === 'tall'
      ? 'aspect-[3/4]'
      : project.span === 'wide'
      ? 'aspect-[4/3]'
      : 'aspect-square';

  return (
    <Draggable id={`portfolio-card-${project.id}`}>
      <motion.button
        variants={fadeUp}
        onClick={onOpen}
        className="group relative block w-full overflow-hidden bg-ink text-left break-inside-avoid"
        aria-label={`View ${project.name}`}
      >
        <div className={`relative w-full ${aspect} overflow-hidden`}>
          {/* Default image */}
          <img
            src={project.image}
            alt={project.name}
            loading="lazy"
            style={transformStyle(project.mediaTransform)}
            className="absolute inset-0 h-full w-full object-cover transition-all duration-[1.2s] ease-lux group-hover:opacity-0 group-hover:scale-105"
          />
          {/* Hover video crossfade */}
          <LazyVideo
            src={project.video}
            className="absolute inset-0 h-full w-full object-cover opacity-0 scale-105 transition-all duration-[1.2s] ease-lux group-hover:opacity-100 group-hover:scale-100"
            initialVolume={project.audioVolume ?? 0.8}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-70 transition-opacity duration-700 group-hover:opacity-90" />

          {/* Overlay info */}
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-7 translate-y-2 opacity-90 transition-all duration-700 ease-lux group-hover:translate-y-0 group-hover:opacity-100">
            <span className="text-[0.65rem] tracking-[0.25em] uppercase text-white/70">
              {project.service}
            </span>
            <h3 className="font-serif text-white text-2xl md:text-3xl mt-2 leading-tight">
              {project.name}
            </h3>
            <p className="text-white/70 text-sm mt-1 font-light">{project.location}</p>
          </div>

          <span className="absolute top-5 right-5 text-[0.65rem] tracking-[0.25em] uppercase text-white/50">
            0{index + 1}
          </span>
        </div>
      </motion.button>
    </Draggable>
  );
}

function Lightbox({
  project,
  onClose,
  onNext,
  onPrev,
}: {
  project: ProjectItem;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: easeLux }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-12"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 text-white/70 hover:text-white transition-colors p-2"
        aria-label="Close"
      >
        <X size={24} strokeWidth={1.5} />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute left-4 md:left-8 z-10 text-white/60 hover:text-white transition-colors p-2 hidden sm:block"
        aria-label="Previous"
      >
        <ArrowLeft size={28} strokeWidth={1.5} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-4 md:right-8 z-10 text-white/60 hover:text-white transition-colors p-2 hidden sm:block"
        aria-label="Next"
      >
        <ArrowRight size={28} strokeWidth={1.5} />
      </button>

      <motion.div
        key={project.id}
        initial={{ opacity: 0, scale: 0.96, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.7, ease: easeLux }}
        className="relative max-w-5xl w-full overflow-hidden bg-ink"
        onClick={(e) => e.stopPropagation()}
      >
        <LazyVideo
          src={project.video}
          poster={project.image}
          className="block w-full h-auto object-cover"
          controls
          initialVolume={project.audioVolume ?? 0.8}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 md:p-12">
          <span className="text-[0.7rem] tracking-[0.28em] uppercase text-white/70">
            {project.service}
          </span>
          <h3 className="font-serif text-white text-2xl sm:text-3xl md:text-4xl lg:text-6xl mt-3 leading-tight">
            {project.name}
          </h3>
          <p className="text-white/70 text-lg mt-2 font-light">{project.location}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
