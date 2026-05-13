import { useSearchParams, Link } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { resetPasswordRequest } from '../../services/auth';

const schema = z.object({
  password: z.string().min(8)
});

type ResetValues = z.infer<typeof schema>;

export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: ResetValues) => {
    await resetPasswordRequest({ token, password: values.password });
    toast.success('Password reset complete');
  };

  return (
    <AuthLayout eyebrow="Get in touch" title="Reset your password" description="Choose a new secure password to regain access to your helpdesk account." icon="🔒">
      <Card className="w-full max-w-md overflow-hidden border-slate-200 shadow-none dark:border-slate-800 dark:bg-slate-900 lg:shadow-none">
        <div className="h-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-400" />
        <CardHeader className="space-y-2 pb-3 pt-7 text-center sm:pt-8">
          <CardTitle className="text-2xl font-black tracking-tight sm:text-3xl">Reset password</CardTitle>
          <CardDescription className="text-sm text-slate-500 dark:text-slate-400">Choose a new secure password.</CardDescription>
        </CardHeader>
        <CardContent className="px-5 pb-7 pt-3 sm:px-8">
          <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="password">New password</label>
              <Input id="password" type="password" placeholder="Enter new password" className="h-12 rounded-xl border-slate-200 bg-white shadow-sm focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-950" {...register('password')} />
              {errors.password ? <p className="text-xs text-red-500">{errors.password.message}</p> : null}
            </div>

            <Button className="h-12 w-full rounded-xl bg-slate-900 text-base font-semibold text-white hover:bg-slate-800 dark:bg-blue-500 dark:hover:bg-blue-400" type="submit" disabled={isSubmitting || !token}>
              {isSubmitting ? 'Resetting...' : 'Reset Password'}
            </Button>

            <div className="text-center text-sm text-slate-500 dark:text-slate-400">
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
