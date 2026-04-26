import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-black selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gray-100 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-gray-50 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-bold text-black mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
            </span>
            NOW SERVING 20+ CITIES
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-black tracking-tighter mb-6 animate-slide-up leading-[0.9]">
            EXPERT SERVICES<br />
            <span className="text-gray-400">AT YOUR DOORSTEP.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 font-medium animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Book verified professionals for home repairs, cleaning, tutoring, and more. 
            Quality service, guaranteed simplicity.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Link 
              to="/services" 
              className="group px-8 py-4 bg-black text-white font-black rounded-2xl hover:bg-gray-800 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-2"
            >
              Get Started
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </Link>
            <a 
              href="#how-it-works" 
              className="px-8 py-4 bg-white text-black font-black rounded-2xl border-2 border-gray-100 hover:border-black transition-all duration-300"
            >
              How it Works
            </a>
          </div>

          {/* Social Proof */}
          <div className="mt-16 pt-8 border-t border-gray-100 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             <span className="text-2xl font-black tracking-tighter italic">TRUSTED</span>
             <span className="text-2xl font-black tracking-tighter italic">VERIFIED</span>
             <span className="text-2xl font-black tracking-tighter italic">SECURE</span>
             <span className="text-2xl font-black tracking-tighter italic">RELIABLE</span>
          </div>
        </div>
      </section>

      {/* Featured Statistics */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: 'Happy Customers', value: '50k+' },
                { label: 'Service Providers', value: '2k+' },
                { label: 'Cities Covered', value: '20+' },
                { label: 'Rating', value: '4.9/5' }
              ].map((stat, i) => (
                <div key={i} className="text-center group cursor-default">
                   <div className="text-4xl md:text-5xl font-black mb-2 group-hover:scale-110 transition-transform duration-300">{stat.value}</div>
                   <div className="text-gray-400 text-sm font-bold uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div className="max-w-xl">
               <h2 className="text-4xl font-black text-black tracking-tight mb-4 leading-none">POPULAR<br/><span className="text-gray-300">CATEGORIES</span></h2>
               <p className="text-gray-500 font-medium italic">Handpicked experts across various domains to serve you better.</p>
            </div>
            <Link to="/services" className="text-black font-black border-b-2 border-black hover:pb-1 transition-all">Explore all services &rarr;</Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { name: 'Electrician', icon: '', color: 'bg-yellow-50 text-yellow-600' },
               { name: 'Plumber', icon: '', color: 'bg-blue-50 text-blue-600' },
               { name: 'Cleaning', icon: '', color: 'bg-purple-50 text-purple-600' },
               { name: 'Tutoring', icon: '', color: 'bg-green-50 text-green-600' }
             ].map((cat, i) => (
               <div key={i} className="group p-8 rounded-3xl border border-gray-100 hover:border-black transition-all bg-white hover:shadow-2xl cursor-pointer">
                  <div className={`w-16 h-16 ${cat.color} rounded-2xl flex items-center justify-center text-2xl font-black mb-6 group-hover:scale-110 transition-transform uppercase`}>
                    {cat.name.charAt(0)}
                  </div>
                  <h3 className="text-xl font-bold text-black mb-1">{cat.name}</h3>
                  <p className="text-sm text-gray-500 font-medium">Verified Experts</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-black mb-4">HOW IT WORKS</h2>
              <div className="h-1.5 w-20 bg-black mx-auto rounded-full" />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
             {/* Connector lines (Desktop) */}
             <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gray-200 -z-0" />

             {[
               { step: '01', title: 'Find Your Expert', desc: 'Browse through our curated list of verified professionals.' },
               { step: '02', title: 'Book Instantly', desc: 'Select a time slot that fits your busy schedule.' },
               { step: '03', title: 'Relax & Enjoy', desc: 'Your service will be completed to the highest standard.' }
             ].map((item, i) => (
               <div key={i} className="relative bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl transition-all z-10 group">
                  <div className="text-6xl font-black text-gray-100 absolute top-4 right-8 group-hover:text-gray-200 transition-colors">{item.step}</div>
                  <h3 className="text-xl font-black text-black mb-4 relative">{item.title}</h3>
                  <p className="text-gray-500 font-medium relative">{item.desc}</p>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="bg-black rounded-[40px] px-8 py-16 md:p-20 text-center relative overflow-hidden">
              {/* Decorative circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border border-white/10 rounded-full pointer-events-none" />
              
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8 relative">
                READY TO EXPERIENCE<br/>
                <span className="italic text-gray-400 font-light">EXCELLENCE?</span>
              </h2>
              <p className="text-gray-400 max-w-lg mx-auto mb-10 text-lg relative">
                 Join thousands of satisfied customers who trust ServiceConnect for their daily expert needs.
              </p>
              <Link to="/services" className="relative inline-flex px-10 py-5 bg-white text-black font-black rounded-2xl hover:scale-105 transition-transform shadow-2xl">
                 Book a Service Now
              </Link>
           </div>
        </div>
      </section>

    </div>
  );
};

export default Landing;
