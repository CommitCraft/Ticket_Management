import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { registerRequest } from '../../services/auth';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setCredentials } from '../../store/authSlice';
import { AuthLayout } from '../../components/layout/AuthLayout';

const schema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(50, 'Full name cannot exceed 50 characters').trim(),
  companyName: z.string().min(2, 'Company name must be at least 2 characters').max(100, 'Company name cannot exceed 100 characters').trim(),
  phoneNumber: z.string().regex(/^[0-9]{7,20}$/, 'Phone must be 7-20 digits only').trim(),
  email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(/[A-Z]/, 'Must contain uppercase').regex(/[0-9]/, 'Must contain a number')
});

type RegisterValues = z.infer<typeof schema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: RegisterValues) => {
    const response = await registerRequest(values);
    dispatch(setCredentials({ user: response.user, accessToken: response.accessToken }));
    toast.success('Account created');
    navigate('/dashboard');
  };

  return (
    <AuthLayout eyebrow="Get in touch" title="Create your account" description="Join the platform to raise tickets, follow progress, and stay connected with support updates." icon="🚀">
      <Card className="w-full max-w-md overflow-hidden border-slate-200 shadow-none dark:border-slate-800 dark:bg-slate-900 lg:shadow-none">
        <div className="h-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-400" />
        <CardHeader className="space-y-2 pb-3 pt-7 text-center sm:pt-8">
          <CardTitle className="text-2xl font-black tracking-tight sm:text-3xl">Create account</CardTitle>
          <CardDescription className="text-sm text-slate-500 dark:text-slate-400">Register to raise and track tickets.</CardDescription>
        </CardHeader>
        <CardContent className="px-5 pb-7 pt-3 sm:px-8">
          <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="fullName">Full name</label>
              <Input id="fullName" placeholder="John Doe" className={`h-12 rounded-xl shadow-sm focus-visible:ring-blue-500 ${errors.fullName ? 'border-red-300 bg-red-50 dark:border-red-500 dark:bg-red-950/20' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950'}`} {...register('fullName')} />
              {errors.fullName ? <p className="text-xs text-red-500 font-medium">{errors.fullName.message}</p> : <p className="text-xs text-slate-500 dark:text-slate-400">Your full name</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="companyName">Company name</label>
              <Input id="companyName" placeholder="Acme Corp" className={`h-12 rounded-xl shadow-sm focus-visible:ring-blue-500 ${errors.companyName ? 'border-red-300 bg-red-50 dark:border-red-500 dark:bg-red-950/20' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950'}`} {...register('companyName')} />
              {errors.companyName ? <p className="text-xs text-red-500 font-medium">{errors.companyName.message}</p> : <p className="text-xs text-slate-500 dark:text-slate-400\">Organization name</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="phoneNumber">Phone number</label>
              <Input id="phoneNumber" type="tel" placeholder="5551234567" inputMode="numeric" pattern="[0-9]{7,20}" className={`h-12 rounded-xl shadow-sm focus-visible:ring-blue-500 ${errors.phoneNumber ? 'border-red-300 bg-red-50 dark:border-red-500 dark:bg-red-950/20' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950'}`} {...register('phoneNumber')} />
              {errors.phoneNumber ? <p className="text-xs text-red-500 font-medium">{errors.phoneNumber.message}</p> : <p className="text-xs text-slate-500 dark:text-slate-400">Your contact number</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="email">Email address</label>
              <Input id="email" type="email" placeholder="name@example.com" className={`h-12 rounded-xl shadow-sm focus-visible:ring-blue-500 ${errors.email ? 'border-red-300 bg-red-50 dark:border-red-500 dark:bg-red-950/20' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950'}`} {...register('email')} />
              {errors.email ? <p className="text-xs text-red-500 font-medium">{errors.email.message}</p> : <p className="text-xs text-slate-500 dark:text-slate-400">Used to sign in</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="password">Password</label>
              <Input id="password" type="password" placeholder="••••••••" className={`h-12 rounded-xl shadow-sm focus-visible:ring-blue-500 ${errors.password ? 'border-red-300 bg-red-50 dark:border-red-500 dark:bg-red-950/20' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950'}`} {...register('password')} />
              {errors.password ? <p className="text-xs text-red-500 font-medium">{errors.password.message}</p> : <p className="text-xs text-slate-500 dark:text-slate-400">Min 8 chars with uppercase & number</p>}
            </div>

            <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
              <span className="text-slate-500 dark:text-slate-400">Already have an account?</span>
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                Sign in
              </Link>
            </div>

            <Button className="h-12 w-full rounded-xl bg-slate-900 text-base font-semibold text-white hover:bg-slate-800 dark:bg-blue-500 dark:hover:bg-blue-400" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Account'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
