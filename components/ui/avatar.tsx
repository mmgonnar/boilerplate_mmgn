'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

import { Skeleton } from './skeleton';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  fallbackText?: string;
  size?: AvatarSize;
  isLoading?: boolean;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-12 w-12 text-sm',
  lg: 'h-24 w-24 text-xl',
  xl: 'h-32 w-32 text-2xl',
};

export function Avatar({
  src,
  alt = 'User avatar',
  fallbackText,
  size = 'md',
  isLoading = false,
  className,
  ...props
}: AvatarProps) {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setHasError(false);
  }, [src]);

  if (isLoading) {
    return <Skeleton className={`${size} h-10 rounded-sm`} />;
  }

  const initials = fallbackText
    ? fallbackText
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : null;

  return (
    <div
      className={cn(
        'relative flex shrink-0 overflow-hidden rounded-full border border-border bg-accent text-accent-foreground items-center justify-center font-mono font-bold select-none',
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {src && !hasError ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover aspect-square"
          onError={() => setHasError(true)}
        />
      ) : initials ? (
        <span>{initials}</span>
      ) : (
        <User className="h-1/2 w-1/2 text-muted-foreground" />
      )}
    </div>
  );
}
