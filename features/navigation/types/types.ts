import React from 'react';
import type { FC } from 'react';

export type NavLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
  external?: boolean;
}

export type NavConfig = {
  public: NavLink[];
  authenticated: NavLink[];
  isFooter?: boolean;
}
export type SocialMediaItem = {
  icon: FC<{ className?: string }>;
  href: string;
  label: string;
  ariaLabel: string;
}
