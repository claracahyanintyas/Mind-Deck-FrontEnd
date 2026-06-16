import { useState } from 'react'
import './App.css'
import HeaderComponent from './components/HeaderComponent'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CreateDeck from './pages/CreateDeck'
import DecksPage from './pages/DecksPage'
import DeckPage from './pages/DeckPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AuthProvider from './context/AuthContext'
import { Toaster } from 'react-hot-toast';


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
        </Routes>
      </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
