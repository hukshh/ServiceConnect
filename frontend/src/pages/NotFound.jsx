import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
        <div className="text-[150px] leading-none font-black text-gray-200 relative select-none">
           404
           <span className="absolute inset-0 flex items-center justify-center text-4xl text-black font-black">404</span>
        </div>
        <h1 className="text-3xl font-extrabold text-black mt-4 mb-2">Page Not Found</h1>
        <p className="text-gray-500 font-medium max-w-md mx-auto mb-8">
           The page you are looking for doesn't exist or has been moved.
        </p>
        <button
           onClick={() => navigate('/')}
           className="px-6 py-3 bg-black hover:bg-gray-800 text-white font-bold rounded-xl shadow-md transition-all"
        >
           Return Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
