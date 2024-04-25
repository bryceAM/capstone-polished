import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../axios-services/index.js'

function Login({ token, setToken, setUser }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        /*
            if during the login process on this page the user
            receives a token in their local storage, then
            automatically navigate to the home page after a set
            time period and clear the timer to avoid side
            effects.
        */
        const timer = setTimeout(() => {
            if (token) navigate('/');
        }, 1500);

        return () => clearTimeout(timer);
    }, [token]);

    const handleSubmit = async (event, username, password) => {
        /*
            logs the user in.
            retrieves user object and token from the response.
            sets the user and token state for ease of rendering.
            stores token in local storage for secure global use.
        */
        event.preventDefault();

        try {
            const response = await loginUser(username, password);
            const user = response.data.user;
            const token = response.data.token;

            setUser(user);
            setToken(token);
            localStorage.setItem('token', token);
        } catch (err) {
            console.error(err);
        };
    };

    return (
        <div id="loginContent">
            <div className="loginCard">
                <form onSubmit={(event) => handleSubmit(event, username, password)}>
                    {token ? (
                        <div id="redirectContainer">
                            <div>Logged in.</div>
                            <div>Redirecting...</div>
                        </div>
                    ) : (
                        <>
                            <div id="username">
                                <label id="usernameLabel">Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(event) => setUsername(event.target.value)}
                                ></input>
                            </div>
                            <div id="password">
                                <label id="passwordLabel">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                ></input>
                            </div>
                            <button type="submit">Login</button>
                            <div id="registerContainer">
                                No account? <Link to="../Register">Register here</Link>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}

export default Login;