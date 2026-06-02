import { DesignSystemPage } from '@/components/design-system';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Design System',
};

export default function Page() {
  return <DesignSystemPage />;
}
