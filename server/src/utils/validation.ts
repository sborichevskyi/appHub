const isPassword = (password: unknown): password is string => {
  if (typeof password !== 'string') {
    return false;
  }

  if (password.length < 8) {
    return false;
  }

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*_\-+=]/.test(password);

  return hasUpper && hasLower && hasNumber && hasSpecial;
};

const isEmail = (email: unknown): email is string => {
  if (typeof email !== 'string') {
    return false;
  }

  const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;

  return emailRegex.test(email);
};

export const validateService = {
  isPassword,
  isEmail,
};