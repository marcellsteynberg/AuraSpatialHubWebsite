import type { Variants } from 'framer-motion';

/** The signature luxury easing — slow, deliberate, expensive. */
export const easeLux = [0.22, 1, 0.36, 1] as const;
export const easeExpo = [0.16, 1, 0.3, 1] as const;

/** Fade in + rise + subtle blur reduction. Duration 0.8–1.2s. */
export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1.1,
      ease: easeLux,
    },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 1, ease: easeLux },
  },
};

/** Container that staggers its children into view. */
export const staggerContainer = (stagger = 0.12, delay = 0): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
});

/** For headlines — rises a touch more, slightly slower. */
export const fadeUpLarge: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1.2,
      ease: easeLux,
    },
  },
};

/** Scale-in with blur, used for images / media. */
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 1.06,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 1.3,
      ease: easeLux,
    },
  },
};

/** Viewport config so animations trigger once, with a generous margin. */
export const viewportOnce = { once: true, amount: 0.2, margin: '0px 0px -10% 0px' };
