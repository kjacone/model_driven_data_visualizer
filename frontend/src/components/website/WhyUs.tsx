import { Fragment } from 'react'

import { ArrowRight, Bug, Cloud, Code } from 'lucide-react'

export function WhyUs() {
  return (
    <section className="mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <div className="text-center mb-16">
    <h2 className="text-4xl font-bold mb-4">
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600">
        Why Choose BoilerPlate?
      </span>
    </h2>
    <p className="text-gray-400 text-xl">Unleash your development potential with our cutting-edge platform</p>
  </div>

  <div className="grid md:grid-cols-3 gap-8">
    <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
      <Code size={32} className="text-emerald-500 mb-4" />
      <h3 className="text-xl font-semibold mb-3">Smart Code Generation</h3>
      <p className="text-gray-400">Our AI understands your requirements and generates production-ready code that follows best practices.</p>
    </div>

    <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
      <Bug size={32} className="text-emerald-500 mb-4" />
      <h3 className="text-xl font-semibold mb-3">Automated Testing</h3>
      <p className="text-gray-400">Built-in testing ensures your code works flawlessly before it reaches production.</p>
    </div>

    <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
      <Cloud size={32} className="text-emerald-500 mb-4" />
      <h3 className="text-xl font-semibold mb-3">Instant Deployment</h3>
      <p className="text-gray-400">Deploy your projects with a single click to our secure, scalable cloud infrastructure.</p>
    </div>
  </div>
</section>
  )
}
