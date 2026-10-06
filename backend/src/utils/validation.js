export function validateName(name) {
  if (typeof name !== 'string') {
    return { isValid: false, message: 'Name must be a valid text string.' };
  }
  const trimmed = name.trim();
  if (trimmed.length < 20 || trimmed.length > 60) {
    return {
      isValid: false,
      message: `Name must be between 20 and 60 characters in length. Current length: ${trimmed.length}.`,
    };
  }
  return { isValid: true };
}

export function validateEmail(email) {
  if (typeof email !== 'string') {
    return { isValid: false, message: 'Email must be a valid text string.' };
  }
  const trimmed = email.trim();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, message: 'Email address must follow standard format (e.g., user@example.com).' };
  }
  return { isValid: true };
}

export function validatePassword(password) {
  if (typeof password !== 'string') {
    return { isValid: false, message: 'Password must be a valid string.' };
  }
  if (password.length < 8 || password.length > 16) {
    return {
      isValid: false,
      message: `Password must be between 8 and 16 characters. Current length: ${password.length}.`,
    };
  }
  const hasUppercase = /[A-Z]/.test(password);
  if (!hasUppercase) {
    return { isValid: false, message: 'Password must include at least one uppercase letter.' };
  }
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password);
  if (!hasSpecialChar) {
    return {
      isValid: false,
      message: 'Password must include at least one special character (e.g., !@#$%^&*).',
    };
  }
  return { isValid: true };
}

export function validateAddress(address) {
  if (typeof address !== 'string') {
    return { isValid: false, message: 'Address must be a valid text string.' };
  }
  const trimmed = address.trim();
  if (trimmed.length === 0) {
    return { isValid: false, message: 'Address is required.' };
  }
  if (trimmed.length > 400) {
    return {
      isValid: false,
      message: `Address cannot exceed 400 characters. Current length: ${trimmed.length}.`,
    };
  }
  return { isValid: true };
}

export function validateRating(rating) {
  const num = Number(rating);
  if (!Number.isInteger(num) || num < 1 || num > 5) {
    return { isValid: false, message: 'Rating must be an integer between 1 and 5.' };
  }
  return { isValid: true };
}
