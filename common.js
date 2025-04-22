let globalSetup = {
    overs: 20,
    numPlayers: 11,
    players: []
};

let match = {
    team1: { name: '', runs: 0, wickets: 0, overs: 0, balls: 0, players: [] },
    team2: { name: '', runs: 0, wickets: 0, overs: 0, balls: 0, players: [] },
    maxOvers: 20,
    currentInnings: 1,
    battingTeam: null,
    bowlingTeam: null,
    target: null,
    currentBatsmen: [],
    currentBatsmanIndex: -1,
    currentBowler: null,
    ballLog: [],
    currentOverRuns: 0,
    matchNumber: null
};

let matchDetails = {};
let matchHistory = [];
let undoStack = [];

function sanitize(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function savePersistedData() {
    localStorage.setItem('globalSetup', JSON.stringify(globalSetup));
    localStorage.setItem('match', JSON.stringify(match));
    localStorage.setItem('matchDetails', JSON.stringify(matchDetails));
    localStorage.setItem('matchHistory', JSON.stringify(matchHistory));
    localStorage.setItem('undoStack', JSON.stringify(undoStack));
}

function computeOverallStats() {
    const stats = {
        totalMatches: matchHistory.length,
        totalRuns: 0,
        totalWickets: 0,
        totalOvers: 0
    };
    Object.values(matchDetails).forEach(match => {
        stats.totalRuns += match.team1.runs + match.team2.runs;
        stats.totalWickets += match.team1.wickets + match.team2.wickets;
        stats.totalOvers += match.team1.overs + match.team2.overs;
    });
    const overallStats = document.getElementById('overallStats');
    if (overallStats) {
        overallStats.innerHTML = `
            <p>Total Matches: ${stats.totalMatches}</p>
            <p>Total Runs: ${stats.totalRuns}</p>
            <p>Total Wickets: ${stats.totalWickets}</p>
            <p>Total Overs: ${stats.totalOvers}</p>
        `;
    }
}

function renderPlayerStatsTable() {
    const playerStats = {};
    Object.values(matchDetails).forEach(match => {
        [...match.team1.players, ...match.team2.players].forEach(player => {
            if (!playerStats[player.name]) {
                playerStats[player.name] = {
                    runs: 0,
                    wickets: 0,
                    fours: 0,
                    sixes: 0,
                    oversBowled: 0,
                    runsConceded: 0
                };
            }
            playerStats[player.name].runs += player.runs || 0;
            playerStats[player.name].wickets += player.wickets || 0;
            playerStats[player.name].fours += player.fours || 0;
            playerStats[player.name].sixes += player.sixes || 0;
            playerStats[player.name].oversBowled += player.overs || 0;
            playerStats[player.name].runsConceded += player.runsConceded || 0;
        });
    });
    const tableBody = document.getElementById('playerStatsTable');
    if (tableBody) {
        tableBody.innerHTML = '';
        Object.entries(playerStats).forEach(([player, stats]) => {
            tableBody.innerHTML += `
                <tr>
                    <td class="border p-2">${sanitize(player)}</td>
                    <td class="border p-2">${stats.runs}</td>
                    <td class="border p-2">${stats.wickets}</td>
                    <td class="border p-2">${stats.fours}</td>
                    <td class="border p-2">${stats.sixes}</td>
                    <td class="border p-2">${stats.oversBowled}</td>
                    <td class="border p-2">${stats.runsConceded}</td>
                </tr>
            `;
        });
    }
}