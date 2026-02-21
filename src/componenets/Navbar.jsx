


import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import TextPressure from './TextPressure';

const Navbar = () => {
  const user = useSelector((state) => state.userReducer.users);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <nav className="sticky top-0 w-full z-50 bg-gray-900/30 backdrop-blur-lg border-b border-white/10 shadow-lg px-6 py-4 flex justify-between items-center">
      
      {/* Logo / Brand — ORIGINAL */}
      <div className="text-white font-extrabold md:text-2xl text-sm tracking-wider drop-shadow-lg md:w-4 w-[50px]">
        <NavLink to="/">
          <div style={{position: 'relative', height: '', width: "120px"}}>
            <TextPressure
              text="TumourTrace.ai"
              flex={true}
              alpha={false}
              stroke={true}
              strokeColor="#ff0000"
              strokeWidth={5}
              width={10}
              weight={900}
              italic={true}
              textColor="#ffffff"
              minFontSize={33}
              style={{ textTransform: 'lowercase' }}
            />
          </div>
        </NavLink>
      </div>

      {/* Desktop: Links — ORIGINAL, only shown when not mobile */}
      {!isMobile && (
        <div className="flex gap-8 items-center text-white text-lg font-medium">
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "text-blue-400 border-b-2 border-blue-400 pb-1 transition-all"
                : "hover:text-blue-400 hover:border-b-2 hover:border-blue-400 pb-1 transition-all"
            }
            to="/"
          >
            Home
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "text-blue-400 border-b-2 border-blue-400 pb-1 transition-all"
                : "hover:text-blue-400 hover:border-b-2 hover:border-blue-400 pb-1 transition-all"
            }
            to={user ? `/detect/${user.id}` : "/login"}
          >
            {user ? "Upload X-ray" : "Login"}
          </NavLink>
        </div>
      )}

      {/* Desktop: User Avatar — ORIGINAL, only shown when not mobile */}
      {!isMobile && user && (
        <Link to="/profile">
          <div className="ml-6">
            <div className="px-2 w-auto h-7 rounded bg-gradient-to-tr from-blue-800 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
              {user.username.toUpperCase()}
            </div>
          </div>
        </Link>
      )}

      {/* Mobile: avatar + hamburger */}
      {isMobile && (
        <div className="flex items-center gap-3">
          {user && (
            <Link to="/profile">
              <div className="px-2 h-7 rounded bg-gradient-to-tr from-blue-800 to-purple-500 flex items-center justify-center text-white font-bold shadow-md text-xs">
                {user.username.toUpperCase()}
              </div>
            </Link>
          )}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white focus:outline-none p-1"
            aria-label="Toggle menu"
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span className={`block h-0.5 bg-white rounded transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 bg-white rounded transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
              <span className={`block h-0.5 bg-white rounded transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      )}

      {/* Mobile dropdown */}
      {isMobile && menuOpen && (
        <div className="absolute top-full left-0 w-full bg-gray-900/95 backdrop-blur-lg border-b border-white/10 flex flex-col gap-1 px-6 py-3 z-50">
          <NavLink
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `px-2 py-2.5 rounded-lg text-base font-medium transition-all ${isActive ? "text-blue-400 bg-blue-400/10" : "text-white hover:text-blue-400 hover:bg-white/5"}`
            }
            to="/"
          >
            Home
          </NavLink>
          <NavLink
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `px-2 py-2.5 rounded-lg text-base font-medium transition-all ${isActive ? "text-blue-400 bg-blue-400/10" : "text-white hover:text-blue-400 hover:bg-white/5"}`
            }
            to={user ? `/detect/${user.id}` : "/login"}
          >
            {user ? "Upload X-ray" : "Login"}
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

