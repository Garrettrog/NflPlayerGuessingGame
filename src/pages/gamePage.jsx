import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import Headshot from '../components/TremaineEdmunds.png';
import Silhouette from '../components/TremaineEdmundsS.png';
import { useDailyPlayer } from '../hooks/useDailyPlayerCurrent';
import { supabase } from '../utils/supabaseClient';

const GamePage = () =>
{
    const { player, loading, error } = useDailyPlayer();
    const [guess, setGuess] = useState('');
    const [guessesLeft, setGuessesLeft] = useState(null);
    const [isCorrect, setIsCorrect] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [leaderboard, setLeaderboard] = useState([]);
    const userId = localStorage.getItem('user_id');

    useEffect(() =>
    {
        const fetchGuesses = async () =>
        {
            const today = new Date().toISOString().split('T')[0];
            const { data, error } = await supabase
                .from('users')
                .select('guesses_current, game_status, last_played_date')
                .eq('id', userId)
                .single();
            console.log('Update result:', data, error);

            if (!error && data)
            {
                if (data.last_played_date !== today)
                {
                    await supabase
                        .from('users')
                        .update({
                            guesses_current: 4,
                            game_status: 'in_progress',
                            last_played_date: today
                        })
                        .eq('id', userId);

                    setGuessesLeft(4);
                    setIsCorrect(false);
                    setIsGameOver(false);
                } else {
                    setGuessesLeft(data.guesses_current);
                    setIsCorrect(data.game_status === 'won');
                    setIsGameOver(data.game_status === 'lost');
                }
            };
        }
        
        const fetchLeaderboard = async () =>
        {
            const { data, error } = await supabase
                .from('users')
                .select('username, wins_current')
                .order('wins_current', { ascending: false })
                .limit(10);

            if (error)
            {
                console.error('Leaderboard error:', error);
            } else
            {
                setLeaderboard(data);
            }
        };

        fetchLeaderboard();
        fetchGuesses();
    }, [userId]);

    if (loading) return <p>Loading player...</p>;
    if (error || !player) return <p>Error loading player.</p>;
    //if (guessesLeft === null) return <p>Loading guesses...</p>;

    const handleGuess = async (e) =>
    {
        e.preventDefault();
        const today = new Date().toISOString().split('T')[0];
        if (guessesLeft <= 0 || isCorrect || isGameOver) return;

        if (guess.trim().toLowerCase() === player.name.toLowerCase()) {
            setIsCorrect(true);
            const { data: userRow } = await supabase
                .from('users')
                .select('wins_current')
                .eq('id', userId)
                .single();

            const newWins = (userRow?.wins_current || 0) + 1;

            await supabase
                .from('users')
                .update({ wins_current: newWins, guesses_current: 4, game_status: 'won', last_played_date: today  })
                .eq('id', userId);
        } else {
            const newGuesses = guessesLeft - 1;
            setGuessesLeft(newGuesses);

            if (newGuesses <= 0) {
                setIsGameOver(true);
                await supabase
                    .from('users')
                    .update({ guesses_current: 4, game_status: 'lost', last_played_date: today })
                    .eq('id', userId);
            } else {
                await supabase
                    .from('users')
                    .update({ guesses_current: newGuesses, game_status: 'in_progress', last_played_date: today })
                    .eq('id', userId);
            }
        }
        setGuess('');
    };

    //Add in reveal: <img src={FullImage} alt="Player action shot" className="player-img" />

    return (
        <div className="game-wrapper">
            {isCorrect && <Confetti />}
            {isCorrect ? (
                <div className="correct-box">
                    <h2 className="correct-text">✅ Correct! The player is {player.name}</h2>
                    {/* Reveal images */}
                </div>
            ) : isGameOver ? (
                <div className="game-over-box">
                    <h2 className="game-over-text">❌ Out of guesses! The player was {player.name}</h2>
                    {/* Reveal images */}
                </div>
            ) : (
                <div className="guess-box">
                    <p className="guess-label">Guesses Left: {guessesLeft}</p>
                    <form onSubmit={handleGuess}>
                        <input
                            type="text"
                            value={guess}
                            onChange={(e) => setGuess(e.target.value)}
                            placeholder="Guess the Player"
                            className="guess-input"
                        />
                        <button type="submit" className="auth-button">Submit</button>
                    </form>
                </div>
            )}

            <div className="game-container">
                <div className="silhouette-box">
                    {!isCorrect && !isGameOver? (
                        <img src={Silhouette} alt="Player silhouette" className="silhouette-img" />
                    ) : (
                        <div className="reveal-images">
                            <img src={Headshot} alt="Player headshot" className="player-img" />
                        </div>
                    )}
                </div>

                <div className="attribute-box">
                    <h2 className="attribute-title">Player Attributes</h2>
                    <ul className="attribute-list">
                        <li>Team: {player.current_team}</li>
                        <li>Position: {player.position}</li>
                        <li>Number: {player.number}</li>
                        <li>Height: {player.height}</li>
                        <li>Weight: {player.weight} lbs</li>
                        <li>Age: {player.age}</li>
                        <li>Experience: {player.experience}</li>
                        <li>College: {player.college}</li>
                        <li>Tackles: {player.tackles}</li>
                        <li>INTs: {player.ints}</li>
                        <li>Sacks: {player.sacks}</li>
                        <li>TFLs: {player.tfls}</li>
                    </ul>
                </div>
            </div>
            <div className="leaderboard">
                <h2>🏆 Leaderboard</h2>
                <ol>
                    {leaderboard.map((user, index) => (
                        <li key={index}>
                            {user.username} — {user.wins_current} wins
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
};

export default GamePage;
