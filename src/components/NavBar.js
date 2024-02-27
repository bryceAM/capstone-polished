import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Context from '../context.js';
import '../styles/NavBar.css';

function NavBar() {
    const { isAdmin } = useContext(Context);
    const style = {
        textDecoration: 'none',
        color: 'black'
    };

    return (
        <div id='nav_bar_inner'>
            <div id='home'>
                <Link style={style} to="/">Home</Link>
            </div>
            {/* <div id='products'>
                <Link style={{ textDecoration: 'none', color: 'black' }} to="Products">Products</Link>
            </div>
            <div id='profile'>
                <Link style={{ textDecoration: 'none', color: 'black' }} to="Profile">Profile</Link>
            </div>
            <div id='cart'>
                <Link style={{ textDecoration: 'none', color: 'black' }} to="Cart">Cart</Link>
            </div> */}
            {isAdmin ?
                <div id='admin'>
                    {/* <Link style={{ textDecoration: 'none', color: 'black' }} to="AdminHomePage">Admin</Link> */}
                    isAdmin placeholder link
                </div>
                : null
            }
        </div>
    )
}

export default NavBar;