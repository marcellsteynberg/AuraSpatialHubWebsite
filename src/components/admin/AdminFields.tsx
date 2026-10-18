import type { ReactNode } from 'react';

/** Shared admin form primitives — small, consistent inputs styled to match. */

export function AdminField({
  label,
  value,
  onChange,
  textarea,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="block text-[0.7rem] font-medium tracking-wide uppercase text-charcoal mb-1.5">
        {label}
      </span>
      {textarea ? (
        <textarea
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full bg-white border border-hairline px-3 py-2 text-sm text-ink focus:outline-none focus:border-ink transition-colors resize-y min-h-[80px]"
        />
      ) : (
        <input
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white border border-hairline px-3 py-2 text-sm text-ink focus:outline-none focus:border-ink transition-colors"
        />
      )}
    </label>
  );
}

export function AdminVideoSettings({
  volume,
  onVolumeChange,
}: {
  volume: number;
  onVolumeChange: (volume: number) => void;
}) {
  return (
    <div className="border border-hairline bg-white p-3 space-y-3">
      <span className="block text-[0.7rem] font-medium tracking-wide uppercase text-charcoal">
        Video Sound
      </span>
      <label className="block">
        <span className="flex items-center justify-between text-xs text-charcoal mb-1.5">
          <span>Starting volume</span>
          <span>{Math.round(volume * 100)}%</span>
        </span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(event) => onVolumeChange(Number(event.target.value))}
          className="w-full accent-ink"
        />
      </label>
      <p className="text-[0.7rem] leading-relaxed text-charcoal/70">
        Sound starts with the video when browser autoplay permissions allow it.
      </p>
    </div>
  );
}

export function AdminSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="block text-[0.7rem] font-medium tracking-wide uppercase text-charcoal mb-1.5">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border border-hairline px-3 py-2 text-sm text-ink focus:outline-none focus:border-ink transition-colors"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

export function AdminGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border border-hairline bg-offwhite/60 p-4 space-y-3">
      <span className="block text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-charcoal">
        {title}
      </span>
      {children}
    </div>
  );
}

export function AdminListControls({
  onAdd,
  onRemove,
  onMoveUp,
  onMoveDown,
  canUp,
  canDown,
}: {
  onAdd: () => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canUp: boolean;
  canDown: boolean;
}) {
  return (
    <div className="flex items-center gap-2 pt-2">
      <button
        type="button"
        onClick={onMoveUp}
        disabled={!canUp}
        className="text-xs px-2 py-1 border border-hairline text-charcoal hover:bg-ink hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-charcoal transition-colors"
        aria-label="Move up"
      >
        ↑
      </button>
      <button
        type="button"
        onClick={onMoveDown}
        disabled={!canDown}
        className="text-xs px-2 py-1 border border-hairline text-charcoal hover:bg-ink hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-charcoal transition-colors"
        aria-label="Move down"
      >
        ↓
      </button>
      <button
        type="button"
        onClick={onRemove}
        className="text-xs px-2 py-1 border border-hairline text-charcoal hover:bg-ink hover:text-white transition-colors ml-auto"
      >
        Remove
      </button>
      <button
        type="button"
        onClick={onAdd}
        className="text-xs px-2 py-1 border border-hairline text-charcoal hover:bg-ink hover:text-white transition-colors"
      >
        + Add
      </button>
    </div>
  );
}
