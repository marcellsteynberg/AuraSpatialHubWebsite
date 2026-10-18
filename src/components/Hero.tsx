import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowDown, Volume2, VolumeX } from 'lucide-react';
import { LazyVideo } from './LazyVideo';
import { Draggable } from './Draggable';
import { useContent } from '../context/ContentContext';
import { easeLux } from '../lib/animations';
import { transformStyle } from '../lib/mediaTransform';

export default function Hero() {
  const { content } = useContent();
  const hero = content.hero;

  const heroSectionRef = useRef<HTMLElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  const toggleHeroSound = async () => {
    const video = heroSectionRef.current?.querySelector('video');

    if (!video) {
      console.error('Hero video not found.');
      return;
    }

    const nextMuted = !video.muted;

    video.muted = nextMuted;
    video.defaultMuted = nextMuted;

    if (!nextMuted) {
      video.volume = Math.max(
        0,
        Math.min(1, hero.audioVolume ?? 0.8)
      );

      try {
        await video.play();
      } catch (error) {
        console.error(
          'Could not play hero video with sound:',
          error
        );
      }
    }

    setIsMuted(video.muted);
  };

  return (
    <section
      ref={heroSectionRef}
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-ink"
    >
      <LazyVideo
        src={hero.video}
        poster={hero.poster}
        className="absolute inset-0 h-full w-full object-cover"
        style={transformStyle(hero.mediaTransform)}
        initialVolume={hero.audioVolume ?? 0.8}
        soundControl={false}
      />

      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

      {/* Independent hero sound control */}
      <button
        type="button"
        onClick={toggleHeroSound}
        aria-label={isMuted ? 'Turn sound on' : 'Turn sound off'}
        title={isMuted ? 'Turn sound on' : 'Turn sound off'}
        className="absolute bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/70 text-white shadow-lg backdrop-blur-sm transition hover:bg-black focus:outline-none focus:ring-2 focus:ring-white"
      >
        {isMuted ? (
          <VolumeX size={24} />
        ) : (
          <Volume2 size={24} />
        )}
      </button>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center sm:px-6">
        {/* Keep your existing hero heading, description and CTA content here. */}
      </div>

      {/* Keep your existing scroll indicator and any other hero elements here. */}
    </section>
  );
}

