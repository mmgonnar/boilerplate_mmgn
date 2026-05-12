import React from 'react';
import type { FC } from 'react';

export interface NavLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
  external?: boolean;
}

export interface NavConfig {
  public: NavLink[];
  authenticated: NavLink[];
  isFooter?: boolean;
}
export interface SocialMediaItem {
  icon: FC<{ className?: string }>;
  href: string;
  label: string;
  ariaLabel: string;
}
