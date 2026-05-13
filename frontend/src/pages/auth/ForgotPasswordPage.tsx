import { Link } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { forgotPasswordRequest } from '../../services/auth';

const schema = z.object({ email: z.string().email() });

type ForgotValues = z.infer<typeof schema>;

export function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: ForgotValues) => {
    await forgotPasswordRequest(values);
    toast.success('If the account exists, reset instructions were sent.');
  };

  return (
    <AuthLayout eyebrow="Get in touch" title="Reset your password" description="Enter your email and we’ll send a secure reset link so you can get back into your account." icon="🔐">
      <Card className="w-full max-w-md overflow-hidden border-slate-200 shadow-none dark:border-slate-800 dark:bg-slate-900 lg:shadow-none">
        <div className="h-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-400" />
        <CardHeader className="space-y-2 pb-3 pt-7 text-center sm:pt-8">
          <CardTitle className="text-2xl font-black tracking-tight sm:text-3xl">Forgot password</CardTitle>
          <CardDescription className="text-sm text-slate-500 dark:text-slate-400">We will send a reset link to your email.</CardDescription>
        </CardHeader>
        <CardContent className="px-5 pb-7 pt-3 sm:px-8">
          <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="email">Email</label>
              <Input id="email" type="email" placeholder="Enter your email" className="h-12 rounded-xl border-slate-200 bg-white shadow-sm focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-950" {...register('email')} />
              {errors.email ? <p className="text-xs text-red-500">{errors.email.message}</p> : null}
            </div>

            <Button className="h-12 w-full rounded-xl bg-slate-900 text-base font-semibold text-white hover:bg-slate-800 dark:bg-blue-500 dark:hover:bg-blue-400" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </Button>

            <div className="text-center text-sm text-slate-500 dark:text-slate-400">
              Remembered your password?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                Back to sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
