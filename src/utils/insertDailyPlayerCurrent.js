import { filterPlayerData } from './filterPlayerStatsCurrent';
import { supabase } from './supabaseClient';

const fetchRawPlayerData = async (playerId) =>
{
    const res = await fetch(`https://nfl.balldontlie.io/api/v1/stats?player_ids[]=${playerId}`);
    const json = await res.json();
    return json.data[0];
};

export const insertDailyPlayer = async (playerId) =>
{
    try {
        const raw = await fetchRawPlayerData(playerId);
        const filtered = filterPlayerData(raw);

        if (!filtered) {
            console.error('No valid player data found.');
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        //const silhouetteUrl = `https://your.supabase.storage.url/silhouettes/${filtered.player_id}.png`;

        const finalRow = {
            ...filtered,
            date: today,
            //silhouette_url: silhouetteUrl
        };

        const { data, error } = await supabase.from('daily_player').insert([finalRow]);

        if (error) {
            console.error('Insert failed:', error);
        } else {
            console.log('Inserted player:', data);
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
};
