import { toast } from 'react-hot-toast';

import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ApiCallToastOptions {
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
