import React from 'react';
import { Link } from 'react-router-dom'

function NavBar () {
    return (
        <header>
            <nav>
                <ul id="navigation-container">
                    <div className="links">
                        <Link to ="/sign-up">
                            <button>
                                <span>SIGN-UP</span>
                            </button>
                        </Link>
                        <Link to ="/log-in">
                            <button>
                                <span>LOG-IN</span>
                            </button>
                        </Link>
                        <Link to ="/log-in">
                            <button>
                                <span>LOG-OUT</span>
                            </button>
                        </Link>
                    </div>
                </ul>
            </nav>
        </header>
    );
}

export default NavBar