import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-white/5 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
           <svg className="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
           <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-purple-500">ServiceConnect</span>
        </div>
        
        <p className="text-slate-500 text-sm">
           Powered by the MERN Stack. Modern service booking architecture.
        </p>

        <div className="flex gap-4">
           <Link to="/" className="text-slate-400 hover:text-white transition-colors">Home</Link>
           <Link to="/bookings" className="text-slate-400 hover:text-white transition-colors">Bookings</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
