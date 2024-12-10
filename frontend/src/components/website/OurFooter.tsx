import { BugIcon } from "lucide-react";

export const OurFooter: React.FC = () => {
  return (


      <footer className="mt-20 border-t border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center text-gray-400">
        <div className="flex items-center justify-center gap-2 mb-4">
          <BugIcon className="w-8 h-8" />
          <span className="text-emerald-500">BoilerPlate</span>
        </div>
        Debug your way to success. ©   {`Copyright ${new Date().getFullYear()} BoilerPlate`}. All rights reserved.  
      </div>
    </footer>
  );
};
