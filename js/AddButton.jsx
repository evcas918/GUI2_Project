import addbutton from './assets/Blue_Add_Sign.svg'
import React from 'react';
import { Link } from 'react-router-dom'

function AddButton() {
    return (
        <div id="add-container">
            <Link to ="/workspace">
                <button  style={{float: 'right'}}>
                    <img src={addbutton} alt="Add Button" width="50" height="50"/>
                </button>
            </Link>
        </div>
    );
}

export default AddButton