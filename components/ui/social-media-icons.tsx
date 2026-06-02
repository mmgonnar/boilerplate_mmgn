import * as React from 'react';
import { useId } from 'react';

type IconVariant = 'brand' | 'white';

type IconProps = {
  variant?: IconVariant;
} & React.SVGProps<SVGSVGElement>

// ─── GitHub ───────────────────────────────────────────────────────────────────
// Brand: #24292e (dark charcoal) / White: #ffffff
export const GithubIcon = ({ variant = 'brand', ...props }: IconProps) => (
  <svg
    viewBox="0 0 100 100"
    fill={variant === 'white' ? '#ffffff' : '#24292e'}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M41.4395 69.3848C28.8066 67.8535 19.9062 58.7617 19.9062 46.9902C19.9062 42.2051 21.6289 37.0371 24.5 33.5918C23.2559 30.4336 23.4473 23.7344 24.8828 20.959C28.7109 20.4805 33.8789 22.4902 36.9414 25.2656C40.5781 24.1172 44.4062 23.543 49.0957 23.543C53.7852 23.543 57.6133 24.1172 61.0586 25.1699C64.0254 22.4902 69.2891 20.4805 73.1172 20.959C74.457 23.543 74.6484 30.2422 73.4043 33.4961C76.4668 37.1328 78.0937 42.0137 78.0937 46.9902C78.0937 58.7617 69.1934 67.6621 56.3691 69.2891C59.623 71.3945 61.8242 75.9883 61.8242 81.252L61.8242 91.2051C61.8242 94.0762 64.2168 95.7031 67.0879 94.5547C84.4102 87.9512 98 70.6289 98 49.1914C98 22.1074 75.9883 6.69539e-07 48.9043 4.309e-07C21.8203 1.92261e-07 -1.9479e-07 22.1074 -4.3343e-07 49.1914C-6.20631e-07 70.4375 13.4941 88.0469 31.6777 94.6504C34.2617 95.6074 36.75 93.8848 36.75 91.3008L36.75 83.6445C35.4102 84.2188 33.6875 84.6016 32.1562 84.6016C25.8398 84.6016 22.1074 81.1563 19.4277 74.7441C18.375 72.1602 17.2266 70.6289 15.0254 70.3418C13.877 70.2461 13.4941 69.7676 13.4941 69.1934C13.4941 68.0449 15.4082 67.1836 17.3223 67.1836C20.0977 67.1836 22.4902 68.9063 24.9785 72.4473C26.8926 75.2227 28.9023 76.4668 31.2949 76.4668C33.6875 76.4668 35.2187 75.6055 37.4199 73.4043C39.0469 71.7773 40.291 70.3418 41.4395 69.3848Z" />
  </svg>
);

export const InstagramIcon = ({ variant = 'brand', ...props }: IconProps) => {
  const isWhite = variant === 'white';
  const gradientId = useId();

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {!isWhite && (
        <defs>
          <linearGradient
            id={gradientId}
            x1="8"
            y1="56"
            x2="56"
            y2="8"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#fed576" />
            <stop offset="0.26" stopColor="#f47133" />
            <stop offset="0.61" stopColor="#bc3081" />
            <stop offset="1" stopColor="#4c63d2" />
          </linearGradient>
        </defs>
      )}

      <rect
        x="8"
        y="8"
        width="48"
        height="48"
        rx="12"
        stroke={isWhite ? '#ffffff' : `url(#${gradientId})`}
        strokeWidth="5"
      />
      <circle
        cx="32"
        cy="32"
        r="10"
        stroke={isWhite ? '#ffffff' : `url(#${gradientId})`}
        strokeWidth="5"
      />
      <circle
        cx="46"
        cy="18"
        r="2"
        fill={isWhite ? '#ffffff' : `url(#${gradientId})`}
      />
    </svg>
  );
};
// ─── LinkedIn ─────────────────────────────────────────────────────────────────
// Brand: #0A66C2 / White: #ffffff
export const LinkedinIcon = ({ variant = 'brand', ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill={variant === 'white' ? '#ffffff' : '#0A66C2'}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

// ─── Mail ─────────────────────────────────────────────────────────────────────
// Brand: #EA4335 (Gmail red) / White: #ffffff
export const MailIcon = ({ variant = 'brand', ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke={variant === 'white' ? '#ffffff' : '#EA4335'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
    <rect x="2" y="4" width="20" height="16" rx="2" />
  </svg>
);

// ─── X (Twitter) ──────────────────────────────────────────────────────────────
// Brand: #000000 / White: #ffffff
export const XIcon = ({ variant = 'brand', ...props }: IconProps) => (
  <svg
    viewBox="0 0 64 64"
    fill={variant === 'white' ? '#ffffff' : '#000000'}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M37.97 27.1 61.283 0h-5.525L35.516 23.53 19.348 0H.7l24.449 35.582L.7 64h5.525l21.377-24.849L44.676 64h18.648L37.968 27.1Zm-7.567 8.795-2.477-3.543L8.216 4.16H16.7l15.906 22.753 2.478 3.543L55.76 60.03h-8.486L30.403 35.897Z" />
  </svg>
);
