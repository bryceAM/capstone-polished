import React from 'react';
// import CartIcon from '@mui/icons-material/ShoppingCart';
// import { Link } from 'react-router-dom';
import NavBar from './NavBar.js';
import '../styles/Header.css';

export default function Header() {
    // const logout = () => {
    //     localStorage.removeItem('username');
    //     localStorage.removeItem('token');
    //     localStorage.removeItem('isAdmin');
    //     window.location.reload();
    // };

    return (
        <div id="header">
            <div id="center_header">
                <div id="left_wrapper">
                    <div id="company_logo">
                        <img id="logoImg" src="https://i.imgur.com/BaNuMXZ.png" />
                    </div>
                    <div className="dropdown">
                        <div className="link">Menu</div>
                        <div id="nav_bar">
                            <NavBar />
                        </div>
                    </div>
                </div>
                <div id="right_wrapper">
                  
                        <div id="loginRegisterBlock">
                            <div id="loginRegister">
                                {/* <Link to="Login">Login</Link> */}
                                login placeholder
                                <div className="divider">|</div>
                                {/* <Link to="Register">Register</Link> */}
                                register placeholder
                            </div>
                        </div>
                    
                    <div id="cartBlock">
                        {/* <Link to="Cart">{<CartIcon sx={{ color: 'white' }} />}</Link> */}
                        cart placeholder
                    </div>
                    <div id="admin">
                        {/* <Link to="AdminHomePage" /> */}
                        admin placeholder
                    </div>
                </div>
            </div>
        </div>
    );
}
