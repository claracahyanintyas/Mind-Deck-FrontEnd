import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logowhite.png';
import { AuthContext } from '../context/AuthContext'; // FIX: Wrap in curly braces

const HeaderComponent = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);

  // Helper check to identify anonymous users
  const isGuest = user?.roles?.includes('ROLE_GUEST');

  return (
    <div className="z-50">
      <header>
        <nav className="bg-[#374375] text-[#FFFCF5] shadow-md flex sticky w-full top-0 h-20 p-2 items-center justify-between text-lg">
          <div className='flex items-center gap-8'>
            <Link to="/">
              <img
                src={logo}
                alt="Site Logo"
                className="h-18 w-auto nav-link rounded-full"
              />
            </Link>
            <Link className="hover:text-[#DFAEA1]" to='/'>Home</Link>
            <Link className="hover:text-[#DFAEA1]" to='/decks'>Decks</Link>
            <Link className="hover:text-[#DFAEA1]" to='/create-deck'>Create Deck</Link>
          </div>

          <div className="flex items-center gap-6">
            {isAuthenticated && !isGuest ? (
              // Case 1: Real Registered User
              <>
                <Link className="nav-link hover:text-[#567C8D] p-2" to={`/users/${user.id}`}>Profile</Link>
                <button className="hover:text-[#DFAEA1]" onClick={logout}>Logout</button>
              </>
            ) : (
              // Case 2: Guest or Unauthenticated Visitor
              <>
                {isGuest && <span className="text-sm text-yellow-200">Browsing as Guest ({user.username})</span>}
                <Link className="hover:text-[#DFAEA1]" to="/login">Login</Link>
                <Link className="bg-[#DFAEA1] text-[#374375] px-3 py-1 rounded-md font-semibold hover:bg-white transition-all" to="/register">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
    </div>
  );
};

export default HeaderComponent;