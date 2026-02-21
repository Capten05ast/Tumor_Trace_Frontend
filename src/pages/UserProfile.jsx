


import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { asyncCurrentUser, asyncdelete, asyncLogout, updateUser } from '../store/actions/userActions';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { asyncDeleteUserBackend } from '../store/actions/userActions';
import { asyncLogoutBackend } from '../store/actions/userActions';
import { asyncUpdateUserBackend } from '../store/actions/userActions';

const UserProfile = () => {
  const user = useSelector((state) => state.userReducer.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { handleSubmit, reset, register } = useForm();

  const deleteHandler = () => {
    if (user?.id) {
      dispatch(asyncLogoutBackend());
      dispatch(asyncDeleteUserBackend());
      navigate('/login');
    }
  };

  const updateHandler = (formData) => {
    dispatch(asyncUpdateUserBackend(formData));
    reset(formData);
  };

  useEffect(() => {
    dispatch(asyncCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      reset({ username: user.username || '', email: user.email || '', password: '' });
    }
  }, [user, reset]);

  if (!user) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 flex items-center justify-center'>
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin mb-4"></div>
          <p className='text-white text-xl font-semibold'>Loading user profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen w-full bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 flex flex-col items-center justify-start p-3 sm:p-4 lg:p-12 relative overflow-hidden'>

      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 md:w-96 md:h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 md:w-96 md:h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 md:w-[600px] md:h-[600px] bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Main Container */}
      {/* ✅ MOBILE: Larger padding and spacing */}
      <div className="relative w-full max-w-7xl mt-6 sm:mt-8 mb-10 sm:mb-16">
        <div className="relative bg-slate-800/40 backdrop-blur-2xl border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl">

          <div className="h-2 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 animate-gradient"></div>

          {/* ✅ MOBILE: Single column layout on mobile */}
          <div className="flex flex-col lg:flex-row">

            {/* LEFT SIDE - Profile Display */}
            <div className='relative lg:w-2/5 w-full p-6 sm:p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-slate-700/50'>

              <div className="absolute top-10 right-10 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl animate-float"></div>
              <div className="absolute bottom-10 left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl animate-float-delayed"></div>

              <div className="relative z-10 flex flex-col items-center">

                {/* Status Badge */}
                <div className="mb-8 sm:mb-8 animate-slide-down">
                  <span className="inline-flex items-center gap-2 px-5 sm:px-5 py-3 sm:py-2.5 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-teal-300 rounded-full text-sm sm:text-sm font-bold border border-teal-400/40 shadow-lg backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-400"></span>
                    </span>
                    ACTIVE PATIENT
                  </span>
                </div>

                {/* Avatar */}
                {/* ✅ MOBILE: Much larger avatar */}
                <div className="mb-8 sm:mb-8 animate-scale-in">
                  <div className="relative group cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 rounded-full blur-2xl opacity-30 group-hover:opacity-60 transition-all duration-500 animate-pulse"></div>
                    <div className="relative w-40 h-40 sm:w-40 sm:h-40 rounded-full p-2 bg-gradient-to-tr from-teal-500 via-cyan-500 to-blue-500 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <div className="w-full h-full rounded-full p-1.5 bg-slate-900">
                        <img
                          src="https://media.istockphoto.com/id/1268266198/vector/patient-report-in-medical-card-doctor-record-in-medic-form-document-profile-of-patient-on.jpg?s=612x612&w=0&k=20&c=KWgukj2aQswWlJV7Xw2ZL357r1wAYRSopx5cP7Xdh-w="
                          alt="User Avatar"
                          className="w-full h-full rounded-full object-cover border-2 border-slate-800"
                        />
                      </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center border-4 border-slate-900 shadow-xl group-hover:scale-125 transition-transform duration-300">
                      <span className="text-white text-xl sm:text-xl font-bold pl-2">✓</span>
                    </div>
                  </div>
                </div>

                {/* User Info */}
                {/* ✅ MOBILE: Much larger text */}
                <div className="text-center mb-8 sm:mb-10 animate-fade-in">
                  <h2 className="text-4xl sm:text-5xl font-medium text-white mb-3 sm:mb-3 tracking-tight hover:scale-105 transition-transform duration-300 cursor-default">
                    <span className="bg-gradient-to-r from-teal-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
                      {user.username}
                    </span>
                  </h2>
                  <p className="text-slate-400 text-lg sm:text-lg font-medium">{user.email}</p>
                </div>

                {/* User Detail Cards */}
                {/* ✅ MOBILE: Larger cards and text */}
                <div className="w-full space-y-4 sm:space-y-4">
                  {/* Age Card */}
                  <div className="group bg-slate-700/30 backdrop-blur-sm border border-slate-600 p-5 sm:p-5 rounded-2xl hover:border-teal-400 hover:bg-slate-700/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer animate-slide-right">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4 sm:gap-4">
                        <div className="w-12 h-12 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-500/30 to-cyan-500/30 rounded-xl flex items-center justify-center border border-teal-500/40 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                          <span className="text-2xl sm:text-2xl">🎂</span>
                        </div>
                        <span className="text-white font-bold text-lg sm:text-lg">Age</span>
                      </div>
                      <span className="text-teal-400 font-bold text-xl sm:text-xl group-hover:scale-125 transition-transform duration-300">{user.age || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Password Card */}
                  <div className="group bg-slate-700/30 backdrop-blur-sm border border-slate-600 p-5 sm:p-5 rounded-2xl hover:border-cyan-400 hover:bg-slate-700/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer animate-slide-right" style={{animationDelay: '0.1s'}}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4 sm:gap-4">
                        <div className="w-12 h-12 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-xl flex items-center justify-center border border-cyan-500/40 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                          <span className="text-2xl sm:text-2xl">🔐</span>
                        </div>
                        <span className="text-white font-bold text-lg sm:text-lg">Password</span>
                      </div>
                      <span className="text-cyan-400 font-bold text-lg sm:text-lg blur-sm group-hover:blur-none transition-all duration-300">
                        {'••••••••'}
                      </span>
                    </div>
                  </div>

                  {/* Patient ID Card */}
                  <div className="group bg-slate-700/30 backdrop-blur-sm border border-slate-600 p-5 sm:p-5 rounded-2xl hover:border-blue-400 hover:bg-slate-700/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer animate-slide-right" style={{animationDelay: '0.2s'}}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4 sm:gap-4">
                        <div className="w-12 h-12 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500/30 to-teal-500/30 rounded-xl flex items-center justify-center border border-blue-500/40 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                          <span className="text-2xl sm:text-2xl">🆔</span>
                        </div>
                        <span className="text-white font-bold text-lg sm:text-lg">Patient ID</span>
                      </div>
                      <span className="text-blue-400 font-bold text-sm sm:text-sm font-mono select-all">
                        {(user.nanoid).trim().slice(0, 16) || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="mt-8 sm:mt-8 w-full p-4 sm:p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl backdrop-blur-sm animate-fade-in">
                  <div className="flex items-center justify-center gap-3 text-sm sm:text-base">
                    <span className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></span>
                    <span className="text-emerald-300 font-semibold">🔒 End-to-End Encrypted</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - Update Form */}
            <div className='relative lg:w-3/5 w-full p-6 sm:p-8 lg:p-12'>

              <div className="absolute top-10 left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl animate-float"></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-float-delayed"></div>

              <form onSubmit={handleSubmit(updateHandler)} className="relative z-10">

                {/* Form Header */}
                {/* ✅ MOBILE: Larger heading */}
                <div className="text-center mb-10 sm:mb-12 animate-slide-down">
                  <div className="inline-flex items-center gap-2 px-4 sm:px-4 py-3 bg-cyan-500/10 rounded-full border border-cyan-500/30 mb-6 sm:mb-6">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                    <span className="text-sm sm:text-sm font-bold text-cyan-400 tracking-wider uppercase">Profile Management</span>
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 sm:mb-4 tracking-tight">
                    <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-teal-300 bg-clip-text text-transparent">
                      Update Profile
                    </span>
                  </h2>
                  <div className="w-24 sm:w-24 h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-500 mx-auto rounded-full"></div>
                </div>

                {/* Form Fields */}
                {/* ✅ MOBILE: Larger inputs and labels */}
                <div className="space-y-6 sm:space-y-6 mb-8 sm:mb-10 mx-auto">

                  {[
                    { field: 'username', label: 'Username', icon: '👤', color: 'teal', type: 'text', placeholder: 'Enter your username', autoComplete: 'username' },
                    { field: 'email', label: 'Email Address', icon: '📧', color: 'cyan', type: 'email', placeholder: 'Enter your email', autoComplete: 'email' },
                    { field: 'password', label: 'Password', icon: '🔑', color: 'blue', type: 'password', placeholder: 'Enter new password', autoComplete: 'new-password' },
                  ].map((f, idx) => (
                    <div key={f.field} className="relative group animate-slide-left" style={{animationDelay: `${idx * 0.1}s`}}>
                      <label className={`text-sm sm:text-sm font-bold text-${f.color}-400 mb-3 sm:mb-3 uppercase tracking-wider flex items-center gap-2`}>
                        <span className='text-2xl sm:text-2xl'>{f.icon}</span>
                        <span>{f.label}</span>
                      </label>
                      <div className="relative">
                        <input
                          {...register(f.field)}
                          className="w-full text-lg sm:text-lg p-5 sm:p-5 bg-slate-700/40 text-white rounded-2xl outline-none border-2 border-slate-600 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all duration-300 placeholder:text-slate-500 hover:bg-slate-700/60"
                          type={f.type}
                          placeholder={f.placeholder}
                          autoComplete={f.autoComplete}
                        />
                        <div className="absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none"></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Submit Button */}
                {/* ✅ MOBILE: Larger button */}
                <button
                  type="submit"
                  className="mx-auto w-full group relative py-4 sm:py-1 text-xl sm:text-2xl font-bold rounded-2xl text-white bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 hover:from-teal-400 hover:via-cyan-400 hover:to-blue-400 shadow-2xl shadow-teal-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden animate-slide-up"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                  <span className="relative flex items-center justify-center gap-3 mx-auto">
                    <span className='mx-auto text-white'>🚀 Update Profile →</span>
                  </span>
                </button>

                {/* Delete Account */}
                {/* ✅ MOBILE: Larger text */}
                <div className="mt-8 sm:mt-8 p-5 sm:p-6 bg-red-500/5 border border-red-500/20 rounded-2xl backdrop-blur-sm hover:border-red-500/40 hover:bg-red-500/10 transition-all duration-300 group cursor-pointer animate-fade-in">
                  <p className="text-center text-slate-400 text-lg sm:text-base">
                    Want to delete your account?{' '}
                    <Link
                      className="text-red-400 font-bold hover:text-red-300 transition-colors underline decoration-red-400/50 hover:decoration-red-300 group-hover:scale-105 inline-block"
                      to="/login"
                      onClick={deleteHandler}
                    >
                      Remove Account →
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* X-ray Gallery Section */}
      <div className="relative w-full max-w-7xl mx-auto p-3 md:p-0 mb-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-float pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-float-delayed pointer-events-none" style={{animationDelay: '1.5s'}}></div>

        {/* ✅ MOBILE: Larger padding */}
        <div className="relative z-10 bg-slate-800/40 border border-slate-700/50 backdrop-blur-2xl rounded-3xl p-6 sm:p-6 md:p-10 shadow-2xl overflow-hidden animate-slide-up" style={{animationDelay: '0.4s'}}>
          <div className="text-center mb-8 sm:mb-8">
            <h3 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-300 to-blue-300 tracking-tight">
              Patient Image Archive
            </h3>
            <p className="text-slate-150 mt-3 text-lg sm:text-md font-medium">Securely stored diagnostic images — tap to view full size.</p>
            <div className="w-24 sm:w-28 h-1.5 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 mx-auto mt-4 sm:mt-4 rounded-full animate-gradient"></div>
          </div>

          {user.images && user.images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6">
              {user.images.map((img, idx) => (
                <div
                  key={idx}
                  className="group relative rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-900/40 hover:bg-slate-900/60 transition-all duration-300 hover:scale-[1.02] shadow-xl hover:shadow-cyan-500/20 cursor-pointer animate-fade-in"
                  role="button"
                  tabIndex={0}
                  onClick={() => window.open(img.url, '_blank')}
                  onKeyDown={(e) => { if (e.key === 'Enter') window.open(img.url, '_blank') }}
                  aria-label={`Open x-ray ${idx + 1} in new tab`}
                  style={{animationDelay: `${0.1 * idx + 0.5}s`}}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-400/0 via-cyan-400/6 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
                  <img
                    src={img.url}
                    alt={`User x-ray ${idx + 1}`}
                    className="w-full h-56 sm:h-56 object-cover rounded-t-2xl group-hover:brightness-105 group-hover:contrast-110 transition-all duration-500"
                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/600x400?text=Image+Unavailable'; }}
                  />
                  <div className="p-4 bg-slate-800/80 backdrop-blur-sm border-t border-slate-700/50">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-lg sm:text-md font-bold text-teal-300">X-ray #{idx + 1}</p>
                        <p className="text-sm sm:text-sm font-mono text-slate-100">Scan Date: {new Date().toLocaleDateString()}</p>
                      </div>
                      <span className="text-sm sm:text-lg font-mono px-3 sm:px-3 py-2 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40 transition-transform duration-300 group-hover:scale-105">
                        View
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="col-span-full text-center py-12 sm:py-12 text-slate-400 text-lg sm:text-lg border border-dashed border-slate-700/50 rounded-2xl bg-slate-900/30">
              <span className='text-4xl sm:text-4xl mb-4 block'>⚠️</span>
              <p className='font-semibold text-lg'>No Diagnostic Images Uploaded Yet.</p>
              <p className='text-sm sm:text-sm text-slate-500 mt-2'>Upload your medical scans to view them here.</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient { background-size: 200% 200%; animation: gradient 3s ease infinite; }
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float 6s ease-in-out infinite; animation-delay: 3s; }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down { animation: slide-down 0.6s ease-out; }
        @keyframes slide-right {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-right { animation: slide-right 0.6s ease-out; }
        @keyframes slide-left {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-left { animation: slide-left 0.6s ease-out; }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.6s ease-out; }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in { animation: scale-in 0.6s ease-out; }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
      `}</style>
    </div>
  );
};

export default UserProfile;

