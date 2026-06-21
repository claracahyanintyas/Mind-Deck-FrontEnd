window.global ||= window;
import { useState, useEffect, useContext } from 'react'
import './App.css'
import HeaderComponent from './components/HeaderComponent'
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CreateDeck from './pages/CreateDeck'
import DecksPage from './pages/DecksPage'
import DeckPage from './pages/DeckPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AuthProvider, { AuthContext } from './context/AuthContext'
import { Toaster } from 'react-hot-toast';
import ClassroomTest from './components/classroom/ClassroomTest'
import ClassroomVote from './components/classroom/ClassroomVote';
import ClassroomTeacher from './components/classroom/ClassroomTeacher';
import ReviewPage from './pages/ReviewPage';
import { User, ShieldAlert } from 'lucide-react';

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // 1. Wait until the background session check finishes completely
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 font-medium">
        Initializing session...
      </div>
    );
  }

  // 2. Clear & explicit: If no valid User or Guest session exists, redirect them to login!
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. If they are logged in or are an initialized guest, let them through
  return children;
}

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 5000,
          className: 'bg-[#567C8D] text-white rounded-md px-4 py-2 shadow-lg'
        }}
      />
      <BrowserRouter>
        <AuthProvider>
          <HeaderComponent />
          <Routes>
            <Route path='/' element = { <HomePage />}></Route>
            <Route path='/create-deck' element = { <CreateDeck />}></Route>
            <Route path='/decks' element = { <DecksPage />}></Route>
            <Route path='/login' element = {<LoginPage />}></Route>
            <Route path='/register' element = {<RegisterPage/>} ></Route>
            <Route path='/decks/:id' element = {<DeckPage />}></Route>
            
            {/* Handled perfectly via the 1-click execution module wrapper */}
            <Route path='/classroom' element={
              <ProtectedRoute><ClassroomVote/></ProtectedRoute>
            }></Route>
            <Route path='/classroom/teacher' element = {
              <ProtectedRoute><ClassroomTeacher/></ProtectedRoute>
            }></Route>
            <Route path='/review/:reviewId' element = {
              <ProtectedRoute><ReviewPage/></ProtectedRoute>
            }></Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App;