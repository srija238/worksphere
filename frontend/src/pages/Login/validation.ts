// Email validation regex pattern
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation requirements
const PASSWORD_MIN_LENGTH = 6;

export interface ValidationErrors {
  email?: string;
  password?: string;
}

/**
 * Validate email format
 */
export const validateEmail = (email: string): string | undefined => {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return 'Email is required';
  }

  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return 'Please enter a valid email address';
  }

  return undefined;
};

/**
 * Validate password
 */
export const validatePassword = (password: string): string | undefined => {
  if (!password) {
    return 'Password is required';
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
  }

  return undefined;
};

/**
 * Validate login form
 */
export const validateLoginForm = (
  email: string,
  password: string
): ValidationErrors => {
  const errors: ValidationErrors = {};

  const emailError = validateEmail(email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    errors.password = passwordError;
  }

  return errors;
};

/**
 * Check if there are any validation errors
 */
export const hasValidationErrors = (errors: ValidationErrors): boolean => {
  return Object.values(errors).some((error) => error !== undefined);
};
