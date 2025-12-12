import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  label?: string;
  required?: boolean;
  icon?: React.ReactNode;
  rounded?: 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md';
  error?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  autoComplete?: string;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  label,
  required = false,
  icon,
  rounded = 'lg',
  shadow = 'sm',
  error,
  value,
  onChange,
  className,
  id,
  name,
  disabled = false,
  autoComplete,
}) => {
  const baseInputClasses = 'w-full bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg'
  };

  const shadowClasses = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md'
  };

  const stateClasses = error 
    ? 'border-red-500 focus:ring-red-500' 
    : 'border-neutral-200';

  const inputClasses = twMerge(
    clsx(
      baseInputClasses,
      roundedClasses[rounded],
      shadowClasses[shadow],
      stateClasses,
      icon ? 'pl-10 pr-4 py-3' : 'px-4 py-3',
      'border'
    )
  );

  const containerClasses = twMerge(
    clsx(
      'relative',
      className
    )
  );

  const labelClasses = clsx(
    'block text-sm font-medium text-neutral-700 mb-2',
    required && "after:content-['*'] after:text-red-500 after:ml-1"
  );

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={id} className={labelClasses}>
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="h-5 w-5 text-neutral-400">
              {icon}
            </div>
          </div>
        )}
        
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      </div>

      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

// Specialized email input with built-in email icon
export const EmailInput: React.FC<Omit<InputProps, 'icon' | 'type'>> = (props) => {
  return (
    <Input
      {...props}
      type="email"
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      }
    />
  );
};

// Specialized password input with toggle visibility
export const PasswordInput: React.FC<Omit<InputProps, 'icon' | 'type'>> = (props) => {
  const [showPassword] = React.useState(false);

  return (
    <Input
      {...props}
      type={showPassword ? 'text' : 'password'}
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      }
    />
  );
};

export default Input;
