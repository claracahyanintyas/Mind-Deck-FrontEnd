import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import AuthService from '../../services/AuthService';
import toast from 'react-hot-toast';

const LoginForm = () => {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const { login, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const credentials = {usernameOrEmail, password}
            const response = await AuthService.login(credentials);
            const userData = response.data.user;     // adjust to your backend response
            const token = response.data.accessToken;
            login(userData, token);
            toast.success("Successfully logged in")
            navigate('/');
        } catch (error) {
            let message = "Something went wrong";

                if (error.response) {
                    if (error.response.data?.error) {
                        message = error.response.data.error;
                    } 
                    else if(error.response.data?.errors){
                        const errorList = error.response.data.errors;

                        errorList.forEach((err) => {
                        // If 'err' is a string, use it. If it's an object, grab its 'defaultMessage'
                        const message = typeof err === 'object' ? err.defaultMessage : err;
                        
                        toast.error(message || "Validation failed");
                        });
                    }
                    else if (error.response.status === 401) {
                        message = "Invalid username or password.";
                    }
                    else if (error.response.data?.message) {
                        message = error.response.data.message;
                    }
                } else {
                    message = error.message;
                }

                toast.error(message);
                setMessage('Invalid credentials');
        }
    };

      return (
    <div>
      {isAuthenticated ? (
        <p>Already logged in!</p>
      ) : (
        <div className="flex flex-col items-center justify-center p-4 w-full text-[#2F4156]">
                            {message && <div className="alert alert-danger">{message}</div>}
                            <form onSubmit={handleLogin} className='flex flex-col items-center justify-center text-left space-y-2 w-1/2'>
                                <div className="flex flex-col w-full">
                                    <label className='py-1'>Username or Email</label>
                                    <input
                                        name='usernameOrEmail'
                                        type="text"
                                        className='border-[#C8D9E6] border-2 p-1 rounded-md'
                                        value={usernameOrEmail}
                                        data-cy="usernameOrEmail"
                                        onChange={(e) => setUsernameOrEmail(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col w-full">
                                    <label className='py-1'>Password</label>
                                    <input
                                        name='password'
                                        type="password"
                                        className='border-[#C8D9E6] border-2 p-1 rounded-md'
                                        value={password}
                                        data-cy="password"
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <button type="submit" 
                                  data-cy="submit-form"
                                  className="bg-[#C8D9E6] mt-2 p-2 rounded-md hover:bg-[#567C8D]">Login</button>
                            </form>
                            <div className="mt-3">
                                <span >Not registered? <Link to="/register" className='underline hover:text-[#567C8D]'>Register here</Link></span>
                            </div>
        </div>
      )}
    </div>
  );
}

export default LoginForm;