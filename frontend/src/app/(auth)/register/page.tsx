'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from '@/hooks/useForm';
import { registerSchema } from '@/schemas/auth.schema';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Image from 'next/image';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { values, errors, handleChange, handleSubmit } = useForm(registerSchema, { name: '', email: '', password: '', phone: '' });

  const onSubmit = async (data: { name: string; email: string; password: string; phone: string }) => {
    setLoading(true);
    try {
      const success = await register(data);
      if (success) {
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-sky-50 p-4">
      <div className="w-full max-w-md animate-fadeInUp">
        <div className="text-center mb-8">
          <Image src="/logo.jpg" alt="GoTrek Logo" width={64} height={64} className="rounded-2xl mx-auto mb-4 shadow-lg object-cover" />
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-sm text-gray-500 mt-1">Join the GoTrek community</p>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input label="Full Name" name="name" value={values.name} onChange={handleChange} error={errors.name} placeholder="John Doe" />
            <Input label="Email" type="email" name="email" value={values.email} onChange={handleChange} error={errors.email} placeholder="you@example.com" />
            <Input label="Phone" name="phone" value={values.phone} onChange={handleChange} error={errors.phone} placeholder="+977 9800000000" />
            <Input label="Password" type={showPassword ? 'text' : 'password'} name="password" value={values.password} onChange={handleChange} error={errors.password} placeholder="Min. 6 characters"
              suffixIcon={<button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>} />
            <Button type="submit" className="w-full" isLoading={loading}>
              <UserPlus className="h-4 w-4 mr-2" /> Create Account
            </Button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
