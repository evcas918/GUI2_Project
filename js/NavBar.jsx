import React from 'react';
import { Link } from 'react-router-dom'

function NavBar () {
    
    return (
        <header>
            <h1>
                ThinkDock
            </h1>
            <nav>
                <ul id="navigation">
                    <div className="links">
                    <li><a href="#" class="on">Home</a></li>
                    <li><a href="#">About</a></li>
                    <li><Link to ="/workspace">New Project</Link></li>
                    <li><a href="#">Contact</a></li></div>
                </ul>
            </nav>
        </header>
    );
}

export default NavBar