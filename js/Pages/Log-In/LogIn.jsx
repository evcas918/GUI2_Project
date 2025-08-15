import { Link, useNavigate } from "react-router-dom"
import './style.css'
import { useState } from "react";
import { signInWithEmailAndPassword, getAuth, sendEmailVerification, signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import { app } from "../firebase/firebase";

function LogIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const auth = getAuth(app);
    const navigate = useNavigate();
    const provider = new GoogleAuthProvider();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await sendEmailVerification(user);
            alert("A verification email has been sent to your email address. Please verify your email to log in.")
            navigate("/dashboard");
            console.log("Successfully Logged In");
        }catch(error) {
            console.error("Error during registration:", error);
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
            console.log("Successfully Logged In");
        }
        catch(error) {
            console.error("Error during log-in:", error);
        }
    }

    return (
        <div className='login-container'>
            <form className='login-form' onSubmit={handleSubmit}>
                <h1>Log In</h1>
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
                    <button
                    onClick={(e) => handleSubmit(e)}
                >
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
                <p>Not Registered? <Link to="/sign-up">Sign-Up</Link></p>
            </form>

        </div>
    )

}

export default LogIn