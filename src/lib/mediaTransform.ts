import { defaultTransform, type MediaTransform } from '../data/content';

export function getTransform(t?: MediaTransform): MediaTransform {
  return t ?? defaultTransform;
}

export function transformStyle(t?: MediaTransform): React.CSSProperties {
  const { x, y, zoom } = getTransform(t);
  if (x === 0 && y === 0 && zoom === 1) return {};
  return {
    transform: `translate(${x}px, ${y}px) scale(${zoom})`,
    transformOrigin: 'center center',
  };
}
