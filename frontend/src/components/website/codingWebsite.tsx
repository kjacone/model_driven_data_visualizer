import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Play, Terminal, BugIcon } from "lucide-react";
import { OurFooter } from "./OurFooter";
import OurHeader from "./OurHeader";
import OurCodePreview from "./OurCodePreview";
import OurStats from "./OurStats";
import { WhyUs } from "./WhyUs";
import Subscribe from "./Subscribe";

export type Product = {
  id: string;
  icon: React.ComponentType;
  title: string;
  description: string;
  features: string[];
  questions?: { id: string; label: string; type: string; options: string[] }[];
};

const LandingPage = () => {
  const [showProductSelect, setShowProductSelect] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated background */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <BugIcon className="text-emerald-500 animate-bounce" size={28} />
            <span className="text-emerald-500 font-semibold">
              turn Your Ideas Into Production Ready Applications
            </span>
            <BugIcon className="text-emerald-500 animate-bounce" size={28} />
          </div>

          <h1 className="text-7xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600">
              Code Smarter,
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-600">
              Build Faster
            </span>
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-300">
            Transform your ideas into production-ready software with our
            AI-powered development platform. No hassle - just pure
            creation.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              onClick={() => {
                // setShowProductSelect(true);
                router.push('/getstarted');
              }}
              className="px-8 py-4 bg-emerald-500 rounded-lg font-semibold text-lg hover:bg-emerald-600 transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              Start Building
              <Terminal size={20} />
            </button>
            <button className="px-8 py-4 bg-gray-800 rounded-lg font-semibold text-lg hover:bg-gray-700 transition-all duration-200 flex items-center gap-2">
              Watch Demo
              <Play size={20} />
            </button>
          </div>

          {/* Code Preview */}
          <OurCodePreview />


        </div>

        {/* Stats */}
        <OurStats />
      </div>

      {/* Why Us Section */}
      <WhyUs />

      {/* Subscribe Now Section */}
      <Subscribe />
      <OurFooter />
    </div>
  );
};

export default LandingPage;
