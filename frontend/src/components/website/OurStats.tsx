import { FC } from "react"

const OurStats = () => {
  return (
    <div className="mt-20 grid grid-cols-3 gap-8 text-center">
    <div>
      <div className="text-4xl font-bold text-emerald-500 mb-2">99.9%</div>
      <div className="text-gray-400">Bug-Free Code</div>
    </div>
    <div>
      <div className="text-4xl font-bold text-emerald-500 mb-2">10x</div>
      <div className="text-gray-400">Faster Development</div>
    </div>
    <div>
      <div className="text-4xl font-bold text-emerald-500 mb-2">24/7</div>
      <div className="text-gray-400">AI Support</div>
    </div>
  </div>

  )
}

export default OurStats
