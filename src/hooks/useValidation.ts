import { useState } from 'react';

interface ValidationErrors {
  email?: string;
  fullName?: string;
  search?: string;
}

interface UseValidationReturn {
  errors: ValidationErrors;
  validateEmail: (email: string) => boolean;
  validateForm: (email: string, fullName: string) => boolean;
  validateSearchInput: (input: string) => string;
  setError: (field: keyof ValidationErrors, message: string) => void;
  clearError: (field: keyof ValidationErrors) => void;
}

export const useValidation = (): UseValidationReturn => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (email: string, fullName: string): boolean => {
    const newErrors: ValidationErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!fullName) {
      newErrors.fullName = 'Full name is required';
    } else if (fullName.trim().split(' ').length < 2) {
      newErrors.fullName = 'Please enter your full name';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSearchInput = (input: string): string => {
    return input.replace(/[^\w\s]/gi, '').trim();
  };

  const setError = (field: keyof ValidationErrors, message: string) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  };

  const clearError = (field: keyof ValidationErrors) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  return {
    errors,
    validateEmail,
    validateForm,
    validateSearchInput,
    setError,
    clearError,
  };
};