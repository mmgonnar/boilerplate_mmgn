import { toast } from 'react-hot-toast';

import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Internal links go through the locale-aware Link from @/i18n/navigation, which
// would otherwise prefix an absolute URL, a mailto or a bare hash with the locale.
const EXTERNAL_HREF_PATTERN = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i;

export function isExternalHref(href: string) {
  return EXTERNAL_HREF_PATTERN.test(href);
}

export type ApiCallToastOptions = {
  loading: string;
  successMessage: string;
  errorMessage: string;
  redirectTo?: string;
  router?: AppRouterInstance;
}

export function apiCallToast(
  fetch: Promise<unknown>,
  {
    loading,
    redirectTo,
    successMessage,
    errorMessage,
    router,
  }: ApiCallToastOptions,
) {
  return toast.promise(fetch, {
    loading: loading,
    success: (response: unknown) => {
      const res = response as { success?: boolean; message?: string } | null;

      if (res && res.success === false) {
        throw new Error(res.message || errorMessage);
      }
      if (redirectTo && router) {
        setTimeout(() => {
          router.push(redirectTo);
        }, 300);
      }
      return successMessage;
    },
    error: (error: Error) => error.message || errorMessage,
  });
}
