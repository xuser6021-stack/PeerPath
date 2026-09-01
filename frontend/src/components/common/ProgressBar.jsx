import React from 'react';

const VARIANTS = {
  primary: 'bg-primary-500',
  accent: 'bg-accent-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger: 'bg-danger-500',
};

const SIZES = {
  xs: 'h-1',
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export default function ProgressBar({
  value = 0,
  max = 100,
  variant = 'primary',
  size = 'md',
  showLabel = false,
  label = '',
  className = '',
  ...props
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const roundedPercentage = Math.round(percentage);

  // Auto-coloring based on health / completion score
  const getFillColor = () => {
    if (variant === 'auto') {
      if (percentage >= 80) return 'bg-success-500';
      if (percentage >= 50) return 'bg-warning-500';
      return 'bg-danger-500';
    }
    return VARIANTS[variant] || VARIANTS.primary;
  };

  const heightClass = SIZES[size] || SIZES.md;

  return (
    <div className={`w-full ${className}`} {...props}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
          <span>{label}</span>
          {showLabel && <span>{roundedPercentage}%</span>}
        </div>
      )}

      <div
        className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-800 ${heightClass}`}
        role="progressbar"
        aria-valuenow={roundedPercentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`${heightClass} ${getFillColor()} rounded-full transition-all duration-500 ease-out shadow-sm`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
