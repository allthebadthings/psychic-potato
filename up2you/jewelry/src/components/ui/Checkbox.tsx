import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  className,
  label,
  error,
  id,
  disabled,
  ...props
}) => {
  const checkboxClasses = twMerge(
    clsx(
      'h-4 w-4 rounded border-neutral-300 text-primary-blue focus:ring-primary-blue transition duration-200 ease-in-out cursor-pointer',
      disabled && 'opacity-50 cursor-not-allowed',
      error && 'border-red-500',
      className
    )
  );

  const labelClasses = clsx(
    'ml-2 block text-sm text-neutral-700 select-none cursor-pointer',
    disabled && 'opacity-50 cursor-not-allowed'
  );

  return (
    <div className="flex items-start">
      <div className="flex h-5 items-center">
        <input
          type="checkbox"
          id={id}
          disabled={disabled}
          className={checkboxClasses}
          {...props}
        />
      </div>
      {label && (
        <label htmlFor={id} className={labelClasses}>
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
