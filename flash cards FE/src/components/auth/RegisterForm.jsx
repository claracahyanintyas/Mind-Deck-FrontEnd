import React from 'react'
import toast from 'react-hot-toast';
import AuthService from '../../services/AuthService';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const user = {username, email, password}
            const response = await AuthService.register(user);
            toast.success("Successfully registered")
            navigate('/login');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data.message); 
            } else {
                toast.error("Something went wrong");
            }
        }
    };

    return (
        <div className="container mt-5">
                        <div className="flex flex-col items-center justify-center p-4 w-full text-[#2F4156]">
                            {message && <div className="alert alert-info">{message}</div>}
                            <form onSubmit={handleRegister} className='flex flex-col items-center justify-center text-left space-y-2 w-1/2'>
                                <div className="flex flex-col w-full">
                                    <label>Username</label>
                                    <input
                                        type="text"
                                        className="border-[#C8D9E6] border-2 p-1 rounded-md"
                                        name="username"
                                        value={username}
                                        data-cy="username"
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col w-full">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        className="border-[#C8D9E6] border-2 p-1 rounded-md"
                                        name='email'
                                        value={email}
                                        data-cy="email"
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col w-full">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        className="border-[#C8D9E6] border-2 p-1 rounded-md"
                                        name='password'
                                        value={password}
                                        data-cy="password"
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <button type="submit" 
                                    data-cy="submit-form"
                                    className="bg-[#C8D9E6] mt-2 p-2 rounded-md hover:bg-[#567C8D]">Register</button>
                            </form>
                        </div>
        </div>
    );
}

export default RegisterForm