import { useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Move } from 'lucide-react';
import { defaultTransform, type MediaTransform } from '../../data/content';

type Props = {
  label: string;
  value: MediaTransform | undefined;
  onChange: (t: MediaTransform) => void;
};

const STEP = 10;
const ZOOM_STEP = 0.05;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;

export function MediaPositionEditor({ label, value, onChange }: Props) {
  const t: MediaTransform = value ?? defaultTransform;

  const set = (patch: Partial<MediaTransform>) =>
    onChange({ ...t, ...patch });

  const nudge = (dx: number, dy: number) =>
    set({ x: t.x + dx, y: t.y + dy });

  const previewRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; baseX: number; baseY: number } | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, baseX: t.x, baseY: t.y };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    set({ x: Math.round(dragRef.current.baseX + dx), y: Math.round(dragRef.current.baseY + dy) });
  };
  const onPointerUp = (e: React.PointerEvent) => {
    dragRef.current = null;
    try { (e.target as HTMLElement).releasePointerCapture(e.pointerId); } catch { /* noop */ }
  };

  return (
    <div className="border border-hairline bg-white p-3 space-y-3">
      <div className="flex items-center gap-2">
        <Move size={13} strokeWidth={1.5} className="text-charcoal" />
        <span className="text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-charcoal">
          {label} — Position & Zoom
        </span>
      </div>

      {/* Interactive preview */}
      <div
        ref={previewRef}
        className="relative w-full aspect-video bg-ink overflow-hidden border border-hairline cursor-grab active:cursor-grabbing touch-none select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="absolute inset-0"
          style={{
            transform: `translate(${t.x / 3}px, ${t.y / 3}px) scale(${t.zoom})`,
            transformOrigin: 'center center',
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-charcoal/40 via-ink/20 to-charcoal/40" />
        </div>
        <span className="absolute bottom-1.5 left-2 text-[0.6rem] text-white/50 tracking-wide pointer-events-none">
          Drag to reposition
        </span>
      </div>

      {/* Position d-pad */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center gap-1">
          <button type="button" onClick={() => nudge(0, -STEP)} className="dpad-btn">↑</button>
          <div className="flex gap-1">
            <button type="button" onClick={() => nudge(-STEP, 0)} className="dpad-btn">←</button>
            <button type="button" onClick={() => nudge(0, STEP)} className="dpad-btn">↓</button>
            <button type="button" onClick={() => nudge(STEP, 0)} className="dpad-btn">→</button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 flex-1">
          <label className="block">
            <span className="block text-[0.65rem] uppercase text-charcoal mb-1">Pos X</span>
            <input
              type="number"
              value={t.x}
              onChange={(e) => set({ x: Number(e.target.value) || 0 })}
              className="w-full bg-white border border-hairline px-2 py-1.5 text-xs text-ink focus:outline-none focus:border-ink"
            />
          </label>
          <label className="block">
            <span className="block text-[0.65rem] uppercase text-charcoal mb-1">Pos Y</span>
            <input
              type="number"
              value={t.y}
              onChange={(e) => set({ y: Number(e.target.value) || 0 })}
              className="w-full bg-white border border-hairline px-2 py-1.5 text-xs text-ink focus:outline-none focus:border-ink"
            />
          </label>
        </div>
      </div>

      {/* Zoom controls */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => set({ zoom: Math.max(MIN_ZOOM, +(t.zoom - ZOOM_STEP).toFixed(2)) })}
          className="flex items-center gap-1 text-xs px-2.5 py-1.5 border border-hairline text-charcoal hover:bg-ink hover:text-white transition-colors"
        >
          <ZoomOut size={13} strokeWidth={1.5} />
        </button>
        <input
          type="range"
          min={MIN_ZOOM}
          max={MAX_ZOOM}
          step={ZOOM_STEP}
          value={t.zoom}
          onChange={(e) => set({ zoom: Number(e.target.value) })}
          className="flex-1 accent-ink"
        />
        <button
          type="button"
          onClick={() => set({ zoom: Math.min(MAX_ZOOM, +(t.zoom + ZOOM_STEP).toFixed(2)) })}
          className="flex items-center gap-1 text-xs px-2.5 py-1.5 border border-hairline text-charcoal hover:bg-ink hover:text-white transition-colors"
        >
          <ZoomIn size={13} strokeWidth={1.5} />
        </button>
        <span className="text-xs text-charcoal tabular-nums w-12 text-right">{t.zoom.toFixed(2)}×</span>
      </div>

      {/* Reset */}
      <button
        type="button"
        onClick={() => onChange({ ...defaultTransform })}
        className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 border border-hairline text-charcoal hover:bg-ink hover:text-white transition-colors w-full justify-center"
      >
        <RotateCcw size={13} strokeWidth={1.5} />
        Reset Position & Zoom
      </button>
    </div>
  );
}
