import React, { useState } from 'react';
import { Card, CardContent, TextField, Checkbox, FormControlLabel, Typography, Link } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const SignUpCard = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async () => {
        try {
            const response = await fetch("https://fbdmhelpdeskserver-production.up.railway.app/user-auth/sign-up", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            if (response.ok) {
                console.log("User signed up successfully");
                setName('');
                setEmail('');
                setPassword('');
                toast.success("Sign Up successful");
            } else {
                console.error("Failed to sign up");
                toast.error("Sign Up failed")
            }
        } catch (error) {
            console.error('Error signing up:', error);
        }
    };

    return (
        <>
            <Card sx={{ width: 400, p: 2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <CardContent >
                <Typography variant="h5" gutterBottom style={{ textAlign: 'center' }}>
                    Create Account
                </Typography>
                    <form>
                        <TextField
                            id="name"
                            label="Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
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
                            onClick={handleSignUp}
                        >
                            Sign Up
                        </button>
                    </form>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                        Already have an account? <Link href="/login" underline="always">Login</Link>
                    </Typography>
                </CardContent>
            </Card>
            <ToastContainer />
        </>
    )
}
