import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { loginRequest } from '../../services/auth';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setCredentials } from '../../store/authSlice';
import { AuthLayout } from '../../components/layout/AuthLayout';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

type LoginValues = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: LoginValues) => {
    const response = await loginRequest(values);
    dispatch(setCredentials({ user: response.user, accessToken: response.accessToken }));
    toast.success('Welcome back');
    navigate('/dashboard');
  };

  return (
    <AuthLayout eyebrow="Get in touch" title="Welcome back" description="Sign in to manage tickets, track updates, and keep support operations moving in one clean workspace." icon="🚀">
      <Card className="w-full max-w-md overflow-hidden border-slate-200 shadow-none dark:border-slate-800 dark:bg-slate-900 lg:shadow-none">
        <div className="h-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-400" />
        <CardHeader className="space-y-2 pb-3 pt-7 text-center sm:pt-8">
          <CardTitle className="text-2xl font-black tracking-tight sm:text-3xl">Sign in</CardTitle>
          <CardDescription className="text-sm text-slate-500 dark:text-slate-400">Access your helpdesk workspace.</CardDescription>
        </CardHeader>
        <CardContent className="px-5 pb-7 pt-3 sm:px-8">
          <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="email">Email</label>
              <Input id="email" type="email" placeholder="Enter your email" className="h-12 rounded-xl border-slate-200 bg-white shadow-sm focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-950" {...register('email')} />
              {errors.email ? <p className="text-xs text-red-500">{errors.email.message}</p> : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="password">Password</label>
              <Input id="password" type="password" placeholder="Enter your password" className="h-12 rounded-xl border-slate-200 bg-white shadow-sm focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-950" {...register('password')} />
              {errors.password ? <p className="text-xs text-red-500">{errors.password.message}</p> : null}
            </div>

            <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
              <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                Forgot password?
              </Link>
              <Link to="/register" className="font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                Create account
              </Link>
            </div>

            <Button className="h-12 w-full rounded-xl bg-slate-900 text-base font-semibold text-white hover:bg-slate-800 dark:bg-blue-500 dark:hover:bg-blue-400" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
