import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4 transition-colors">
      
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="max-w-3xl w-full text-center space-y-8">
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          One Link for <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            Everything You Do
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Create a beautiful, customizable link-in-bio page in seconds. Share your social profiles, embed your favorite content, and track your analytics all in one place.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link 
            href="/register" 
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 dark:bg-blue-500 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 dark:hover:bg-blue-600 hover:scale-105 transition-all text-lg"
          >
            Claim Your Link
          </Link>
          <Link 
            href="/login" 
            className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-bold rounded-full shadow border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-105 transition-all text-lg"
          >
            Log In
          </Link>
        </div>

        <div className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center rounded-xl mb-4 text-2xl">🎨</div>
            <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-gray-100">Beautiful Themes</h3>
            <p className="text-gray-600 dark:text-gray-400">Customize your page with stunning gradients, colors, and the modern glassmorphism effect.</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center rounded-xl mb-4 text-2xl">↕️</div>
            <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-gray-100">Easy to Manage</h3>
            <p className="text-gray-600 dark:text-gray-400">Use our buttery-smooth drag and drop interface to organize your links exactly how you want.</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 flex items-center justify-center rounded-xl mb-4 text-2xl">⚡</div>
            <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-gray-100">Blazing Fast</h3>
            <p className="text-gray-600 dark:text-gray-400">Built on Next.js, your page loads instantly anywhere in the world, so your followers never wait.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
