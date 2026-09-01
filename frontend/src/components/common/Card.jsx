import React from 'react';

export default function Card({
  children,
  className = '',
  hoverEffect = true,
  padding = 'p-6',
  as: Component = 'div',
  onClick,
  ...props
}) {
  const hoverClasses = hoverEffect
    ? 'hover:shadow-card-hover dark:hover:shadow-card-hover-dark hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-0.5'
    : '';

  const clickableClasses = onClick ? 'cursor-pointer' : '';

  return (
    <Component
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-card shadow-card transition-all duration-200 ${hoverClasses} ${clickableClasses} ${padding} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800/80 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-lg font-semibold text-slate-900 dark:text-white tracking-tight ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-sm text-slate-500 dark:text-slate-400 mt-1 ${className}`}>
      {children}
    </p>
  );
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between ${className}`}>
      {children}
    </div>
  );
}
