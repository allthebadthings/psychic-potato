import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'new' | 'beta';
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
  dotColor?: 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange';
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'md',
  rounded = 'full',
  children,
  className,
  dot = false,
  dotColor = 'blue',
}) => {
  const baseClasses = 'inline-flex items-center font-medium transition-all duration-200';

  const variantClasses = {
    primary: 'bg-primary-blue text-white',
    secondary: 'bg-neutral-100 text-neutral-700',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    new: 'bg-blue-100 text-blue-800',
    beta: 'bg-purple-100 text-purple-800'
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  };

  const dotColorClasses = {
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  };

  const classes = twMerge(
    clsx(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      roundedClasses[rounded],
      className
    )
  );

  return (
    <span className={classes}>
      {dot && (
        <span className={`w-2 h-2 rounded-full ${dotColorClasses[dotColor]} mr-2`} />
      )}
      {children}
    </span>
  );
};

// Version badge component (like "v3.0.0 (beta)")
export interface VersionBadgeProps {
  version: string;
  status?: 'beta' | 'alpha' | 'stable' | 'new';
  className?: string;
}

export const VersionBadge: React.FC<VersionBadgeProps> = ({ 
  version, 
  status = 'stable', 
  className 
}) => {
  const statusConfig = {
    beta: { label: 'beta', variant: 'beta' as const },
    alpha: { label: 'alpha', variant: 'warning' as const },
    stable: { label: 'stable', variant: 'secondary' as const },
    new: { label: 'New', variant: 'new' as const }
  };

  const config = statusConfig[status];

  return (
    <div className={`inline-flex items-center space-x-2 ${className}`}>
      <span className="text-sm text-neutral-600 underline decoration-neutral-400">
        {version}
      </span>
      {status !== 'stable' && (
        <Badge variant={config.variant} size="sm">
          {config.label}
        </Badge>
      )}
    </div>
  );
};

// Status indicator component (like "By John" with colored dot)
export interface StatusIndicatorProps {
  text: string;
  color: 'red' | 'blue' | 'green' | 'yellow' | 'purple';
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ 
  text, 
  color, 
  className 
}) => {
  return (
    <div className={`flex items-center space-x-2 text-sm text-neutral-600 ${className}`}>
      <div className={`w-2 h-2 rounded-full ${
        color === 'red' ? 'bg-red-500' :
        color === 'blue' ? 'bg-blue-500' :
        color === 'green' ? 'bg-green-500' :
        color === 'yellow' ? 'bg-yellow-500' :
        'bg-purple-500'
      }`} />
      <span>{text}</span>
    </div>
  );
};

export default Badge;
