import { memo, useCallback, useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useVideoInView } from '../hooks/useVideoInView';

type LazyVideoProps = {
src: string;
poster?: string;
className?: string;
style?: React.CSSProperties;
manual?: boolean;
preload?: 'none' | 'metadata' | 'auto';
controls?: boolean;
soundControl?: boolean;
initialVolume?: number;
};

function LazyVideoBase({
src,
poster,
className,
style,
manual = false,
preload = 'none',
controls = false,
soundControl = true,
initialVolume = 1,
}: LazyVideoProps) {
const ref = useVideoInView<HTMLVideoElement>({
loadOnly: manual || controls,
});

const [playing, setPlaying] = useState(false);
const [soundBlocked, setSoundBlocked] = useState(false);
const [isMuted, setIsMuted] = useState(true);

const volume = Math.max(0, Math.min(1, initialVolume));

const enableSound = useCallback(
async (e: React.MouseEvent<HTMLButtonElement>) => {
e.stopPropagation();
e.preventDefault();


  const video = ref.current;
  if (!video) return;

  video.defaultMuted = false;
  video.muted = false;
  video.volume = volume;
  setIsMuted(false);

  try {
    if (video.paused) {
      await video.play();
    }

    setPlaying(!video.paused);
    setSoundBlocked(false);
  } catch (error) {
    console.error('Video playback with sound failed:', error);
    setSoundBlocked(true);
  }
},
[ref, volume],


);

const toggle = useCallback(
async (e: React.MouseEvent<HTMLButtonElement>) => {
e.stopPropagation();
e.preventDefault();


  const video = ref.current;
  if (!video) return;

  if (!video.paused) {
    video.pause();
    return;
  }

  video.defaultMuted = false;
  video.muted = false;
  video.volume = volume;
  setIsMuted(false);

  try {
    await video.play();
    setPlaying(true);
    setSoundBlocked(false);
  } catch (error) {
    console.error('Video playback with sound failed:', error);
    setSoundBlocked(true);
  }
},
[ref, volume],


);

const toggleMute = useCallback(
(e: React.MouseEvent<HTMLButtonElement>) => {
e.stopPropagation();
e.preventDefault();


  const video = ref.current;
  if (!video) return;

  if (video.muted || video.volume === 0) {
    video.defaultMuted = false;
    video.muted = false;
    video.volume = volume;
    setIsMuted(false);
    setSoundBlocked(false);
  } else {
    video.muted = true;
    setIsMuted(true);
  }
},
[ref, volume],


);

useEffect(() => {
const video = ref.current;
if (!video) return;


const onPlay = () => {
  setPlaying(true);

  document.dispatchEvent(
    new CustomEvent<HTMLVideoElement>('aura-video-play', {
      detail: video,
    }),
  );
};

const onPause = () => setPlaying(false);

const onVolumeChange = () => {
  setIsMuted(video.muted || video.volume === 0);
};

const onOtherVideoPlay = (event: Event) => {
  const otherVideo = (
    event as CustomEvent<HTMLVideoElement>
  ).detail;

  if (otherVideo !== video) {
    video.pause();
  }
};

video.addEventListener('play', onPlay);
video.addEventListener('pause', onPause);
video.addEventListener('volumechange', onVolumeChange);
document.addEventListener('aura-video-play', onOtherVideoPlay);

return () => {
  video.removeEventListener('play', onPlay);
  video.removeEventListener('pause', onPause);
  video.removeEventListener('volumechange', onVolumeChange);
  document.removeEventListener(
    'aura-video-play',
    onOtherVideoPlay,
  );
};


}, [ref]);

// Background video: autoplay muted and keep the sound button
// above the video and other page elements.
if (!controls) {
return (
<> <video
       ref={ref}
       className={className}
       style={style}
       poster={poster}
       autoPlay={!manual}
       loop
       playsInline
       muted={isMuted}
       preload={preload}
       aria-label="Background video"
     > <source src={src} type="video/mp4" /> </video>


    {soundControl && (
      <button
        type="button"
        onClick={toggleMute}
        style={{
          position: 'fixed',
          right: '24px',
          bottom: '24px',
          zIndex: 99999,
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          backgroundColor: '#111111',
          color: '#ffffff',
          border: '2px solid #ffffff',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
          pointerEvents: 'auto',
        }}
        aria-label={isMuted ? 'Enable video sound' : 'Mute video'}
        title={isMuted ? 'Enable video sound' : 'Mute video'}
      >
        {isMuted ? (
          <VolumeX size={22} strokeWidth={2} />
        ) : (
          <Volume2 size={22} strokeWidth={2} />
        )}
      </button>
    )}

    {soundBlocked && (
      <div
        style={{
          position: 'fixed',
          right: '24px',
          bottom: '82px',
          zIndex: 100000,
          background: '#111111',
          color: '#ffffff',
          padding: '10px 14px',
          borderRadius: '8px',
          fontSize: '12px',
        }}
      >
        Sound could not start. Click the speaker again.
      </div>
    )}
  </>
);


}

// Service videos with playback and sound controls.
return ( <div className="relative w-full"> <video
     ref={ref}
     className={className}
     style={style}
     poster={poster}
     loop
     playsInline
     muted={isMuted}
     preload={preload}
     aria-label="Service video"
   > <source src={src} type="video/mp4" /> </video>


  {playing ? (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        ref.current?.pause();
      }}
      className="absolute bottom-4 right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-white bg-black text-white shadow-lg"
      aria-label="Pause video"
    >
      <Pause size={18} strokeWidth={2} />
    </button>
  ) : (
    <button
      type="button"
      onClick={toggle}
      className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 transition-colors hover:bg-black/30"
      aria-label="Play video with sound"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black shadow-lg">
        <Play size={24} strokeWidth={2} className="ml-1" />
      </span>
    </button>
  )}

  {soundControl && (
    <button
      type="button"
      onClick={toggleMute}
      className="absolute bottom-4 right-16 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-white bg-black text-white shadow-lg"
      aria-label={isMuted ? 'Enable video sound' : 'Mute video'}
      title={isMuted ? 'Enable video sound' : 'Mute video'}
    >
      {isMuted ? (
        <VolumeX size={18} strokeWidth={2} />
      ) : (
        <Volume2 size={18} strokeWidth={2} />
      )}
    </button>
  )}

  {soundBlocked && (
    <p className="absolute bottom-16 right-4 z-30 rounded bg-black px-3 py-2 text-xs text-white">
      Click the sound icon to try again.
    </p>
  )}
</div>


);
}

export const LazyVideo = memo(LazyVideoBase);
