import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Input from '../shared/Input.jsx';
import Button from '../shared/Button.jsx';
import { validateSignup } from '../../utils/validators.js';
import { signupThunk } from '../../redux/slices/authSlice.js';
import { useToast } from '../../hooks/useToast.js';

export default function SignupForm() {
  const [params] = useSearchParams();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const onChange = (e) => {
    const { name, value } = e.target;
    const next = name === 'username' ? value.toLowerCase() : value;
    setForm((f) => ({ ...f, [name]: next }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validateSignup(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSubmitting(true);
    try {
      const result = await dispatch(signupThunk(form));
      if (result.error) {
        const serverDetails = result.payload?.details;
        if (serverDetails) setErrors(serverDetails);
        else toast.error(result.payload?.message || 'Signup failed');
      } else {
        toast.success('Welcome to FilmyAF! 🎬');
        navigate(params.get('redirect') || '/');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Input label="First name" name="firstName" value={form.firstName} onChange={onChange} error={errors.firstName} />
        <Input label="Last name" name="lastName" value={form.lastName} onChange={onChange} error={errors.lastName} />
      </div>
      <Input
        label="Username"
        name="username"
        value={form.username}
        onChange={onChange}
        error={errors.username}
        placeholder="e.g. gabbar07"
        autoComplete="username"
      />
      <Input label="Email" type="email" name="email" value={form.email} onChange={onChange} error={errors.email} autoComplete="email" />
      <Input label="Password" type="password" name="password" value={form.password} onChange={onChange} error={errors.password} autoComplete="new-password" />
      <Input label="Confirm password" type="password" name="confirmPassword" value={form.confirmPassword} onChange={onChange} error={errors.confirmPassword} autoComplete="new-password" />
      <Button type="submit" loading={submitting} className="w-full">
        Create account
      </Button>
      <p className="text-sm text-center text-bolly-paper/60">
        Already have an account?{' '}
        <Link to="/login" className="text-bolly-saffron hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
}
