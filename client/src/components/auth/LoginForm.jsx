import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Input from '../shared/Input.jsx';
import Button from '../shared/Button.jsx';
import { validateLogin } from '../../utils/validators.js';
import { loginThunk } from '../../redux/slices/authSlice.js';
import { useToast } from '../../hooks/useToast.js';

export default function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const toast = useToast();

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validateLogin(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSubmitting(true);
    try {
      const result = await dispatch(loginThunk(form));
      if (result.error) {
        const serverDetails = result.payload?.details;
        if (serverDetails) setErrors(serverDetails);
        else toast.error(result.payload?.message || 'Login failed');
      } else {
        toast.success('Welcome back! 🎬');
        navigate(params.get('redirect') || '/');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        label="Email"
        type="email"
        name="email"
        value={form.email}
        onChange={onChange}
        error={errors.email}
        autoComplete="email"
      />
      <Input
        label="Password"
        type="password"
        name="password"
        value={form.password}
        onChange={onChange}
        error={errors.password}
        autoComplete="current-password"
      />
      <Button type="submit" loading={submitting} className="w-full">
        Login
      </Button>
      <p className="text-sm text-center text-bolly-paper/60">
        No account?{' '}
        <Link to="/signup" className="text-bolly-saffron hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
