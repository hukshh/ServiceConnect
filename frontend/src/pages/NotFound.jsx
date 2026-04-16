import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="text-[150px] leading-none font-black text-brand-500/20 mix-blend-screen relative select-none">
           404
           <span className="absolute inset-0 flex items-center justify-center text-4xl text-brand-400 font-bold blur-[0.5px]">404</span>
        </div>
        <h1 className="text-3xl font-bold text-white mt-4 mb-2">Page Not Found</h1>
        <p className="text-slate-400 max-w-md mx-auto mb-8">
           The page you are looking for doesn't exist or has been moved.
        </p>
        <button
           onClick={() => navigate('/')}
           className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl shadow-lg transition-all"
        >
           Return Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
