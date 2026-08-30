import Link from 'next/link';
import { register } from '../auth-actions';
import { ActionForm } from '@/components/admin/ActionForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md border border-gray-100 dark:border-gray-800">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">Create an Account</h1>
        <ActionForm action={register} className="flex flex-col gap-4" successMessage="Account created!">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username (URL)</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm">
                link-share.com/
              </span>
              <input type="text" name="username" required className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 dark:text-gray-100 sm:text-sm" placeholder="username" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input type="email" name="email" required className="w-full border dark:border-gray-700 dark:bg-gray-800 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-gray-100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input type="password" name="password" required className="w-full border dark:border-gray-700 dark:bg-gray-800 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-gray-100" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition-colors mt-2">
            Sign Up
          </button>
        </ActionForm>
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  );
}
