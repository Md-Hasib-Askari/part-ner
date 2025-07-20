import React, { useState, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Search, X, Calendar } from 'lucide-react';

// Enhanced Input with Label and Error
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helper?: string;
    required?: boolean;
    inputClassName?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
    ({ label, error, helper, required, className, inputClassName, id, ...props }, ref) => {
        const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

        return (
            <div className={cn('space-y-2', className)}>
                {label && (
                    <Label htmlFor={inputId} className={cn(required && 'after:content-["*"] after:ml-0.5 after:text-destructive')}>
                        {label}
                    </Label>
                )}
                <Input
                    id={inputId}
                    ref={ref}
                    className={cn(
                        error && 'border-destructive focus-visible:ring-destructive',
                        inputClassName
                    )}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined}
                    {...props}
                />
                {error && (
                    <p id={`${inputId}-error`} className="text-sm text-destructive">
                        {error}
                    </p>
                )}
                {helper && !error && (
                    <p id={`${inputId}-helper`} className="text-sm text-muted-foreground">
                        {helper}
                    </p>
                )}
            </div>
        );
    }
);

FormInput.displayName = 'FormInput';

// Password Input with Toggle
interface PasswordInputProps extends Omit<FormInputProps, 'type'> {
    showToggle?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ showToggle = true, className, inputClassName, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);

        return (
            <div className={cn('relative', className)}>
                <FormInput
                    ref={ref}
                    type={showPassword ? 'text' : 'password'}
                    inputClassName={cn(showToggle && 'pr-10', inputClassName)}
                    {...props}
                />
                {showToggle && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-8 h-8 w-8 p-0 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">
                            {showPassword ? 'Hide password' : 'Show password'}
                        </span>
                    </Button>
                )}
            </div>
        );
    }
);

PasswordInput.displayName = 'PasswordInput';

// Search Input with Clear Button
interface SearchInputProps extends Omit<FormInputProps, 'type'> {
    onClear?: () => void;
    showClearButton?: boolean;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
    ({ onClear, showClearButton = true, className, inputClassName, ...props }, ref) => {
        const [value, setValue] = useState(props.defaultValue || '');

        const handleClear = () => {
            setValue('');
            onClear?.();
        };

        return (
            <div className={cn('relative', className)}>
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    ref={ref}
                    type="search"
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                        props.onChange?.(e);
                    }}
                    className={cn('pl-10', showClearButton && value && 'pr-10', inputClassName)}
                    {...props}
                />
                {showClearButton && value && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-1/2 h-8 w-8 -translate-y-1/2 p-0 hover:bg-transparent"
                        onClick={handleClear}
                        tabIndex={-1}
                    >
                        <X className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Clear search</span>
                    </Button>
                )}
            </div>
        );
    }
);

SearchInput.displayName = 'SearchInput';

// Textarea with Character Count
interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helper?: string;
    required?: boolean;
    maxLength?: number;
    showCount?: boolean;
    textareaClassName?: string;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
    ({
        label,
        error,
        helper,
        required,
        maxLength,
        showCount = true,
        className,
        textareaClassName,
        id,
        value,
        onChange,
        ...props
    }, ref) => {
        const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
        const [currentLength, setCurrentLength] = useState(
            typeof value === 'string' ? value.length : 0
        );

        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setCurrentLength(e.target.value.length);
            onChange?.(e);
        };

        return (
            <div className={cn('space-y-2', className)}>
                {label && (
                    <Label htmlFor={inputId} className={cn(required && 'after:content-["*"] after:ml-0.5 after:text-destructive')}>
                        {label}
                    </Label>
                )}
                <Textarea
                    id={inputId}
                    ref={ref}
                    value={value}
                    onChange={handleChange}
                    maxLength={maxLength}
                    className={cn(
                        error && 'border-destructive focus-visible:ring-destructive',
                        textareaClassName
                    )}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined}
                    {...props}
                />

                <div className="flex justify-between">
                    <div>
                        {error && (
                            <p id={`${inputId}-error`} className="text-sm text-destructive">
                                {error}
                            </p>
                        )}
                        {helper && !error && (
                            <p id={`${inputId}-helper`} className="text-sm text-muted-foreground">
                                {helper}
                            </p>
                        )}
                    </div>

                    {showCount && maxLength && (
                        <p className={cn(
                            'text-sm',
                            currentLength > maxLength * 0.9
                                ? 'text-destructive'
                                : 'text-muted-foreground'
                        )}>
                            {currentLength}/{maxLength}
                        </p>
                    )}
                </div>
            </div>
        );
    }
);

FormTextarea.displayName = 'FormTextarea';

// Date Input
interface DateInputProps extends Omit<FormInputProps, 'type'> {
    format?: 'date' | 'datetime-local' | 'time';
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
    ({ format = 'date', className, inputClassName, ...props }, ref) => {
        return (
            <div className={cn('relative', className)}>
                <FormInput
                    ref={ref}
                    type={format}
                    inputClassName={cn('pr-10', inputClassName)}
                    {...props}
                />
                <Calendar className="absolute right-3 top-10 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
        );
    }
);

DateInput.displayName = 'DateInput';

// Number Input with Increment/Decrement
interface NumberInputProps extends Omit<FormInputProps, 'type'> {
    min?: number;
    max?: number;
    step?: number;
    showControls?: boolean;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
    ({ min, max, step = 1, showControls = false, className, inputClassName, ...props }, ref) => {
        const [value, setValue] = useState<number>(
            typeof props.defaultValue === 'number' ? props.defaultValue : 0
        );

        const increment = () => {
            const newValue = value + step;
            if (max === undefined || newValue <= max) {
                setValue(newValue);
            }
        };

        const decrement = () => {
            const newValue = value - step;
            if (min === undefined || newValue >= min) {
                setValue(newValue);
            }
        };

        if (!showControls) {
            return (
                <FormInput
                    ref={ref}
                    type="number"
                    min={min}
                    max={max}
                    step={step}
                    className={className}
                    inputClassName={inputClassName}
                    {...props}
                />
            );
        }

        return (
            <div className={cn('relative', className)}>
                <FormInput
                    ref={ref}
                    type="number"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    min={min}
                    max={max}
                    step={step}
                    inputClassName={cn('pr-16', inputClassName)}
                    {...props}
                />
                <div className="absolute right-1 top-8 flex flex-col">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-6 p-0 text-xs"
                        onClick={increment}
                        disabled={max !== undefined && value >= max}
                        tabIndex={-1}
                    >
                        +
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-6 p-0 text-xs"
                        onClick={decrement}
                        disabled={min !== undefined && value <= min}
                        tabIndex={-1}
                    >
                        -
                    </Button>
                </div>
            </div>
        );
    }
);

NumberInput.displayName = 'NumberInput';

// File Input with Preview
interface FileInputProps extends Omit<FormInputProps, 'type' | 'onChange'> {
    accept?: string;
    multiple?: boolean;
    onChange?: (files: FileList | null) => void;
    showPreview?: boolean;
    maxSize?: number; // in MB
}

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
    ({
        accept,
        multiple,
        onChange,
        showPreview = true,
        maxSize,
        className,
        inputClassName,
        error: externalError,
        ...props
    }, ref) => {
        const [files, setFiles] = useState<FileList | null>(null);
        const [error, setError] = useState<string>('');

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const selectedFiles = e.target.files;
            setError('');

            if (selectedFiles && maxSize) {
                for (let i = 0; i < selectedFiles.length; i++) {
                    if (selectedFiles[i].size > maxSize * 1024 * 1024) {
                        setError(`File ${selectedFiles[i].name} exceeds ${maxSize}MB limit`);
                        return;
                    }
                }
            }

            setFiles(selectedFiles);
            onChange?.(selectedFiles);
        };

        return (
            <div className={className}>
                <FormInput
                    ref={ref}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleChange}
                    error={error || externalError}
                    inputClassName={inputClassName}
                    {...props}
                />

                {showPreview && files && files.length > 0 && (
                    <div className="mt-2 space-y-1">
                        {Array.from(files).map((file, index) => (
                            <div key={index} className="flex items-center justify-between rounded border p-2 text-sm">
                                <span className="truncate">{file.name}</span>
                                <span className="text-muted-foreground">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }
);

FileInput.displayName = 'FileInput';
