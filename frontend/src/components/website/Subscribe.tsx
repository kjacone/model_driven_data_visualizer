import { ArrowRight } from 'lucide-react';
import React from 'react';

const Subscribe = () => {
  return (
    <section className="mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur-xl opacity-20" />
      <div className="relative p-8 md:p-12 rounded-xl bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600">
                Ready to Start Building?
              </span>
            </h2>
            <p className="text-gray-400 text-lg mb-6">
              Join thousands of developers who are already building amazing projects with BoilerPlate.
              Get started today with our free tier!
            </p>
            <ul className="space-y-3 mb-8">
              {['5 Projects/month', 'Basic AI Support', 'Community Access', 'Standard Templates'].map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-black/30 p-6 rounded-xl border border-gray-800">
            <h3 className="text-xl font-semibold mb-6">Subscribe to BoilerPlate</h3>
            <form className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-800 focus:border-emerald-500 focus:ring-emerald-500 focus:ring-1 focus:outline-none transition-colors duration-200"
                />
              </div>
              <div>
                <select className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-800 focus:border-emerald-500 focus:ring-emerald-500 focus:ring-1 focus:outline-none transition-colors duration-200">
                  <option value="">Select your plan</option>
                  <option value="free">Free Tier</option>
                  <option value="pro">Pro Plan - $29/mo</option>
                  <option value="team">Team Plan - $99/mo</option>
                </select>
              </div>
              <button className="w-full px-6 py-3 bg-emerald-500 rounded-lg font-semibold hover:bg-emerald-600 transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2">
                Start Free Trial
                <ArrowRight size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
};

export default Subscribe;
