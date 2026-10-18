import type { SVGProps } from 'react';

interface TikTokProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

export function TikTok({ size = 24, ...props }: TikTokProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size}
      height={size}
      {...props}
    >
      <path d="M16.5 3c.3 2.1 1.5 3.5 3.5 3.7v2.4c-1.3.1-2.5-.3-3.5-1v6.6c0 3.4-2.8 5.8-5.9 5.3-2.4-.4-4.2-2.5-4.1-5 .1-2.6 2.3-4.7 4.9-4.5.3 0 .6.1.8.2v2.6c-.3-.1-.6-.2-.9-.2-1.3 0-2.4 1.1-2.3 2.4.1 1.2 1.1 2.1 2.3 2.1 1.3 0 2.4-1 2.4-2.4V3h2.8z" />
    </svg>
  );
}
