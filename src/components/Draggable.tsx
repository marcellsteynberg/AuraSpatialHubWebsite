import { useRef, type ReactNode, type CSSProperties } from 'react';
import { useContent } from '../context/ContentContext';

/**
 * Wraps any element so it can be drag-repositioned when Move Mode is active.
 *
 * - Outside Move Mode: renders children untouched (no wrapper styles, no
 *   transform), so the site looks and behaves exactly as designed.
 * - Inside Move Mode: applies a dashed outline + cursor, translates the
 *   element by its saved offset, and captures pointer events to drag.
 *
 * Positions are stored as pixel offsets relative to the element's natural
 * flow position and persisted to Supabase on drag end.
 */
export function Draggable({
  id,
  children,
  className = '',
  style,
  dark = false,
}: {
  id: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  dark?: boolean;
}) {
  const { editMode, positions, dragPosition, savePosition } = useContent();
  const dragging = useRef(false);
  const start = useRef({ px: 0, py: 0, ox: 0, oy: 0 });
  const pos = positions[id] ?? { x: 0, y: 0 };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!editMode) return;
    e.preventDefault();
    e.stopPropagation();
    dragging.current = true;
    start.current = { px: e.clientX, py: e.clientY, ox: pos.x, oy: pos.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - start.current.px;
    const dy = e.clientY - start.current.py;
    dragPosition(id, { x: start.current.ox + dx, y: start.current.oy + dy });
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    dragging.current = false;
    const dx = e.clientX - start.current.px;
    const dy = e.clientY - start.current.py;
    const final = { x: start.current.ox + dx, y: start.current.oy + dy };
    dragPosition(id, final);
    savePosition(id, final);
  };

  if (!editMode) {
    return <div className={className} style={style}>{children}</div>;
  }

  return (
    <div
      className={`relative ${editMode ? `draggable-item${dark ? ' draggable-item-dark' : ''}` : ''} ${className}`}
      style={{
        ...style,
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        touchAction: 'none',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {children}
    </div>
  );
}
