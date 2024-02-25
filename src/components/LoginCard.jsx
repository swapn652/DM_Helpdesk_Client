import React, { useState, useEffect } from 'react';
import { Card, CardContent, TextField, Checkbox, FormControlLabel, Typography, Link } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useToken } from '../TokenContext.jsx';
import { useNavigate } from "react-router-dom";

export const LoginCard = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { token, updateToken } = useToken();
    const navigate = useNavigate();

    useEffect(() => {
        if(token !== "")
            navigate("/fb-integration");
    }, [token])

    const handleLogin = async () => {
        try {
            const response = await fetch('https://fbdmhelpdeskserver-production.up.railway.app/user-auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                const { token } = data;
                // Store the token in localStorage or sessionStorage
                updateToken(token);
                console.log("login successs");
                // toast.success('Login successful');
                navigate("/fb-integration");
            } else {
                const error = await response.json();
                toast.error(error.error);
            }
        } catch (error) {
            console.error('Error during login:', error);
            toast.error('Internal Server Error');
        }
    };

    return (
        <>
            <Card sx={{ width: 400, p: 2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <CardContent >
                <Typography variant="h5" gutterBottom style={{ textAlign: 'center' }}>
                    Login to your account
                </Typography>
                    <form>
                        <TextField
                            id="email"
                            label="Email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            id="password"
                            label="Password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <FormControlLabel
                            control={<Checkbox />}
                            label="Remember me"
                        />
                        <button
                            type="button" // Make sure it's not a submit button to prevent form submission
                            className='bg-blue-900 w-[100%] text-white p-2 rounded-xl'
                            onClick={handleLogin}
                        >
                            Login
                        </button>
                    </form>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                        Don't have an account? <Link href="/" underline="always">Sign Up</Link>
                    </Typography>
                </CardContent>
            </Card>
            <ToastContainer/>
        </>
    )
}
