const validatePassword = (password) => {
    // Check length
    if (password.length < 8) {
        return 'Password must be at least 8 characters long';
    }
  
    // Check for uppercase letters
    if (!/[A-Z]/.test(password)) {
        return 'Password must contain at least one uppercase letter';
    }
  
    // Check for lowercase letters
    if (!/[a-z]/.test(password)) {
        return 'Password must contain at least one lowercase letter';
    }
  
    // Check for numbers
    if (!/[0-9]/.test(password)) {
        return 'Password must contain at least one number';
    }
  
    // Check for special characters
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return 'Password must contain at least one special character';
    }
  
    // If all checks pass
    return null;
};
export default validatePassword;