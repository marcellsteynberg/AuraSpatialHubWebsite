import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, viewportOnce } from '../lib/animations';

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  className = '',
}: SectionHeaderProps) {
  const isCenter = align === 'center';
  return (
    <motion.div
      variants={staggerContainer(0.15)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={`${isCenter ? 'text-center mx-auto' : 'text-left'} max-w-3xl ${isCenter ? 'max-w-4xl' : ''} ${className}`}
    >
      <motion.span variants={fadeUp} className={`eyebrow ${isCenter ? 'block' : ''} mb-6`}>
        {eyebrow}
      </motion.span>
      <motion.h2
        variants={fadeUp}
        className={`font-serif text-ink text-[clamp(2rem,5vw,4rem)] leading-[1.05] tracking-tight text-balance ${
          isCenter ? 'mx-auto' : ''
        }`}
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          variants={fadeUp}
          className={`mt-7 text-charcoal text-lg leading-relaxed font-light text-pretty ${
            isCenter ? 'mx-auto' : ''
          } max-w-2xl`}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}
