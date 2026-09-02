import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '../ui/Input';
import Button from '../ui/Button';
import { validateSignup } from '../../utils/validators.js';
import { signupThunk } from '../../redux/slices/authSlice.js';
import { useToast } from '../../hooks/useToast.js';

const EMPTY = {
  firstName: '', lastName: '', username: '', email: '', password: '', confirmPassword: '',
};

export default function SignupForm() {
  const [params] = useSearchParams();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const toast = useToast();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === 'username' ? value.toLowerCase() : value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateSignup(form) as unknown as Record<string, string>;
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSubmitting(true);
    try {
      const result = await dispatch(signupThunk(form));
      if (result.error) {
        const details = result.payload?.details;
        if (details) setErrors(details);
        else toast.error(result.payload?.message || 'Could not create the account');
      } else {
        navigate(params.get('redirect') || '/');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Input label="First name" name="firstName" value={form.firstName} onChange={onChange} error={errors.firstName} />
        <Input label="Last name" name="lastName" value={form.lastName} onChange={onChange} error={errors.lastName} />
      </div>
      <Input label="Username" name="username" value={form.username} onChange={onChange} error={errors.username} placeholder="gabbar07" autoComplete="username" hint="Lowercase letters, digits, dots and underscores" />
      <Input label="Email" type="email" name="email" value={form.email} onChange={onChange} error={errors.email} autoComplete="email" />
      <Input label="Password" type="password" name="password" value={form.password} onChange={onChange} error={errors.password} autoComplete="new-password" hint="At least 8 characters, with a letter and a number" />
      <Input label="Confirm password" type="password" name="confirmPassword" value={form.confirmPassword} onChange={onChange} error={errors.confirmPassword} autoComplete="new-password" />
      <Button type="submit" loading={submitting} fullWidth size="lg">Create account</Button>
    </form>
  );
}
