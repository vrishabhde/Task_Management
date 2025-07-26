import React from 'react';

export default function AuthSidePanel() {
  return (
    <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px] animate-grid"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/50 to-blue-800/50"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent animate-pulse"></div>
      
      {/* Floating shapes */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-300/10 rounded-full blur-2xl animate-float-delayed"></div>
      
      <div className="relative h-full flex flex-col justify-center px-12">
        <div className="max-w-lg">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-white mb-6 animate-fade-in">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">TaskFlow</span>
            </h1>
            <p className="text-blue-100 text-lg mb-12 animate-fade-in-delay leading-relaxed">
              Your all-in-one solution for efficient task management and team collaboration.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 transform transition-all duration-300 hover:scale-105 hover:bg-white/20 border border-white/10 hover:border-white/20">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-3 rounded-lg shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white ml-4">Simple Task Management</h3>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 transform transition-all duration-300 hover:scale-105 hover:bg-white/20 border border-white/10 hover:border-white/20">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-3 rounded-lg shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white ml-4">Team Collaboration</h3>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-4">
            <div className="w-2 h-2 rounded-full bg-blue-300/50 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-blue-300/50 animate-pulse delay-150"></div>
            <div className="w-2 h-2 rounded-full bg-blue-300/50 animate-pulse delay-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
} 