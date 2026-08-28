import Link from 'next/link';
import { register } from '../auth-actions';
import { ActionForm } from '@/components/admin/ActionForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <h1 className="text-2xl font-bold text-center mb-6">Create an Account</h1>
        <ActionForm action={register} className="flex flex-col gap-4" successMessage="Account created!">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username (URL)</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                linkin.bio/
              </span>
              <input type="text" name="username" required placeholder="yourname" className="flex-1 block w-full rounded-none rounded-r-md border p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" required placeholder="you@example.com" className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" name="password" required className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition-colors mt-2">
            Sign Up
          </button>
        </ActionForm>
        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  );
}
