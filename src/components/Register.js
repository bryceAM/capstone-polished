import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    createCart,
    insertUser
} from '../axios-services/index.js';
import '../styles/Register.css';

function Register({ token, setToken }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [address2, setAddress2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        /*
            If the client receives a token, that means they're logged in,
            so redirect to the homepage.
        */
        const timer = setTimeout(() => {
            if (token) navigate('/');
        }, 1500);
        return () => clearTimeout(timer);
    }, [token]);

    async function handleSubmit(event) {
        /*
            Register the user, storing user's token in localstorage,
            and creating a new cart for the user.
        */
        event.preventDefault();

        try {
            const registered = await insertUser(username, password, email, firstName, lastName, address, address2, city, state, zip);
            
            setToken(registered.token);
            localStorage.setItem('token', registered.token);

            const userId = registered.user.id;
            await createCart(userId);
        } catch (err) {
            console.error(err);
        };
    };

    return (
        <div id="registerContent">
            <div className="registerCard">
                <form onSubmit={(event) => handleSubmit(event)}>
                    {
                        token ? (
                            <div id="redirectContainer">
                                <div>Logged in.</div>
                                <div>Redirecting...</div>
                            </div>
                        ) : (
                            <>
                                <div id="username">
                                    <label id="usernameLabel">New Username</label>
                                    <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} />
                                </div>
                                <div id="password">
                                    <label id="passwordLabel">New Password</label>
                                    <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
                                </div>
                                <div id="firstName">
                                    <label id="firstNameLabel">First Name</label>
                                    <input type="text" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
                                </div>
                                <div id="lastName">
                                    <label id="lastNameLabel">Last Name</label>
                                    <input type="text" value={lastName} onChange={(event) => setLastName(event.target.value)} />
                                </div>
                                <div id="email">
                                    <label id="emailLabel">Email</label>
                                    <input type="text" value={email} onChange={(event) => setEmail(event.target.value)} />
                                </div>
                                <div id="address">
                                    <label id="addressLabel">Address</label>
                                    <input type="text" value={address} onChange={(event) => setAddress(event.target.value)} />
                                </div>
                                <div id="address2">
                                    <label id="address2Label">Address 2</label>
                                    <input type="text" value={address2} onChange={(event) => setAddress2(event.target.value)} />
                                </div>
                                <div id="city">
                                    <label id="cityLabel">City</label>
                                    <input type="text" value={city} onChange={(event) => setCity(event.target.value)} />
                                </div>
                                <div id="state">
                                    <label id="stateLabel">State</label>
                                    <input type="text" value={state} onChange={(event) => setState(event.target.value)} />
                                </div>
                                <div id="zip">
                                    <label id="zipLabel">Zip/Postal</label>
                                    <input type="text" value={zip} onChange={(event) => setZip(event.target.value)} />
                                </div>
                                <button type="submit">Register</button>
                                <div id="loginContainer">Already registered? <Link to="./Login.js">Login here</Link></div>
                            </>
                        )
                    }
                </form>
            </div>
        </div>
    );
};

export default Register;