import React from 'react';

export default function Skeleton({
  variant = 'rectangular',
  width,
  height,
  className = '',
  count = 1,
  ...props
}) {
  const baseClasses = 'animate-pulse bg-slate-200 dark:bg-slate-800';

  const getVariantClasses = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full shrink-0';
      case 'text':
        return 'rounded-md h-4 my-1';
      case 'card':
        return 'rounded-card border border-slate-200/60 dark:border-slate-800 h-48';
      case 'badge':
        return 'rounded-full h-6 w-16';
      case 'rectangular':
      default:
        return 'rounded-xl';
    }
  };

  const style = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  if (count > 1) {
    return (
      <div className="space-y-2.5 w-full">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${getVariantClasses()} ${className}`}
            style={style}
            {...props}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${getVariantClasses()} ${className}`}
      style={style}
      {...props}
    />
  );
}
