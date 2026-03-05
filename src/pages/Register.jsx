import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import style from './Login.module.css';
import Button from '../components/button/Button';
import apiFetch from '../api'; // <-- use apiFetch

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Register form submitted'); // debug
        setError('');
        setLoading(true);

        try {
            const data = await apiFetch('/auth/register', { // relative path
                method: 'POST',
                body: JSON.stringify({ username, email, password }),
            });
            console.log('Registration successful', data);
            login(data.user, data.token);
            navigate('/');
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={style.container}>
            <div className={style.card}>
                <h1 className={style.title}>Create Account</h1>
                <form onSubmit={handleSubmit} className={style.form}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <p className={style.error}>{error}</p>}
                    <Button type="primary" size="medium" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </Button>
                </form>
                <p className={style.switch}>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}