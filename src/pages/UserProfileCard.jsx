


import React from 'react';
import { useForm } from "react-hook-form";
import { nanoid } from "nanoid";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateUser } from '../store/actions/userActions';

const userProfileCard = ({ user }) => {
  return (
    <div className="relative p-6 sm:p-8 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl group hover:border-teal-500/50 transition-all duration-500">

      {/* Animated Background Image */}
      <div
        className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1681660910928-3dddf381fa83?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE3fHx8ZW58MHx8fHx8)",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-cyan-500/5 to-blue-500/5 animate-gradient"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/60"></div>

      <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="absolute inset-0 opacity-[0.03]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center">

        {/* Status Badge */}
        {/* ✅ MOBILE: Larger padding and text */}
        <div className="mb-6 sm:mb-6 animate-fade-in-down">
          <span className="inline-flex items-center gap-2 px-4 sm:px-4 py-2 sm:py-2 bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-teal-500/20 text-teal-300 rounded-full text-sm sm:text-sm font-semibold border border-teal-400/40 shadow-xl shadow-teal-500/20 backdrop-blur-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
            </span>
            <span className="text-sm tracking-wider uppercase">Active Patient</span>
          </span>
        </div>

        {/* Avatar */}
        {/* ✅ MOBILE: Much larger avatar */}
        <div className="relative mb-8 sm:mb-8 group/avatar">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 rounded-full blur-2xl opacity-0 group-hover/avatar:opacity-30 transition-all duration-500 scale-110"></div>
          <div className="relative w-44 h-44 sm:w-44 sm:h-44 rounded-full p-1 bg-gradient-to-tr from-teal-500 via-cyan-500 to-blue-500 shadow-2xl shadow-teal-500/30 group-hover/avatar:shadow-teal-500/50 transition-all duration-500 group-hover/avatar:scale-110 group-hover/avatar:rotate-6">
            <div className="w-full h-full rounded-full p-1.5 bg-slate-900">
              <img
                src="https://media.istockphoto.com/id/1268266198/vector/patient-report-in-medical-card-doctor-record-in-medic-form-document-profile-of-patient-on.jpg?s=612x612&w=0&k=20&c=KWgukj2aQswWlJV7Xw2ZL357r1wAYRSopx5cP7Xdh-w="
                alt="User Avatar"
                className="w-full h-full rounded-full object-cover border-2 border-slate-800"
              />
            </div>
          </div>
          <div className="absolute bottom-2 right-2 w-10 h-10 sm:w-10 sm:h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center border-4 border-slate-900 shadow-lg group-hover/avatar:scale-110 transition-transform duration-300">
            <span className="text-2xl sm:text-xl">✓</span>
          </div>
        </div>

        {/* User Info */}
        {/* ✅ MOBILE: Much larger text */}
        <div className="mb-8 sm:mb-10 space-y-3 sm:space-y-3">
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight drop-shadow-2xl">
            <span className="relative inline-block">
              <span className="absolute -inset-1 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></span>
              <span className="relative">{user.username}</span>
            </span>
          </h2>
          <p className="text-lg sm:text-lg text-slate-300 font-medium tracking-wide break-all px-2">{user.email}</p>
        </div>

        {/* Key Detail Cards */}
        {/* ✅ MOBILE: Larger cards with bigger text */}
        <div className="w-full max-w-md space-y-4 sm:space-y-4">
          {/* Age Card */}
          <div className="group/card relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-md border border-slate-700/50 p-5 sm:p-5 rounded-2xl transition-all duration-300 hover:border-teal-500/60 hover:shadow-xl hover:shadow-teal-500/10 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 to-cyan-500/0 group-hover/card:from-teal-500/5 group-hover/card:to-cyan-500/5 rounded-2xl transition-all duration-300"></div>
            <div className="relative flex justify-between items-center">
              <div className="flex items-center gap-3 sm:gap-3">
                <div className="w-12 h-12 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center border border-teal-500/30 group-hover/card:scale-110 transition-transform duration-300">
                  <span className="text-2xl sm:text-2xl">🎂</span>
                </div>
                <span className="font-bold text-white text-lg sm:text-lg tracking-wide">Age</span>
              </div>
              <span className="text-white font-bold text-3xl sm:text-2xl bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">{user.age}</span>
            </div>
          </div>

          {/* Password Card */}
          <div className="group/card relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-md border border-slate-700/50 p-5 sm:p-5 rounded-2xl transition-all duration-300 hover:border-cyan-500/60 hover:shadow-xl hover:shadow-cyan-500/10 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover/card:from-cyan-500/5 group-hover/card:to-blue-500/5 rounded-2xl transition-all duration-300"></div>
            <div className="relative flex justify-between items-center">
              <div className="flex items-center gap-3 sm:gap-3">
                <div className="w-12 h-12 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center border border-cyan-500/30 group-hover/card:scale-110 transition-transform duration-300">
                  <span className="text-2xl sm:text-2xl">🔐</span>
                </div>
                <span className="font-bold text-white text-lg sm:text-lg tracking-wide">Password</span>
              </div>
              <span className="text-white font-bold text-lg sm:text-lg blur-sm hover:blur-none transition-all duration-300 cursor-pointer bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent select-none">
                {'•'.repeat(8)}
              </span>
            </div>
          </div>

          {/* Patient ID Card */}
          <div className="group/card relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-md border border-slate-700/50 p-5 sm:p-5 rounded-2xl transition-all duration-300 hover:border-blue-500/60 hover:shadow-xl hover:shadow-blue-500/10 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-teal-500/0 group-hover/card:from-blue-500/5 group-hover/card:to-teal-500/5 rounded-2xl transition-all duration-300"></div>
            <div className="relative flex justify-between items-center gap-2">
              <div className="flex items-center gap-3 sm:gap-3 flex-shrink-0">
                <div className="w-12 h-12 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500/20 to-teal-500/20 rounded-xl flex items-center justify-center border border-blue-500/30 group-hover/card:scale-110 transition-transform duration-300">
                  <span className="text-2xl sm:text-2xl">🆔</span>
                </div>
                <span className="font-bold text-white text-lg sm:text-lg tracking-wide">Patient ID</span>
              </div>
              <span className="text-white font-bold text-sm sm:text-sm bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent font-mono truncate">
                {(user.nanoid).trim().slice(0, 10) + '...'}
              </span>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        {/* ✅ MOBILE: Larger padding and text */}
        <div className="mt-8 sm:mt-8 w-full max-w-md p-5 sm:p-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center gap-3 text-lg sm:text-sm text-slate-400">
            <span className="w-3 h-3 bg-green-400 rounded-full shadow-lg shadow-green-400/50 animate-pulse flex-shrink-0"></span>
            <span className="font-medium">Profile data is encrypted and secure</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient { background-size: 200% 200%; animation: gradient 3s ease infinite; }
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.6s ease-out; }
      `}</style>
    </div>
  );
};

export default userProfileCard;

