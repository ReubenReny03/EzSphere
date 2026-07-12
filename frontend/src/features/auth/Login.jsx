import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import logo from '@/favicon.png';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values) => {
    setServerError(null);
    try {
      await login(values.email, values.password);
      navigate(location.state?.from || '/dashboard', { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg px-4">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-env/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-social/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-gov/10 blur-3xl" />

      <div className="relative w-full max-w-sm animate-slide-up rounded-xl border border-border bg-surface p-8 shadow-elevated">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <img src={logo} alt="EcoSphere" className="h-14 w-14 rounded-xl object-cover object-top shadow-soft" />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-text">EcoSphere</h1>
            <p className="text-sm text-muted">ESG Management Platform</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />
          {serverError && <p className="text-sm text-danger">{serverError}</p>}
          <Button type="submit" loading={isSubmitting} className="w-full">
            Log in
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
