import { Link, useNavigate } from "react-router-dom"
import './style.css'
import { useState } from "react";
import { signInWithEmailAndPassword, getAuth} from "firebase/auth";
import { app } from "../firebase/firebase";

function LogIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const auth = getAuth(app);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password)
            navigate("/dashboard");
            console.log("Successfully Logged In");
        }catch(error) {
            console.log(error);
        }
    }

    const onReset = () => {
        setPassword("");
        setEmail("");
    };

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
                <button
                    type="reset"
                    value="reset"
                    onClick={() => onReset()}
                >
                    Reset  
                </button>
                <p>Not Registered? <Link to="/sign-up">Sign-Up</Link></p>
            </form>

        </div>
    )

}

export default LogIn