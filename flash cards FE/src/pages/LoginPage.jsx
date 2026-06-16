import React, { useContext } from 'react';
import LoginForm from '../components/auth/LoginForm';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const { user, isAuthenticated, loginAsGuest, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Check if the current profile in state belongs to an anonymous guest session
  const isGuest = user && user.roles?.includes('ROLE_GUEST');

  const handleGuestClick = async () => {
    await loginAsGuest();
    navigate('/decks');
  };

  return (
    <div className='mx-auto text-center mt-10 px-4'>
      <h2 className='text-xl font-semibold mb-4 text-[#374375]'>
        {isAuthenticated ? "Welcome Back!" : "Login here"}
      </h2>
      
      <div className=' mx-auto rounded-sm p-6 shadow-sm'>
        
        {/* CASE 1: Completely unauthenticated user - Show the full standard login forms */}
        {!user && (
          <>
            <LoginForm />

            <div className='relative flex py-5 items-center w-full'>
              <div className='flex-grow border-t border-[#374375]/30'></div>
              <span className='flex-shrink mx-3 text-[#374375] text-xs font-bold uppercase tracking-wider'>OR</span>
              <div className='flex-grow border-t border-[#374375]/30'></div>
            </div>

            <button 
              type="button"
              onClick={handleGuestClick}
              className="bg-[#895159] text-[#FFFCF5] p-2 w-full rounded-md font-medium transition-colors hover:bg-[#374375]"
            >
              Continue as Guest
            </button>
          </>
        )}

        {/* CASE 2: The current user is an active anonymous guest */}
        {isGuest && (
          <div className="space-y-4 py-4 text-[#374375]">
            <p className="font-medium">
              You are currently browsing temporary session: <span className="font-bold">{user.username}</span>
            </p>
            <p className="text-sm opacity-90">
              Want to save your progress permanently? Create a full account, or sign out to swap profiles.
            </p>
            <div className="flex flex-col">
            <button 
              type="button"
              onClick={() => navigate('/register')}
              className="bg-[#374375] text-[#FFFCF5] p-2  rounded-md font-medium transition-colors hover:bg-[#895159] mb-2"
            >
              Register / Upgrade Account
            </button>

            <button 
              type="button"
              onClick={logout}
              className="bg-[#895159] text-[#FFFCF5] p-2  rounded-md font-medium transition-colors hover:bg-red-700"
            >
              Exit Guest Session (Logout)
            </button>
            </div>
          </div>
        )}

        {/* CASE 3: A fully registered user happens to load the login page layout */}
        {isAuthenticated && !isGuest && (
          <div className="space-y-4 py-6 text-[#374375]">
            <p className="font-medium">You are already logged in as <span className="font-bold">{user.email}</span></p>
            
            <button 
              type="button"
              onClick={() => navigate('/decks')}
              className="bg-[#374375] text-[#FFFCF5] p-2 w-full rounded-md font-medium transition-colors hover:bg-[#895159]"
            >
              Go to My Decks
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default LoginPage;