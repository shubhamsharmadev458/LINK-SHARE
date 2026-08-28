import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full text-center space-y-8">
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900">
          One Link for <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Everything You Do
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Create a beautiful, customizable link-in-bio page in seconds. Share your social profiles, embed your favorite content, and track your analytics all in one place.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link 
            href="/register" 
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 hover:scale-105 transition-all text-lg"
          >
            Claim Your Link
          </Link>
          <Link 
            href="/login" 
            className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 font-bold rounded-full shadow border border-gray-200 hover:bg-gray-50 hover:scale-105 transition-all text-lg"
          >
            Log In
          </Link>
        </div>

        <div className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-xl mb-4 text-2xl">🎨</div>
            <h3 className="font-bold text-xl mb-2">Beautiful Themes</h3>
            <p className="text-gray-600">Customize your page with stunning gradients, colors, and the modern glassmorphism effect.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 flex items-center justify-center rounded-xl mb-4 text-2xl">↕️</div>
            <h3 className="font-bold text-xl mb-2">Easy to Manage</h3>
            <p className="text-gray-600">Use our buttery-smooth drag and drop interface to organize your links exactly how you want.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-green-100 text-green-600 flex items-center justify-center rounded-xl mb-4 text-2xl">⚡</div>
            <h3 className="font-bold text-xl mb-2">Blazing Fast</h3>
            <p className="text-gray-600">Built on Next.js, your page loads instantly anywhere in the world, so your followers never wait.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
