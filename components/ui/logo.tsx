import Link from 'next/link';

import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'default' | 'lg';
}

const sizeMap = {
  sm: { svg: 'h-6 w-6', text: 'text-base' },
  default: { svg: 'h-8 w-8', text: 'text-lg' },
  lg: { svg: 'h-10 w-10', text: 'text-xl' },
};

export function Logo({
  className,
  showText = true,
  size = 'default',
}: LogoProps) {
  const { svg, text } = sizeMap[size];

  return (
    <Link
      href="/"
      className={cn(
        'flex items-center gap-2',
        'focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm',
        className,
      )}
      aria-label="Ir al inicio"
    >
      {/* ✅ SVG inline — reemplaza con tu isotipo real */}
      <svg
        className={cn(svg, 'shrink-0')}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="32" height="32" rx="8" className="fill-primary" />
        <path
          d="M8 16L14 22L24 10"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {showText && (
        <span className={cn('font-bold text-foreground', text)}>
          Boilerplate
        </span>
      )}
    </Link>
  );
}
