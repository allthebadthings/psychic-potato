import React, { useRef, useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Button from './Button';

export interface FileInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  label?: string;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  multiple?: boolean;
}

const FileInput: React.FC<FileInputProps> = ({
  className,
  label,
  error,
  id,
  disabled,
  onChange,
  accept,
  multiple,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files.length === 1) {
        setFileName(e.target.files[0].name);
      } else {
        setFileName(`${e.target.files.length} files selected`);
      }
    } else {
      setFileName('');
    }
    onChange?.(e);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const containerClasses = twMerge(
    clsx(
      'w-full',
      className
    )
  );

  return (
    <div className={containerClasses}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="file"
          id={id}
          className="hidden"
          onChange={handleChange}
          disabled={disabled}
          accept={accept}
          multiple={multiple}
          {...props}
        />
        <Button
          type="button"
          variant="secondary"
          onClick={handleClick}
          disabled={disabled}
          className="whitespace-nowrap"
        >
          Choose File
        </Button>
        <div className={clsx(
          "flex items-center px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-600 w-full truncate",
          disabled && "bg-neutral-100 text-neutral-400"
        )}>
          {fileName || "No file chosen"}
        </div>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default FileInput;
