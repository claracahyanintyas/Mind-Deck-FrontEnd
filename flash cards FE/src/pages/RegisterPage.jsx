import React from 'react'
import { Link } from 'react-router-dom'
import RegisterForm from '../components/auth/RegisterForm'

function HomePage() {
  return (
    <div className="text-3xl">
      <RegisterForm></RegisterForm>
      <div className="mt-3">
        <span>Already registered? <Link to="/login" className='underline'>Login here</Link></span>
      </div>
    </div>
  )
}

export default HomePage