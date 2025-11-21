import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export const useDailyPlayer = () =>
{
    const [player, setPlayer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() =>
    {
        const fetchPlayer = async () =>
        {
            setLoading(true);
            const today = new Date().toISOString().split('T')[0];

            const { data, error } = await supabase
                .from('daily_player_current')
                .select('*')
                .eq('date', today)
                .single();

            if (error)
            {
                setError(error);
                setPlayer(null);
            } else
            {
                setPlayer(data);
            }

            setLoading(false);
        };

        fetchPlayer();
    }, []);

    return { player, loading, error };
};
