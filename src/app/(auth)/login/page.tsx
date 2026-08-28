import Link from 'next/link';
import { login } from '../auth-actions';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <h1 className="text-2xl font-bold text-center mb-6">Log In</h1>
        <form action={login} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" required className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" name="password" required className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition-colors mt-2">
            Log In
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-500">
          Don't have an account? <Link href="/register" className="text-blue-600 hover:underline">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
