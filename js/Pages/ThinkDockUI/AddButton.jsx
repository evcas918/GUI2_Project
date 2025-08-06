import React from 'react';
import { Link } from 'react-router-dom';

function AddButton() {
    return (
        <div id="add-container">
            <Link to ="/workspace">
                <button  style={{float: 'right',  position: 'relative'}}>
                    <span>NEW PROJECT SPACE</span>
                </button>
            </Link>
        </div>
    );
}

export default AddButton