import React, { useRef } from 'react';
import axios from 'axios';

const Signup = () => {
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const handleSignup = async () => {
        try{
            console.log(emailRef.current?.value);
            const data = await axios.get('https://localhost:3000/api/v1/user/signup',
                {
                    email : emailRef.current?.value ,
                    name  : nameRef.current?.value ,
                    password : passwordRef.current?.value
                }
            )
            console.log(data);
        }
        catch(e){
            console.log(e);
        }
    }
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
                <form className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Name</label>
                        <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300" placeholder="John Doe" ref={nameRef} />
                    </div>
                    <div>
                        <label className="block text-gray-700">Email</label>
                        <input type="email" className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300" placeholder="john@example.com" ref={emailRef} />
                    </div>
                    <div>
                        <label className="block text-gray-700">Password</label>
                        <input type="password" className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300" placeholder="********" ref={passwordRef} />
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700" onClick={handleSignup}>Sign Up</button>
                </form>
                <p className="text-center text-gray-600 mt-4">Already have an account? <a href="#" className="text-indigo-600">Login</a></p>
            </div>
        </div>
    );
};

export default Signup;
