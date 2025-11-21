export function filterPlayerData(raw) {
    if (!raw || !raw.player) return null;

    const { player, games_played, ...stats } = raw;

    const base =
    {
        player_id: player.id,
        player_name: `${player.first_name} ${player.last_name}`,
        position: player.position_abbreviation,
        height: player.height,
        weight: player.weight,
        age: player.age,
        experience: player.experience,
        college: player.college,
        number: player.jersey_number,
        games_played
    };

    const pos = player.position_abbreviation;
    const filteredStats = {};

    if (pos === 'QB')
    {
        filteredStats.passing_yards = stats.passing_yards;
        filteredStats.passing_touchdowns = stats.passing_touchdowns;
        filteredStats.rushing_yards = stats.rushing_yards;
        filteredStats.rushing_touchdowns = stats.rushing_touchdowns;
    } else if (pos === 'RB')
    {
        filteredStats.rushing_yards = stats.rushing_yards;
        filteredStats.rushing_touchdowns = stats.rushing_touchdowns;
        filteredStats.receiving_yards = stats.receiving_yards;
        filteredStats.receiving_touchdowns = stats.receiving_touchdowns;
    } else if (pos === 'WR')
    {
        filteredStats.receiving_yards = stats.receiving_yards;
        filteredStats.receiving_touchdowns = stats.receiving_touchdowns;
        filteredStats.rushing_yards = stats.rushing_yards;
        filteredStats.rushing_touchdowns = stats.rushing_touchdowns;
    } else if (['LB', 'CB', 'S', 'DL'].includes(pos))
    {
        filteredStats.total_tackles = stats.total_tackles;
        filteredStats.defensive_interceptions = stats.defensive_interceptions;
        filteredStats.defensive_sacks = stats.defensive_sacks;
        filteredStats.passes_defended = stats.passes_defended;
    } else if (['OL', 'C', 'G', 'T', 'K', 'P', 'LS'].includes(pos))
    {

    }

    return { ...base, ...filteredStats };
}

