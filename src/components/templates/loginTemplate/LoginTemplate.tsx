import { LoginForm } from "@/components/organisms/LoginForm";
import { CiMedicalCross } from "react-icons/ci";

const LoginTemplate = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 relative">
      {/* Subtle background pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Professional header */}
      <div className="relative z-10 text-center mb-12">
        <div className="flex items-center justify-center mb-6">
          {/* Professional logo placeholder */}
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-4 shadow-lg">
           <CiMedicalCross className="h-12 w-12" color="black"/>
          </div>
          <div className="text-left">
            <h1 className="text-4xl font-light text-white tracking-wider">
              RPH Medicine
            </h1>
            <p className="text-gray-400 text-sm font-light tracking-wide">
              Management System
            </p>
          </div>
        </div>
        
        {/* Subtle divider line */}
        <div className="w-32 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mx-auto"></div>
      </div>

      <LoginForm />

      {/* Professional footer */}
      <div className="relative z-10 mt-12 text-center">
        <div className="flex items-center justify-center space-x-6 text-gray-500 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Secure</span>
          </div>
          <div className="w-px h-4 bg-gray-700"></div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Reliable</span>
          </div>
          <div className="w-px h-4 bg-gray-700"></div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span>Protected</span>
          </div>
        </div>
        <p className="text-gray-600 text-xs mt-4">
          © 2025 RPH Medicine Management. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginTemplate;