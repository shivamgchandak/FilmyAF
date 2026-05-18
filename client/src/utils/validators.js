const NAME_RE = /^[a-zA-Z\s'-]+$/;
const USERNAME_RE = /^[a-z0-9._]+$/;

export const validateSignup = ({
  firstName,
  lastName,
  username,
  email,
  password,
  confirmPassword,
}) => {
  const errs = {};
  if (!firstName || firstName.trim().length < 2) errs.firstName = 'First name must be 2+ chars';
  else if (!NAME_RE.test(firstName.trim())) errs.firstName = 'Letters only';

  if (!lastName || lastName.trim().length < 2) errs.lastName = 'Last name must be 2+ chars';
  else if (!NAME_RE.test(lastName.trim())) errs.lastName = 'Letters only';

  const u = (username || '').trim().toLowerCase();
  if (!u) errs.username = 'Username is required';
  else if (u.length < 3 || u.length > 20) errs.username = 'Username must be 3-20 characters';
  else if (!USERNAME_RE.test(u)) errs.username = 'Lowercase letters, digits, . and _ only';
  else if (/^[._]|[._]$/.test(u)) errs.username = 'Cannot start or end with . or _';
  else if (/[._]{2,}/.test(u)) errs.username = 'No consecutive . or _';

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errs.email = 'Enter a valid email';

  if (!password || password.length < 8)
    errs.password = 'Password must be 8+ chars';
  else if (!/^(?=.*[A-Za-z])(?=.*\d)/.test(password))
    errs.password = 'Need at least one letter and one number';

  if (confirmPassword !== password) errs.confirmPassword = 'Passwords do not match';

  return errs;
};

export const validateLogin = ({ email, password }) => {
  const errs = {};
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errs.email = 'Enter a valid email';
  if (!password) errs.password = 'Password is required';
  return errs;
};

export const validateSituation = (situation) => {
  if (!situation || situation.trim().length < 5) return 'Tell us a bit more (5+ characters)';
  if (situation.length > 500) return 'Keep it under 500 characters';
  return null;
};
