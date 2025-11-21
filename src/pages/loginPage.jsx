import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import { supabase } from '../utils/supabaseClient';

const LoginPage = () =>
{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        const { data , error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .eq('password', password)
            .single();

        if (error || !data) {
            alert('Invalid credentials');
        } else {
            localStorage.setItem('user_id', data.id);
            navigate('/game');
        }
    };

    return (
        <div className="auth-container">
            <h1 className="auth-title">Login to Play</h1>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="auth-input"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="auth-input"
            />
            <div className="auth-buttons">
                <button onClick={handleLogin} className="auth-button">Sign In</button>
                <button onClick={() => navigate('/signUp')} className="auth-button alt">Sign Up</button>
            </div>
        </div>
    );

};

export default LoginPage;
