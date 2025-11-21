import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import { supabase } from '../utils/supabaseClient';

const LoginPage = () =>
{
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const handleStart = async (e) =>
    {
        e.preventDefault();
        if (!username) {
            alert('Please enter a username');
            return;
        }

        const { data, error } = await supabase
            .from('users')
            .select('id, username')
            .eq('username', username)
            .maybeSingle();

        let userId;
        if (error)
        {
            console.error('Error fetching user:', error);
            return;
        }
        if (!data) {
            const { data: newUser, error: insertError } = await supabase
                .from('users')
                .insert({
                    username,
                    wins_current: 0,
                    wins_hof: 0,
                    guesses_current: 4,
                    guesses_hof: 4,
                    game_status_current: 'in_progress',
                    game_status_hof: 'in_progress',
                    last_played_date_current: new Date().toISOString().split('T')[0],
                    last_played_date_hof: new Date().toISOString().split('T')[0]
                })
                .select()
                .single();

            if (insertError) {
                console.error('Error creating user:', insertError);
                return;
            }

            userId = newUser.id;
        } else {
            userId = data.id;
        }

        localStorage.setItem('user_id', userId);
        localStorage.setItem('username', username);

        navigate('/game');
    };

    return (
        <div className="auth-container">
            <h1 className="auth-title">Enter a Username</h1>
            <form onSubmit={handleStart}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="auth-input"
            />
                <button type="submit" className="auth-button">
                    Start Game
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
