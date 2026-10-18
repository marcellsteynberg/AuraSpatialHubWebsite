import { motion } from 'framer-motion';
import {
  Aperture,
  Zap,
  Box,
  Crown,
  Plane,
  Compass,
  type LucideIcon,
} from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { Draggable } from './Draggable';
import { fadeUp, staggerContainer, viewportOnce, easeLux } from '../lib/animations';

const iconMap: Record<string, LucideIcon> = {
  Aperture,
  Zap,
  Box,
  Crown,
  Plane,
  Compass,
};

export default function WhyChooseAura() {
  const { content } = useContent();
  const why = content.why;

  return (
    <section id="why" className="bg-ink py-24 md:py-40 text-white">
      <div className="container-lux">
        <motion.div
          variants={staggerContainer(0.15)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mb-16 md:mb-24 max-w-3xl"
        >
          <Draggable id="why-eyebrow" dark>
            <motion.span variants={fadeUp} className="eyebrow !text-white/60 mb-6 block">
              {why.eyebrow}
            </motion.span>
          </Draggable>
          <Draggable id="why-heading" dark>
            <motion.h2
              variants={fadeUp}
              className="font-serif text-white text-[clamp(2rem,5vw,4rem)] leading-[1.05] tracking-tight"
            >
              {why.heading}
            </motion.h2>
          </Draggable>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10"
        >
          {why.items.map((card, i) => {
            const Icon = iconMap[card.icon] ?? Aperture;
            return (
              <Draggable key={i} id={`why-card-${i}`} dark className="h-full">
                <motion.div
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.6, ease: easeLux }}
                  className="group relative bg-ink p-8 md:p-10 transition-colors duration-700 hover:bg-white/[0.04] cursor-default h-full flex flex-col"
                >
                  <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center mb-7 transition-all duration-700 ease-lux group-hover:border-white/60 group-hover:bg-white/5">
                    <Icon
                      size={20}
                      strokeWidth={1.5}
                      className="text-white/80 transition-all duration-700 ease-lux group-hover:text-white"
                    />
                  </div>
                  <h3 className="font-serif text-2xl text-white mb-3 leading-tight">{card.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed font-light flex-1">{card.description}</p>

                  <span className="absolute bottom-0 left-0 h-px w-0 bg-white/40 transition-all duration-700 ease-lux group-hover:w-full" />
                </motion.div>
              </Draggable>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
