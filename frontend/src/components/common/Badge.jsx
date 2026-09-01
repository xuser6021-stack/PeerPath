import React from 'react';

const VARIANTS = {
  primary:
    'bg-primary-50 text-primary-700 border-primary-200/60 dark:bg-primary-950/50 dark:text-primary-300 dark:border-primary-800/50',
  accent:
    'bg-accent-50 text-accent-700 border-accent-200/60 dark:bg-accent-950/50 dark:text-accent-300 dark:border-accent-800/50',
  neutral:
    'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700/60',
  success:
    'bg-success-50 text-success-700 border-success-200/60 dark:bg-success-950/50 dark:text-success-300 dark:border-success-800/50',
  warning:
    'bg-warning-50 text-warning-700 border-warning-200/60 dark:bg-warning-950/50 dark:text-warning-300 dark:border-warning-800/50',
  danger:
    'bg-danger-50 text-danger-700 border-danger-200/60 dark:bg-danger-950/50 dark:text-danger-300 dark:border-danger-800/50',
  // Specific "Must Learn" vs "Nice to Have" pill styles
  must:
    'bg-primary-100/80 text-primary-900 border-primary-300 font-semibold dark:bg-primary-900/60 dark:text-primary-100 dark:border-primary-700',
  nice:
    'bg-teal-50 text-teal-800 border-teal-200 font-medium dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/60',
};

const DOT_COLORS = {
  primary: 'bg-primary-500',
  accent: 'bg-accent-500',
  neutral: 'bg-slate-400 dark:bg-slate-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger: 'bg-danger-500',
  must: 'bg-primary-600 dark:bg-primary-400',
  nice: 'bg-teal-500',
};

const SIZES = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

export default function Badge({
  children,
  variant = 'neutral',
  size = 'sm',
  dot = false,
  className = '',
  icon: Icon,
  ...props
}) {
  const variantClass = VARIANTS[variant] || VARIANTS.neutral;
  const dotColor = DOT_COLORS[variant] || DOT_COLORS.neutral;
  const sizeClass = SIZES[size] || SIZES.sm;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-full tracking-wide transition-colors ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />}
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      {children}
    </span>
  );
}
