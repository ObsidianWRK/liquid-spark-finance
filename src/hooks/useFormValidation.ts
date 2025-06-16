import { useState, useCallback } from 'react';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
  email?: boolean;
  number?: boolean;
  min?: number;
  max?: number;
}

export interface FieldConfig {
  [key: string]: ValidationRule;
}

export interface FormErrors {
  [key: string]: string;
}

export interface FormState<T> {
  values: T;
  errors: FormErrors;
  touched: { [key: string]: boolean };
  isValid: boolean;
  isSubmitting: boolean;
}

export const useFormValidation = <T extends Record<string, any>>(
  initialValues: T,
  validationRules: FieldConfig
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((name: string, value: any): string => {
    const rules = validationRules[name];
    if (!rules) return '';

    // Required validation
    if (rules.required && (!value || value.toString().trim() === '')) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }

    if (!value) return ''; // Skip other validations if empty and not required

    const stringValue = value.toString();

    // Email validation
    if (rules.email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(stringValue)) {
        return 'Please enter a valid email address';
      }
    }

    // Number validation
    if (rules.number) {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        return 'Please enter a valid number';
      }
      
      if (rules.min !== undefined && numValue < rules.min) {
        return `Value must be at least ${rules.min}`;
      }
      
      if (rules.max !== undefined && numValue > rules.max) {
        return `Value must be no more than ${rules.max}`;
      }
    }

    // Length validations
    if (rules.minLength && stringValue.length < rules.minLength) {
      return `Must be at least ${rules.minLength} characters`;
    }

    if (rules.maxLength && stringValue.length > rules.maxLength) {
      return `Must be no more than ${rules.maxLength} characters`;
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(stringValue)) {
      return 'Please enter a valid format';
    }

    // Custom validation
    if (rules.custom) {
      const customError = rules.custom(value);
      if (customError) return customError;
    }

    return '';
  }, [validationRules]);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(name => {
      const error = validateField(name, values[name as keyof T]);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validateField, validationRules]);

  const handleChange = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Validate field if it has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, values[name as keyof T]);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [values, validateField]);

  const handleSubmit = useCallback(async (onSubmit: (values: T) => Promise<void> | void) => {
    setIsSubmitting(true);
    
    // Mark all fields as touched
    const allTouched: { [key: string]: boolean } = {};
    Object.keys(validationRules).forEach(name => {
      allTouched[name] = true;
    });
    setTouched(allTouched);

    try {
      const isValid = validateForm();
      if (isValid) {
        await onSubmit(values);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm, validationRules]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const setFieldValue = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const setFieldError = useCallback((name: string, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  const getFieldProps = useCallback((name: string) => ({
    value: values[name as keyof T] || '',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      handleChange(name, e.target.value);
    },
    onBlur: () => handleBlur(name),
    error: errors[name],
    hasError: Boolean(errors[name] && touched[name]),
  }), [values, errors, touched, handleChange, handleBlur]);

  const isValid = Object.keys(errors).every(key => !errors[key]);

  return {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    validateForm,
    reset,
    setFieldValue,
    setFieldError,
    getFieldProps,
  };
};

// Predefined validation rules for common use cases
export const commonValidationRules = {
  email: {
    required: true,
    email: true,
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
  },
  phone: {
    pattern: /^\+?[\d\s\-\(\)]+$/,
  },
  amount: {
    required: true,
    number: true,
    min: 0,
  },
  percentage: {
    number: true,
    min: 0,
    max: 100,
  },
}; 