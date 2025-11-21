import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useNavigate } from 'react-router-dom';
import Headshot from '../components/AndreJohnson.png';
import Silhouette from '../components/AndreJohnsonS.png';
import { useDailyPlayer } from '../hooks/useDailyPlayerHOF';
import { supabase } from '../utils/supabaseClient';

const GamePage = () =>
{
    const { player, loading, error } = useDailyPlayer();
    const [guess, setGuess] = useState('');
    const [guessesLeft, setGuessesLeft] = useState(null);
    const [isCorrect, setIsCorrect] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [leaderboard, setLeaderboard] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [allPlayers, setAllPlayers] = useState([]);
    const userId = localStorage.getItem('user_id');
    const navigate = useNavigate();

    useEffect(() =>
    {
        const fetchGuesses = async () =>
        {
            const today = new Date().toISOString().split('T')[0];
            const { data, error } = await supabase
                .from('users')
                .select('guesses_hof, game_status_hof, last_played_date_hof')
                .eq('id', userId)
                .single();
            console.log('Update result:', data, error);

            if (!error && data)
            {
                if (data.last_played_date_hof !== today)
                {
                    await supabase
                        .from('users')
                        .update({
                            guesses_hof: 4,
                            game_status_hof: 'in_progress',
                            last_played_date_hof: today
                        })
                        .eq('id', userId);

                    setGuessesLeft(4);
                    setIsCorrect(false);
                    setIsGameOver(false);
                } else {
                    setGuessesLeft(data.guesses_hof);
                    setIsCorrect(data.game_status_hof === 'won');
                    setIsGameOver(data.game_status_hof === 'lost');
                }
            };
        }
        
        const fetchLeaderboard = async () =>
        {
            const { data, error } = await supabase
                .from('users')
                .select('username, wins_hof')
                .order('wins_hof', { ascending: false })
                .limit(10);

            if (error)
            {
                console.error('Leaderboard error:', error);
            } else
            {
                setLeaderboard(data);
            }
        };
        const fetchPlayers = async () =>
        {
            const { data, error } = await supabase
                .from('hof_names')
                .select('Player');

            if (!error && data) {
                setAllPlayers(data.map(p => p.Player));
            }
        };

        fetchPlayers();
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
                .select('wins_hof')
                .eq('id', userId)
                .single();

            const newWins = (userRow?.wins_hof || 0) + 1;

            await supabase
                .from('users')
                .update({ wins_hof: newWins, guesses_hof: 4, game_status_hof: 'won', last_played_date_hof: today  })
                .eq('id', userId);
        } else {
            const newGuesses = guessesLeft - 1;
            setGuessesLeft(newGuesses);

            if (newGuesses <= 0) {
                setIsGameOver(true);
                await supabase
                    .from('users')
                    .update({ guesses_hof: 4, game_status_hof: 'lost', last_played_date_hof: today })
                    .eq('id', userId);
            } else {
                await supabase
                    .from('users')
                    .update({ guesses_hof: newGuesses, game_status_hof: 'in_progress', last_played_date_hof: today })
                    .eq('id', userId);
            }
        }
        setGuess('');
    };

    const handleInputChange = (e) =>
    {
        const value = e.target.value;
        setGuess(value);

        if (value.length > 0)
        {
            const filtered = allPlayers.filter(
                name => typeof name === 'string' && name.toLowerCase().includes(value.toLowerCase())
            );

            setSuggestions(filtered.slice(0, 10));
        } else {
            setSuggestions([]);
        }
    };

    //Add in reveal: <img src={FullImage} alt="Player action shot" className="player-img" />

    return (
        <div className="page-layout">
            {/* Left side leaderboard */}
            <div className="leaderboard">
                <h2>🏆 HOF Leaderboard</h2>
                <ol>
                    {leaderboard.map((user, index) => (
                    <li key={index}>
                        {user.username} — {user.wins_hof} wins
                    </li>
                    ))}
                </ol>
            </div>
            <div className="game-wrapper">
                <button
                    className="mode-button"
                    onClick={() => navigate('/game')}
                >
                    Current Player Mode
                </button>
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
                                onChange={handleInputChange}
                                placeholder="Guess the Player"
                                className="guess-input"
                            />

                            {suggestions.length > 0 && (
                                <ul className="suggestions-list">
                                    {suggestions.map((name, index) => (
                                        <li
                                            key={index}
                                            onClick={() => {
                                                setGuess(name);
                                                setSuggestions([]);
                                            }}
                                        >
                                            {name}
                                        </li>
                                    ))}
                                </ul>
                            )}
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
                            <li>Teams: {player.teams}</li>
                            <li>Numbers: {player.numbers}</li>
                            <li>Position: {player.position}</li>
                            <li>Height: {player.height}</li>
                            <li>Weight: {player.weight} lbs</li>
                            <li>Years: {player.years_played}</li>
                            <li>College: {player.college}</li>
                            <li>Receptions: {player.catches}</li>
                            <li>Receiving Yards: {player.receiving_yards}</li>
                            <li>Receiving TDs: {player.receiving_tds}</li>
                            <li>Carries: {player.carries}</li>
                            <li>Rushing Yards: {player.rushing_yards}</li>
                            <li>Rushing TDs: {player.rushing_yards}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GamePage;