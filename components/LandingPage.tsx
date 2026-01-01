
import React from 'react';
import { 
  GraduationCap, 
  Bell, 
  ClipboardCheck, 
  Clock, 
  ArrowRight, 
  Youtube, 
  BookOpen, 
  Search, 
  Lightbulb,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const resources = [
    {
      title: "Erasmus Mundus Guide",
      category: "Scholarships",
      desc: "Step-by-step walkthrough for the European Union's fully funded Master's programs.",
      link: "https://www.youtube.com/results?search_query=erasmus+mundus+scholarship+guide",
      icon: <GraduationCap className="w-5 h-5 text-blue-500" />
    },
    {
      title: "Mastercard Foundation",
      category: "Scholarships",
      desc: "How to apply for the Mastercard Foundation Scholars Program at top global universities.",
      link: "https://www.youtube.com/results?search_query=mastercard+foundation+scholarship+application",
      icon: <Sparkles className="w-5 h-5 text-amber-500" />
    },
    {
      title: "SOP Masterclass",
      category: "Writing Tips",
      desc: "Crafting a compelling Statement of Purpose that stands out to admission committees.",
      link: "https://www.youtube.com/results?search_query=how+to+write+sop+for+scholarship",
      icon: <BookOpen className="w-5 h-5 text-emerald-500" />
    },
    {
      title: "Recommendation Letters",
      category: "Writing Tips",
      desc: "Tips for choosing your referees and guiding them to write winning letters.",
      link: "https://www.youtube.com/results?search_query=academic+recommendation+letter+tips",
      icon: <Lightbulb className="w-5 h-5 text-rose-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100">
      <nav className="max-w-6xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <GraduationCap className="w-8 h-8 text-blue-600" />
          <span>CScholarTrack</span>
        </div>
        <button 
          onClick={onGetStarted}
          className="text-sm font-semibold hover:text-blue-600 transition-colors"
        >
          Sign In
        </button>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-12 pb-32">
        {/* Hero Section */}
        <div className="max-w-4xl mb-24">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
            Stay organized. <br/>
            <span className="text-blue-600">Get funded.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl leading-relaxed">
            The simple tracker for PhD and Masters scholarship applications. Manage documents once, set reminders, and never miss a deadline again.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onGetStarted}
              className="px-8 py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl"
            >
              Start Tracking Now <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-gray-100 pt-16 mb-32">
          <div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6">
              <ClipboardCheck className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Central Repository</h3>
            <p className="text-gray-500 text-sm">Store all your applications in one place. Manually update status as you move through the process.</p>
          </div>
          <div>
            <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center mb-6">
              <Bell className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Smart Reminders</h3>
            <p className="text-gray-500 text-sm">Deadlines for both applications and individual documents to keep you on schedule.</p>
          </div>
          <div>
            <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mb-6">
              <Clock className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Document Reuse</h3>
            <p className="text-gray-500 text-sm">Upload reusable files like your Passport once. Link them to multiple schools in seconds.</p>
          </div>
        </div>

        {/* Educational Resources Library */}
        <section className="mb-32">
          <div className="flex items-center gap-3 mb-10">
            <Youtube className="w-8 h-8 text-red-600" />
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Resource Hub</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {resources.map((res, i) => (
              <a 
                key={i} 
                href={res.link} 
                target="_blank" 
                rel="noreferrer"
                className="group bg-gray-50 p-6 rounded-3xl border border-transparent hover:border-red-100 hover:bg-white transition-all shadow-sm hover:shadow-xl"
              >
                <div className="bg-white p-3 rounded-2xl w-fit mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  {res.icon}
                </div>
                <div className="inline-block px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-3">
                  {res.category}
                </div>
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2 group-hover:text-red-600 transition-colors">
                  {res.title} <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed">{res.desc}</p>
              </a>
            ))}
          </div>

          {/* Search Tips Section */}
          <div className="bg-slate-900 rounded-[40px] p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-48 -mt-48" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-600 rounded-2xl">
                    <Search className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold">Research Mastery</h2>
                </div>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  YouTube is a goldmine for scholarship applicants if you know how to dig. Use these professional search tips to uncover hidden opportunities.
                </p>
                <div className="space-y-4">
                  {[
                    "Search for 'Full Tuition Waiver' instead of just 'Scholarship'.",
                    "Add the current year (e.g., 'Scholarships for 2025') to filter out old videos.",
                    "Look for 'Day in the Life' videos for specific universities to get application insights.",
                    "Include country-specific keywords like 'DAAD' for Germany or 'MEXT' for Japan."
                  ].map((tip, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-6 h-6 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">
                        {i + 1}
                      </div>
                      <p className="text-sm font-medium text-gray-300">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                  High-Impact Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Fully Funded PhD", "Erasmus Mundus 2025", "SOP Sample Graduate", 
                    "Scholarship Interview Prep", "GRE Waiver University", 
                    "Mastercard Scholars Guide", "IELTS for Scholarship", 
                    "Statement of Purpose Tips"
                  ].map((word) => (
                    <span key={word} className="px-3 py-1.5 bg-white/10 text-white/80 rounded-lg text-xs font-semibold border border-white/5 hover:bg-blue-600 hover:text-white cursor-default transition-all">
                      {word}
                    </span>
                  ))}
                </div>
                <div className="mt-8 pt-8 border-t border-white/10">
                  <p className="text-xs text-gray-500 uppercase font-black tracking-widest mb-4">Pro Tip</p>
                  <p className="text-sm text-gray-300 italic">
                    "When searching for scholarship videos, sort by 'Upload Date' to find the most recent application windows and requirements."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-50 py-12 px-6">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-400">
          <p>© 2024 CScholarTrack. Your gateway to global education.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
