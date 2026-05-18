import { body } from 'express-validator';

const nameField = (field, label) =>
  body(field)
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage(`${label} must be 2-30 characters`)
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage(`${label} can only contain letters, spaces, hyphens, apostrophes`);

export const signupValidator = [
  nameField('firstName', 'First name'),
  nameField('lastName', 'Last name'),
  body('username')
    .trim()
    .customSanitizer((v) => (typeof v === 'string' ? v.toLowerCase() : v))
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be 3-20 characters')
    .matches(/^[a-z0-9._]+$/)
    .withMessage('Only lowercase letters, digits, dots and underscores')
    .custom((val) => {
      if (/^[._]|[._]$/.test(val))
        throw new Error('Username cannot start or end with . or _');
      if (/[._]{2,}/.test(val))
        throw new Error('No consecutive dots or underscores');
      return true;
    }),
  body('email').trim().isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
    .withMessage('Password must contain at least one letter and one number'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) throw new Error('Passwords do not match');
    return true;
  }),
];

export const loginValidator = [
  body('email').trim().isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').isString().isLength({ min: 1 }).withMessage('Password is required'),
];
