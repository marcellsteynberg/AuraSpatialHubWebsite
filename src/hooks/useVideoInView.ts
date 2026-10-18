import { useEffect, useRef } from 'react';

type VideoOptions = {
  rootMargin?: string;
  loadOnly?: boolean;
};

export function useVideoInView<T extends HTMLVideoElement>(
  options: VideoOptions = {},
) {
  const ref = useRef<T>(null);
  const { rootMargin = '200px 0px', loadOnly = false } = options;

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    // Lazy-load the video when it approaches the viewport.
    const loadObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          const sources = video.querySelectorAll('source[data-src]');

          sources.forEach((source) => {
            const src = source.getAttribute('data-src');

            if (src && !source.getAttribute('src')) {
              source.setAttribute('src', src);
            }
          });

          video.load();
          loadObserver.unobserve(video);
        }
      },
      { rootMargin },
    );

    loadObserver.observe(video);

    if (loadOnly || prefersReduced) {
      return () => loadObserver.disconnect();
    }

    // Autoplay when visible without overriding the user's sound setting.
    const playObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            video.play().catch(() => {
              // The browser may block autoplay.
            });
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.25 },
    );

    playObserver.observe(video);

    const onVisibility = () => {
      if (document.hidden) {
        video.pause();
      }
    };

    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      loadObserver.disconnect();
      playObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [rootMargin, loadOnly]);

  return ref;
}