import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { createUserWithEmailAndPassword, getAuth, } from "firebase/auth"
import { app } from "../firebase/firebase"
import './style.css'

function SignUpForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const auth = getAuth(app);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            console.log("Account Created");
        }catch(err) {
            console.log(err);
        }
    }

    const onReset = () => {
        setPassword("");
        setEmail("");
    };

    return (
        <div className='signup-container'>
            <form className='signup-form' onSubmit={handleSubmit}>
                <h1>Sign Up</h1>
                <label htmlFor="email">
                    Email:
                    <input type="email" onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Enter your email"
                    />
                </label>
                <label htmlFor="password">
                    Password:
                    <input type="password" onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    />
                </label>
                <Link to = "/home-page">
                <button onClick={(e) => handleSubmit(e)}>
                    <span>Submit</span>
                </button>
                </Link>
                <button
                    type="reset"
                    value="reset"
                    onClick={() => onReset()}
                >
                    Reset  
                </button>
                <p>Already Registered? <Link to="/log-in">Log-In</Link></p>
            </form>

        </div>
    )

}

export default SignUpForm