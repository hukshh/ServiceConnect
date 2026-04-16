const Spinner = ({ global = false }) => {
  const spinnerElement = (
     <div className="flex flex-col items-center justify-center">
        <div className="relative">
           <div className="w-12 h-12 border-4 border-brand-500/20 rounded-full animate-pulse"></div>
           <div className="w-12 h-12 border-4 border-transparent border-t-brand-500 rounded-full animate-spin absolute inset-0"></div>
        </div>
        <p className="text-brand-400 text-sm font-semibold mt-4 tracking-widest uppercase">Loading</p>
     </div>
  );

  if (global) {
     return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
           {spinnerElement}
        </div>
     );
  }

  return (
     <div className="w-full py-12 flex items-center justify-center">
        {spinnerElement}
     </div>
  );
};

export default Spinner;
