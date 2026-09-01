import React from 'react';
import { Sparkles } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  icon: Icon = Sparkles,
  title = 'No items found',
  description = 'There is nothing to display here yet. Get started by creating or exploring new paths.',
  actionLabel,
  onAction,
  actionVariant = 'primary',
  actionIcon,
  customAction,
  className = '',
  ...props
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 ${className}`}
      {...props}
    >
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary-50 dark:bg-primary-950/60 border border-primary-100 dark:border-primary-800/60 flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4 shadow-sm">
        <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
      </div>

      <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white tracking-tight mb-1.5">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
          {description}
        </p>
      )}

      {customAction ? (
        customAction
      ) : actionLabel && onAction ? (
        <Button
          variant={actionVariant}
          onClick={onAction}
          leftIcon={actionIcon}
          size="md"
        >
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
