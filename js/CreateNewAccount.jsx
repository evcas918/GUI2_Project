import "./App.css";
import { React, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

function CreateNewAccount() {
    const [userName, setUsername] = useState("");
    const [passWord, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(
            userName,
            passWord,
            email
        );

        navigate('/log-in');
    };

    const handleReset = () => {
        setUsername("");
        setPassword("");
        setEmail("");
    };

    return (
        <div className="App">
            <h1>Create a New Account</h1>
            <fieldset>
                <form action="#" method="get">
                    <label for="username">
                        Username*
                    </label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        value={userName}
                        onChange={(e) =>
                            setUsername(e.target.value)
                        }
                        placeholder="Enter Your New Username"
                        required
                    />
                    <label for="password">Password*</label>
                    <input
                        type="text"
                        name="password"
                        id="password"
                        value={passWord}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        placeholder="Enter Your Password"
                        required
                    />
                    <label for="email">Enter Email* </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        placeholder="Enter email"
                        required
                    />
                    <button
                        type="reset"
                        value="reset"
                        onClick={() => handleReset()}
                    >
                        Reset
                    </button>
                    <button
                        type="submit"
                        value="Submit"
                        onClick={(e) => handleSubmit(e)}
                    >
                        Submit
                    </button>
                </form>
            </fieldset>
        </div>
    );
}

export default CreateNewAccount;