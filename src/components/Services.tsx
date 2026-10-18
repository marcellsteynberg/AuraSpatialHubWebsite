import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { LazyVideo } from './LazyVideo';
import { Draggable } from './Draggable';
import { useContent } from '../context/ContentContext';
import { fadeUp, staggerContainer, viewportOnce, easeLux } from '../lib/animations';
import { transformStyle } from '../lib/mediaTransform';
import type { ServiceItem } from '../data/content';

export default function Services() {
  const { content } = useContent();
  const services = content.services;

  return (
    <section id="services" className="bg-bg py-24 md:py-40">
      <div className="container-lux">
        <motion.div
          variants={staggerContainer(0.15)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end md:justify-between gap-8"
        >
          <div className="max-w-2xl">
            <Draggable id="services-eyebrow">
              <motion.span variants={fadeUp} className="eyebrow mb-6 block">
                {services.eyebrow}
              </motion.span>
            </Draggable>
            <Draggable id="services-heading">
              <motion.h2
                variants={fadeUp}
                className="font-serif text-ink text-[clamp(2rem,5vw,4rem)] leading-[1.05] tracking-tight"
              >
                {services.heading}
              </motion.h2>
            </Draggable>
          </div>
          <Draggable id="services-intro">
            <motion.p variants={fadeUp} className="text-charcoal text-base leading-relaxed font-light max-w-sm">
              {services.intro}
            </motion.p>
          </Draggable>
        </motion.div>

        {/* All cards as full-width alternating split layouts */}
        <div className="space-y-6 md:space-y-8">
          {services.items.map((service, i) => (
            <SplitServiceCard key={service.id} service={service} index={i} reverse={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SplitServiceCard({
  service,
  index,
  reverse = false,
}: {
  service: ServiceItem;
  index: number;
  reverse?: boolean;
}) {
  const description = (
    <div className="flex flex-col justify-center gap-6 p-6 sm:p-8 md:p-12 lg:p-16 flex-1 min-w-0">
      <span className="text-[0.65rem] tracking-[0.25em] uppercase text-charcoal/60 font-medium">
        0{index + 1}
      </span>
      <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] text-ink leading-tight">
        {service.title}
      </h3>
      <p className="text-charcoal text-base leading-relaxed font-light max-w-sm">
        {service.description}
      </p>
      {service.stats && (
        <p className="text-charcoal/70 text-sm leading-relaxed font-light max-w-sm border-l border-ink/15 pl-4">
          {service.stats}
        </p>
      )}
      {service.price && (
        <div className="flex items-baseline gap-2 pt-2">
          <span className="text-[0.65rem] tracking-[0.25em] uppercase text-charcoal/60 font-medium">
            Price
          </span>
          <span className="font-serif text-2xl text-ink">{service.price}</span>
        </div>
      )}
      <ArrowUpRight
        size={22}
        strokeWidth={1.5}
        className="text-charcoal transition-all duration-500 ease-lux group-hover:text-ink group-hover:translate-x-1 group-hover:-translate-y-1"
      />
    </div>
  );

  const isFloorplans = service.id === 'floorplans';
  const media = (
    <div className="relative self-center overflow-hidden bg-ink shrink-0 w-full md:w-[480px] lg:w-[600px]">
      {service.image ? (
        <img
          src={service.image}
          alt={service.title}
          className={`block w-full h-auto ${isFloorplans ? 'object-contain !transform-none' : 'transition-transform duration-[1.2s] ease-lux group-hover:scale-105'}`}
          style={isFloorplans ? { transform: 'none', transformOrigin: 'initial' } : transformStyle(service.mediaTransform)}
        />
      ) : (
        <LazyVideo
          src={service.video}
          poster={service.poster}
          className="block w-full h-auto transition-transform duration-[1.2s] ease-lux group-hover:scale-105"
          style={transformStyle(service.mediaTransform)}
          controls={service.id !== 'photos'}
          initialVolume={service.audioVolume ?? 0.8}
        />
      )}
      <div
        className={`absolute inset-0 opacity-60 transition-opacity duration-700 group-hover:opacity-40 pointer-events-none ${
          reverse
            ? 'bg-gradient-to-r from-transparent via-black/10 to-black/30'
            : 'bg-gradient-to-l from-transparent via-black/10 to-black/30'
        }`}
      />
    </div>
  );

  return (
    <Draggable id={`service-card-${service.id}`}>
      <motion.article
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        transition={{ duration: 1, ease: easeLux }}
        className="group relative w-full overflow-hidden border border-hairline bg-offwhite flex flex-col md:flex-row md:items-center"
      >
        {reverse ? (
          <>
            {media}
            {description}
          </>
        ) : (
          <>
            {description}
            {media}
          </>
        )}
      </motion.article>
    </Draggable>
  );
}


