import React from 'react';

const AVATAR_PALETTES = [
  'bg-primary-500 text-white',
  'bg-accent-500 text-white',
  'bg-emerald-500 text-white',
  'bg-amber-500 text-white',
  'bg-rose-500 text-white',
  'bg-violet-500 text-white',
  'bg-cyan-500 text-white',
  'bg-blue-600 text-white',
];

const SIZES = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

function getInitials(name) {
  if (!name || typeof name !== 'string') return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getDeterministicColor(name) {
  if (!name) return AVATAR_PALETTES[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_PALETTES.length;
  return AVATAR_PALETTES[index];
}

export default function Avatar({
  name = '',
  src,
  size = 'md',
  status,
  className = '',
  ...props
}) {
  const initials = getInitials(name);
  const colorClass = getDeterministicColor(name);
  const sizeClass = SIZES[size] || SIZES.md;

  const statusDotSizes = {
    xs: 'w-1.5 h-1.5 ring-1',
    sm: 'w-2 h-2 ring-1.5',
    md: 'w-2.5 h-2.5 ring-2',
    lg: 'w-3 h-3 ring-2',
    xl: 'w-3.5 h-3.5 ring-2',
  };

  const statusColor = {
    online: 'bg-success-500',
    busy: 'bg-danger-500',
    away: 'bg-warning-500',
    offline: 'bg-slate-400',
  }[status];

  return (
    <div className={`relative inline-flex shrink-0 select-none ${className}`} {...props}>
      {src ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          className={`${sizeClass} rounded-full object-cover ring-2 ring-white dark:ring-slate-900`}
        />
      ) : (
        <div
          className={`${sizeClass} ${colorClass} rounded-full flex items-center justify-center font-semibold tracking-wider shadow-sm ring-2 ring-white dark:ring-slate-900`}
          title={name}
        >
          {initials}
        </div>
      )}

      {status && statusColor && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ring-white dark:ring-slate-900 ${statusColor} ${
            statusDotSizes[size] || statusDotSizes.md
          }`}
        />
      )}
    </div>
  );
}
