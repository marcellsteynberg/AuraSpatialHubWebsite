import { motion } from 'framer-motion';
import { useContent } from '../context/ContentContext';
import { Draggable } from './Draggable';
import { fadeUp, staggerContainer, viewportOnce } from '../lib/animations';

export default function About() {
  const { content } = useContent();
  const about = content.about;

  return (
    <section id="about" className="bg-bg py-24 md:py-40">
      <div className="container-lux">
        {/* Text */}
        <div className="max-w-2xl">
          <motion.div
            variants={staggerContainer(0.15)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <Draggable id="about-eyebrow">
              <motion.span variants={fadeUp} className="eyebrow mb-6 block">
                {about.eyebrow}
              </motion.span>
            </Draggable>
            <Draggable id="about-heading">
              <motion.h2
                variants={fadeUp}
                className="font-serif text-ink text-[clamp(1.9rem,4vw,3.25rem)] leading-[1.1] tracking-tight mb-8"
              >
                {about.heading}
              </motion.h2>
            </Draggable>
            {about.paragraphs.map((para, i) => (
              <Draggable key={i} id={`about-paragraph-${i}`}>
                <motion.p
                  variants={fadeUp}
                  className="text-charcoal text-lg leading-[1.7] font-light mb-6 text-pretty"
                >
                  {para}
                </motion.p>
              </Draggable>
            ))}

            <Draggable id="about-stats">
              <motion.div variants={fadeUp} className="mt-10 grid grid-cols-3 gap-4 sm:gap-6 max-w-md">
                {about.stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="font-serif text-2xl sm:text-3xl text-ink leading-none">{stat.figure}</p>
                    <p className="text-charcoal text-[0.65rem] sm:text-xs mt-2 leading-relaxed font-light tracking-wide">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </motion.div>
            </Draggable>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
