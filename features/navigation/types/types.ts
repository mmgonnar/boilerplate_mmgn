import React from 'react';

export interface NavLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
  external?: boolean;
}

export interface NavConfig {
  public: NavLink[];
  authenticated: NavLink[];
  isFooter: boolean;
}
