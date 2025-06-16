import { useState, useEffect } from 'react';

// Define proper types for form validation
interface ValidationRule<T = unknown> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | null;
}

interface FormField<T = unknown> {
  value: T;
  error: string | null;
  touched: boolean;
}

interface FormState<T extends Record<string, unknown>> {
  [K in keyof T]: FormField<T[K]>;
}

interface ValidationRules<T extends Record<string, unknown>> {
  [K in keyof T]?: ValidationRule<T[K]>;
}

// Enhanced form validation hook with proper typing
export const useFormValidation = <T extends Record<string, unknown>>(
  initialValues: T,
  validationRules: ValidationRules<T> = {}
) => {
  const [formState, setFormState] = useState<FormState<T>>(() => {
    const state = {} as FormState<T>;
    for (const key in initialValues) {
      state[key] = {
        value: initialValues[key],
        error: null,
        touched: false,
      };
    }
    return state;
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  // Validate a single field
  const validateField = <K extends keyof T>(name: K, value: T[K]): string | null => {
    const rules = validationRules[name];
    if (!rules) return null;

    // Required validation
    if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return `${String(name)} is required`;
    }

    // String-specific validations
    if (typeof value === 'string') {
      // Min length validation
      if (rules.minLength && value.length < rules.minLength) {
        return `${String(name)} must be at least ${rules.minLength} characters`;
      }

      // Max length validation
      if (rules.maxLength && value.length > rules.maxLength) {
        return `${String(name)} must be no more than ${rules.maxLength} characters`;
      }

      // Pattern validation
      if (rules.pattern && !rules.pattern.test(value)) {
        return `${String(name)} format is invalid`;
      }
    }

    // Custom validation
    if (rules.custom) {
      return rules.custom(value);
    }

    return null;
  };

  // Update field value and validation
  const setFieldValue = <K extends keyof T>(name: K, value: T[K]) => {
    setFormState(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        value,
        error: validateField(name, value),
        touched: true,
      },
    }));
  };

  // Mark field as touched
  const setFieldTouched = <K extends keyof T>(name: K) => {
    setFormState(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        touched: true,
      },
    }));
  };

  // Validate all fields
  const validateForm = (): boolean => {
    let isValid = true;
    const newState = { ...formState };

    for (const key in formState) {
      const error = validateField(key, formState[key].value);
      newState[key] = {
        ...newState[key],
        error,
        touched: true,
      };
      if (error) isValid = false;
    }

    setFormState(newState);
    return isValid;
  };

  // Get form values
  const getValues = (): T => {
    const values = {} as T;
    for (const key in formState) {
      values[key] = formState[key].value;
    }
    return values;
  };

  // Reset form
  const resetForm = () => {
    const state = {} as FormState<T>;
    for (const key in initialValues) {
      state[key] = {
        value: initialValues[key],
        error: null,
        touched: false,
      };
    }
    setFormState(state);
    setIsSubmitted(false);
  };

  // Check if form has errors
  const hasErrors = Object.values(formState).some(field => field.error !== null);

  // Check if form is touched
  const isTouched = Object.values(formState).some(field => field.touched);

  // Common validation patterns
  const validationPatterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\+?[\d\s-()]+$/,
    url: /^https?:\/\/.+/,
    alphanumeric: /^[a-zA-Z0-9]+$/,
    numeric: /^\d+$/,
    decimal: /^\d*\.?\d+$/,
  };

  return {
    formState,
    setFieldValue,
    setFieldTouched,
    validateForm,
    getValues,
    resetForm,
    hasErrors,
    isTouched,
    isSubmitted,
    setIsSubmitted,
    validationPatterns,
  };
};

export default useFormValidation; 