import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import { supabase } from '../utils/supabaseClient';


const SignUp = () =>
{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async () => {
        const { data: user, error } = await supabase
            .from('users')
            .insert([{ username, password, wins_current: 0, wins_hof: 0}]);

        if (error) {
            alert('Sign up failed: ' + error.message);
        } else {
            alert('Account created! You can now sign in.');
            localStorage.setItem('user_id', user.id);
        }
        navigate('/game')
    };

    return (
        <div className="auth-container">
            <h1 className="auth-title">Create Your Account</h1>
            <input
                type="text"
                placeholder="Choose a Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="auth-input"
            />
            <input
                type="password"
                placeholder="Create a Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="auth-input"
            />
            <button onClick={handleSignUp} className="auth-button">Sign Up</button>
        </div>
    );
}

export default SignUp;
