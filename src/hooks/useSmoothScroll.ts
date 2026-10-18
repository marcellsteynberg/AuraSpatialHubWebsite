import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Registers GSAP ScrollTrigger and refreshes triggers after layout settles.
 * Smooth scroll is handled natively via CSS `scroll-behavior: smooth` and
 * `scrollIntoView({ behavior: 'smooth' })` calls, which is the most
 * performant and accessible approach (no JS scroll-jacking).
 */
export function useSmoothScroll() {
  useEffect(() => {
    // Ensure ScrollTrigger uses the correct viewport metrics.
    ScrollTrigger.refresh();

    const onLoad = () => ScrollTrigger.refresh();
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('load', onLoad);
      window.removeEventListener('resize', onResize);
    };
  }, []);
}
