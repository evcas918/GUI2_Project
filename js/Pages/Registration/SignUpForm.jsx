import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithPopup, sendEmailVerification} from "firebase/auth"
import { app } from "../firebase/firebase"
import './style.css'

function SignUpForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const navigate = useNavigate();
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            await sendEmailVerification(user);
            alert("A verification email has been sent to your email address. Please verify your email to log in.")
            console.log("Account Created");
            navigate("/dashboard");
        }catch(err) {
            console.log(err);
        }
    }

    const onReset = () => {
        setPassword("");
        setEmail("");
    }

    const handleGoogle = async () => {
        try {
            const userCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user;

            await sendEmailVerification(user);
            alert("A verification email has been sent to your email address. Please verify your email to log in.");
            navigate("/dashboard");
            console.log("Successfully Created Account");
        }
        catch(error) {
            console.error("Error during registration:", error);
        }
    }

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
                <Link to = "/dashboard">
                <button onClick={(e) => handleSubmit(e)}>
                    <span>Submit</span>
                </button>
                </Link>
                <button style={{ marginLeft: '30px' }}
                    type="reset"
                    value="reset"
                    onClick={() => onReset()}
                >
                    Reset  
                </button>
                <button style={{ display: 'flex', marginLeft: '45px' }}
                    type="google"
                    value="google"
                    onClick={() => handleGoogle()}
                >
                    Continue with Google  
                </button>
                <p>Already Registered? <Link to="/log-in">Log-In</Link></p>
            </form>

        </div>
    )

}

export default SignUpForm