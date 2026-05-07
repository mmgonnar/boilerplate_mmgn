'use client';

import { useEffect, useState } from 'react';

import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';

import LogoDarkSVG from '@/components/assets/logo_dark.svg';
import LogoLightSVG from '@/components/assets/logo_light.svg';
import { Skeleton } from '@/components/ui';

interface LogoProps {
  size?: 'sm' | 'default' | 'lg';
}

const sizeMap = {
  sm: 'w-20',
  default: 'w-28',
  lg: 'w-36',
};

export function Logo({ size = 'default' }: LogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const width = sizeMap[size];

  if (!mounted) {
    return <Skeleton className={`${width} h-10 rounded-sm`} />;
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <Link
      href="/"
      className="relative inline-flex h-10 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
      aria-label="Ir al inicio"
    >
      <Image
        src={isDark ? LogoDarkSVG : LogoLightSVG}
        alt="mmgonnar logo"
        className={`${width} h-full object-contain`}
        priority
      />
    </Link>
  );
}
