import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';

function DashboardNB () {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            signOut(auth);
            alert("You have been signed out successfully");
            navigate("/");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <header>
            <nav>
                <ul id="navigation-container">
                    <h3>Welcome, {auth.currentUser?.displayName}</h3>
                    <button onClick={handleLogout}>
                        LOG-OUT
                    </button>
                </ul>
            </nav>
        </header>
    );
}

export default DashboardNB