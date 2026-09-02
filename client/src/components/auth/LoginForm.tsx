import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '../ui/Input';
import Button from '../ui/Button';
import { validateLogin } from '../../utils/validators.js';
import { loginThunk } from '../../redux/slices/authSlice.js';
import { useToast } from '../../hooks/useToast.js';

export default function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const toast = useToast();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateLogin(form) as unknown as Record<string, string>;
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSubmitting(true);
    try {
      const result = await dispatch(loginThunk(form));
      if (result.error) {
        const details = result.payload?.details;
        if (details) setErrors(details);
        else toast.error(result.payload?.message || 'Those details did not match');
      } else {
        navigate(params.get('redirect') || '/');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Input label="Email" type="email" name="email" value={form.email} onChange={onChange} error={errors.email} autoComplete="email" />
      <Input label="Password" type="password" name="password" value={form.password} onChange={onChange} error={errors.password} autoComplete="current-password" />
      <Button type="submit" loading={submitting} fullWidth size="lg">Log in</Button>
    </form>
  );
}
