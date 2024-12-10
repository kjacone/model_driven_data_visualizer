import { Code } from "lucide-react";

export default function OurCodePreview() {
  return (
    <div className="mt-20 relative max-w-4xl mx-auto group">
    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
    <div className="relative">
      <div className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-800">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-2 text-sm text-gray-400">main.js</span>
        </div>
        <div className="p-6 font-mono text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <Code size={16} />
            <span>// Let BoilerPlate handle the heavy lifting</span>
          </div>
          <div className="mt-4 text-emerald-400">
          const project = await BoilerPlate.create({
           <div className="text-emerald-400">
          <div className="ml-4 text-purple-400">
            type: "e-commerce",
          </div>
          <div className="ml-4 text-purple-400">
            features: ["payments", "inventory", "analytics"],
          </div>
          <div className="ml-4 text-purple-400">
            theme: "modern-minimal"
          </div>
         </div>
            });
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
