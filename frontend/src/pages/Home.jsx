import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Customer home page shown after successful login — placeholder for Phase 2
const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-500/25">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">ServiceConnect</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-400">
                Welcome, <span className="text-brand-400 font-medium">{user?.name}</span>
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500/10 border border-brand-500/20 rounded-full text-brand-400 text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            Phase 2 Coming Soon
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight mb-6">
            Find Local Services
            <span className="block mt-2 bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
              Near You
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Browse, book, and review trusted local service providers. From home repairs to personal care — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="px-8 py-4 bg-gradient-to-r from-brand-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-brand-500/25 opacity-50 cursor-not-allowed">
              Browse Services — Coming in Phase 2
            </div>
          </div>
        </div>

        {/* Feature Cards Preview */}
        <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6 animate-slide-up">
          {[
            {
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              ),
              title: 'Search & Discover',
              desc: 'Find the perfect service provider based on category, location, and ratings.',
            },
            {
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              ),
              title: 'Book Instantly',
              desc: 'Schedule appointments with just a few clicks. No phone calls needed.',
            },
            {
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              ),
              title: 'Review & Rate',
              desc: 'Share your experience and help others find great service providers.',
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:border-brand-500/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:from-brand-500/30 group-hover:to-purple-500/30 transition-all duration-300">
                <svg className="w-6 h-6 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {feature.icon}
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
