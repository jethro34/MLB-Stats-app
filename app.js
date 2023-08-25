// App.js

/*
    SETUP
*/
var express = require('express');   // use express library for the web server
var app     = express();            // instantiate an express object to interact with server

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

PORT        = PORT_NUMBER_HERE;               	// set port number at the top so it's easy to change later

const { engine } = require('express-handlebars');
app.engine('.hbs', engine({extname: ".hbs"}));  // create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // tell express to use the handlebars engine whenever it encounters a *.hbs file.

// Database
var db = require('./database/db-connector');

// Regular expressions to check for ill-formed Str
const namesNcitiesRegex = /^[A-Za-z -.']+$/;
const stateRegex = /^[A-Z]{2}$/;

// Functions
function setEmptyValuesToNull(obj) {
    // iterate over values, set to null if empty
    Object.keys(obj).forEach(key => {
        if (obj[key] === "") {
            obj[key] = null;
        };
    });
};

/*
    ROUTES
*/

app.get('/', (req, res) => {  
    res.render('index');            // render the index.hbs file
});   

app.get('/players', function(req, res) {

    // define read query for getting Players
    let getPlayersQ = "SELECT player_id, last_name, first_name, IF(ISNULL(dob) = 1, 'Unknown', DATE_FORMAT(dob, '%m/%d/%Y')) AS dob_str, CASE WHEN is_pitcher = 1 THEN 'Yes' WHEN is_pitcher = 0 THEN 'No' ELSE 'Unknown' END AS pitcher, IFNULL(hand, 'Unknown') AS hand FROM Players";
    // define read query values
    let getPlayersQvalues = [];

    // if search data, include it in query
    if (req.query.lname_search) {
        getPlayersQ += " WHERE last_name LIKE ?";
        getPlayersQvalues.push(`%${req.query.lname_search}%`);
    };

    getPlayersQ += ";";

    // run query & send Arr of Player Objs
    db.pool.query(getPlayersQ, getPlayersQvalues, function(error, players) {
        return res.render('players', {pData: players});
    });
});

app.post('/add-player-ajax', function(req, res) {
    let pData = req.body;

    // make empty values null
    setEmptyValuesToNull(pData);
        
    // capture & abort if ill-formed input
    const last_name = pData.last_name.trim();
    if (!namesNcitiesRegex.test(last_name)) {
        // abort & send error response
        return res.status(400).send('Invalid last_name');
    };
    
    const first_name = pData.first_name.trim();
    if (!namesNcitiesRegex.test(first_name)) {
        // abort & send error response
        return res.status(400).send('Invalid first_name');
    };

    // define insert query
    const insertPlayerQ = "INSERT INTO Players (last_name, first_name, dob, is_pitcher, hand) VALUES (?, ?, ?, ?, ?);";
    // define insert query values
    const insertPlQvalues = [last_name, first_name, pData.dob, pData.is_pitcher, pData.hand];
    
    // define read query to get Player just added
    // filter out by matching data & most recent
    const getAddedPlayerQ = "SELECT player_id, last_name, first_name, IF(ISNULL(dob) = 1, 'Unknown', DATE_FORMAT(dob, '%m/%d/%Y')) AS dob_str, CASE WHEN is_pitcher = 1 THEN 'Yes' WHEN is_pitcher = 0 THEN 'No' ELSE 'Unknown' END AS pitcher, IFNULL(hand, 'Unknown') AS hand FROM Players WHERE last_name = ? AND first_name = ? ORDER BY player_id DESC LIMIT 1;";
    // define read query values
    const getAddedPlQvalues = [last_name, first_name, pData.dob];

    db.pool.query(insertPlayerQ, insertPlQvalues, function(error, rows) {
        // check for errors
        if (error) {
            console.log(error);     // log error to terminal
            res.sendStatus(400);    // send a 400 indicating bad request
        } else {
            // run read query
            db.pool.query(getAddedPlayerQ, getAddedPlQvalues, function(error, addedPlayers) {
                // check for errors, etc.
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // send added Player -1st Obj in Arr
                    res.send(addedPlayers[0]);
                };
            });
        };
    });
});

app.put('/update-player-ajax', function(req, res, next) {
    let pData = req.body;
    
    // make empty values null
    setEmptyValuesToNull(pData);
        
    // capture & abort if ill-formed input
    const last_name = pData.last_name.trim();
    if (!namesNcitiesRegex.test(last_name)) {
        // abort & send error response
        return res.status(400).send('Invalid last_name');
    };
    
    const first_name = pData.first_name.trim();
    if (!namesNcitiesRegex.test(first_name)) {
        // abort & send error response
        return res.status(400).send('Invalid first_name');
    };
    
    // define update query
    const updatePlayerQ = "UPDATE Players SET last_name = ?, first_name = ?, dob = ?, is_pitcher = ?, hand = ? WHERE player_id = ?;";
    // define update query values
    const updatePlayerQvalues = [last_name, first_name, pData.dob, pData.is_pitcher, pData.hand, pData.player_id];
    
    // define read query
    const getUpdatedPlQ = "SELECT player_id, last_name, first_name, IF(ISNULL(dob) = 1, 'Unknown', DATE_FORMAT(dob, '%m/%d/%Y')) AS dob_str, CASE WHEN is_pitcher = 1 THEN 'Yes' WHEN is_pitcher = 0 THEN 'No' ELSE 'Unknown' END AS pitcher, IFNULL(hand, 'Unknown') AS hand FROM Players WHERE player_id = ?;";
    // define update query values
    const getUpdatedPlQval = [pData.player_id];

    // run update query to update Player
    db.pool.query(updatePlayerQ, updatePlayerQvalues, function(error, rows) {
        if (error) {
            // check for errors
            console.log(error);         // log error to terminal
            res.sendStatus(400);        // send a 400 indicating bad request
        } else {
            // run read query
            db.pool.query(getUpdatedPlQ, getUpdatedPlQval, function(error, updatedPlayers) {
                if (error) {
                    // check for errors, etc.
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // send updated Player -1st Obj in Arr
                    res.send(updatedPlayers[0]);
                };
            });
        };
    });
});

app.delete('/delete-player-ajax', function(req, res, next) {
    let pData = req.body;
    const playerID = parseInt(pData.player_id);
    
    // define delete queries
    const delPlayerFromCQ = "DELETE FROM Contracts WHERE player_id = ?;";
    const delPlayerFromPlQ = "DELETE FROM Players WHERE player_id = ?;";
    // define delete queries values
    const deletePlayerQval = [playerID];

    // run delete Player from Contracts query
    db.pool.query(delPlayerFromCQ, deletePlayerQval, function(error, rows) {
        if (error) {
            // check for errors, etc...
            console.log(error);
            res.sendStatus(400);
        } else {
            // run delete Player from Players query
            db.pool.query(delPlayerFromPlQ, deletePlayerQval, function(error, rows) {
                if (error) {
                    // check for errors, etc...
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                };
            });
        };
    });
});

app.get('/games', function(req, res) {

    // define read query
    // LEFT JOIN is necessary to include games with NULL location
    let getGamesQ = "SELECT game_id, IF(ISNULL(date) = 1, 'Unknown', DATE_FORMAT(date, '%a, %b %e, %Y @ %h:%i %p')) AS date, IFNULL(Games.location_id, '') AS location_id, IFNULL((CONCAT(stadium, ' (', city, ', ', state, ')')), 'Unknown') AS location, away_team, IFNULL(away_score, 'Unknown') AS away_score, home_team, IFNULL(home_score, 'Unknown') AS home_score, CASE WHEN is_away_winner = 1 THEN 'A' WHEN is_away_winner = 0 THEN 'H' ELSE 'Unknown' END AS winner FROM Games LEFT JOIN Locations ON Games.location_id = Locations.location_id";
    
    // define search data variables
    const awayt = req.query.awayt_search;
    const homet = req.query.homet_search;

    // define read query values
    const getGamesQvalues = [];

    // modify query & query values for Games according to search input
    if (Object.keys(req.query).length === 0 || (awayt === "" && homet === "")) {
        getGamesQ += " ORDER BY game_id;";
    } else if (awayt === "" && homet !== "") {
        getGamesQ += " WHERE home_team = ? ORDER BY game_id;";
        getGamesQvalues.push(homet);
    } else if (awayt !== "" && homet === "") {
        getGamesQ += " WHERE away_team = ? ORDER BY game_id;";
        getGamesQvalues.push(awayt);
    } else {
        if (awayt === homet) {
            getGamesQ += " WHERE away_team = ? OR home_team = ? ORDER BY game_id;";
        } else {
            getGamesQ += " WHERE away_team = ? AND home_team = ? ORDER BY game_id;";
        };
        getGamesQvalues.push(awayt, homet);
    };

    // define read queries for Teams and Locations
    const getTeamsQ = "SELECT * FROM Teams;";
    const getLocsQ = "SELECT * FROM Locations;";

    // run queries
    db.pool.query(getGamesQ, getGamesQvalues, function(error, games) {
        db.pool.query(getTeamsQ, function(error, teams) {
            db.pool.query(getLocsQ, function(error, locations) {
                // send obj w Games, Teams, & Locations data
                return res.render('games', {gData: games, tData: teams, lData: locations});
            });
        });
    });
});

app.post('/add-game-ajax', function(req, res) {
    let data = req.body;

    // make empty values null
    setEmptyValuesToNull(data);
    
    // define insert query
    const insertGameQ = "INSERT INTO Games (date, location_id, away_team, away_score, home_team, home_score, is_away_winner) VALUES (?, ?, ?, ?, ?, ?, ?);";
    // define insert query values
    const insertGameQvalues = [data.date, data.location_id, data.away_team, data.away_score, data.home_team, data.home_score, data.is_away_winner];

    // define read query to get Game just added
    // filter out by matching data & most recent
    // LEFT JOIN is necessary to include games with NULL location
    const getAddedGameQ = "SELECT game_id, IF(ISNULL(date) = 1, 'Unknown', DATE_FORMAT(date, '%a, %b %e, %Y @ %h:%i %p')) AS date, IFNULL(Games.location_id, '') AS location_id, IFNULL((CONCAT(stadium, ' (', city, ', ', state, ')')), 'Unknown') AS location, away_team, IFNULL(away_score, 'Unknown') AS away_score, home_team, IFNULL(home_score, 'Unknown') AS home_score, CASE WHEN is_away_winner = 1 THEN 'A' WHEN is_away_winner = 0 THEN 'H' ELSE 'Unknown' END AS winner FROM Games LEFT JOIN Locations ON Games.location_id = Locations.location_id WHERE away_team = ? AND home_team = ? ORDER BY game_id DESC LIMIT 1;";
    // define read query values
    const getAddedGameQval = [data.away_team, data.home_team];

    // run insert query
    db.pool.query(insertGameQ, insertGameQvalues, function(error, rows) {
        // check for errors
        if (error) {
            console.log(error)      // log error to terminal
            res.sendStatus(400);    // send a 400 indicating bad request
        } else {
            // run read query
            db.pool.query(getAddedGameQ, getAddedGameQval, function(error, addedGames) {
                // check for errors, etc.
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // send added Game -1st Obj in Arr
                    res.send(addedGames[0]);
                };
            });
        };
    });
});

app.put('/update-game-ajax', function(req, res, next) {
    let gData = req.body;
    
    // make empty values null
    setEmptyValuesToNull(gData);
    
    // define update query
    const updateGameQ = "UPDATE Games SET date = ?, away_team = ?, away_score = ?, home_team = ?, home_score = ?, location_id = ?, is_away_winner = ? WHERE game_id = ?;";
    // define update query values
    const updateGameQval = [gData.date, gData.away_team, gData.away_score, gData.home_team, gData.home_score, gData.location_id, gData.is_away_winner, gData.game_id];

    // define read query
    const getUpdatedGameQ = "SELECT game_id, IF(ISNULL(date) = 1, 'Unknown', DATE_FORMAT(date, '%a, %b %e, %Y @ %h:%i %p')) AS date, IFNULL(Games.location_id, '') AS location_id, IFNULL((CONCAT(stadium, ' (', city, ', ', state, ')')), 'Unknown') AS location, away_team, IFNULL(away_score, 'Unknown') AS away_score, home_team, IFNULL(home_score, 'Unknown') AS home_score, CASE WHEN is_away_winner = 1 THEN 'A' WHEN is_away_winner = 0 THEN 'H' ELSE 'Unknown' END AS winner FROM Games LEFT JOIN Locations ON Games.location_id = Locations.location_id WHERE game_id = ?;";
    // define read query values
    const getUpdatedGQval = [gData.game_id];

    // run update query
    db.pool.query(updateGameQ, updateGameQval, function(error, rows) {
        if (error) {
            // check for errors
            console.log(error);         // log error to terminal
            res.sendStatus(400);        // send a 400 indicating bad request
        } else {
            // run read query
            db.pool.query(getUpdatedGameQ, getUpdatedGQval, function(error, updatedGames) {
                if (error) {
                    // check for errors, etc.
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // send updated Game -1st Obj in Arr
                    res.send(updatedGames[0]);
                };
            });
        };
    });
});

app.delete('/delete-game-ajax', function(req, res, next) {
    let data = req.body;
    const gameID = parseInt(data.game_id);
    
    // define delete query
    const deleteGameQ = "DELETE FROM Games WHERE game_id = ?;";
    // define delete query values
    const deleteGameQval = [gameID];

    // run delete query
    db.pool.query(deleteGameQ, deleteGameQval, function(error, rows) {
        if (error) {
            // check for errors, etc.
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        };
    });
});

app.get('/teams', function(req, res) {
    // define search data variables
    const tname = req.query.tname_search;

    // define read query
    // LEFT JOIN allows including teams with NULL location
    let getTeamsQ = "SELECT IFNULL(standings, 'Unknown') AS standings, team_name, IFNULL(division, 'Unknown') AS division, IFNULL(coach_last_name, 'Unknown') AS coach_last_name, IFNULL(games_played, 'Unknown') AS games_played, IFNULL(games_won, 'Unknown') AS games_won, IFNULL(games_lost, 'Unknown') AS games_lost, home_field, IFNULL((CONCAT(stadium, ' (', city, ', ', state, ')')), 'Unknown') AS location_str FROM Teams LEFT JOIN Locations ON Teams.home_field = Locations.location_id";
    // define read query values
    const getTeamsQvalues = [];

    // define read query for Locations
    const getLocsQ = "SELECT * FROM Locations;";

    // modify query & query values for Teams according to search input
    if (tname === undefined) {
        getTeamsQ += " ORDER BY standings;";
    } else {
        getTeamsQ += " WHERE team_name LIKE ? ORDER BY standings;";
        getTeamsQvalues.push(`%${tname}%`);
    };

    // run read queries
    db.pool.query(getTeamsQ, getTeamsQvalues, function(error, teams) {
        db.pool.query(getLocsQ, function(error, locations) {
            // send obj w Teams & Locations data
            res.render('teams', {tData: teams, lData: locations});
        });
    });
});

app.post('/add-team-ajax', function(req, res) {
    let tData = req.body;

    // make empty input values null
    setEmptyValuesToNull(tData);
        
    // capture & abort or change ill-formed input to NULL values
    const team_name = tData.team_name.trim();
    if (!namesNcitiesRegex.test(team_name)) {
        // abort & send error response
        return res.status(400).send('Invalid team_name');
    };

    let coach_last_name = tData.coach_last_name;
    if (coach_last_name) {
        coach_last_name = tData.coach_last_name.trim();
        if (!namesNcitiesRegex.test(coach_last_name)) {
            coach_last_name = null;
        };
    };

    // define insert query
    const insertTeamQ = "INSERT INTO Teams (team_name, division, coach_last_name, games_played, games_won, games_lost, home_field, standings) VALUES (?, ?, ?, ?, ?, ?, ?, ?);";
    // define insert query values
    const insertTeamQval = [team_name, tData.division, coach_last_name, tData.games_played, tData.games_won, tData.games_lost, tData.home_field, tData.standings];

    // define read query to get Team just added
    const getAddedTeamQ = "SELECT IFNULL(standings, 'Unknown') AS standings, team_name, IFNULL(division, 'Unknown') AS division, IFNULL(coach_last_name, 'Unknown') AS coach_last_name, IFNULL(games_played, 'Unknown') AS games_played, IFNULL(games_won, 'Unknown') AS games_won, IFNULL(games_lost, 'Unknown') AS games_lost, home_field, IFNULL((CONCAT(stadium, ' (', city, ', ', state, ')')), 'Unknown') AS location_str FROM Teams LEFT JOIN Locations ON Teams.home_field = Locations.location_id WHERE team_name = ?;";
    // define read query value
    const getAddedTeamQval = [team_name];

    // run insert query
    db.pool.query(insertTeamQ, insertTeamQval, function(error, rows) {
        // check for errors
        if (error) {
            console.log(error);     // log error to terminal
            res.sendStatus(400);    // send a 400 indicating bad request
        } else {
            // run read query
            db.pool.query(getAddedTeamQ, getAddedTeamQval, function(error, addedTeams) {
                // check for errors, etc.
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // send added Team -1st Obj in Arr
                    res.send(addedTeams[0]);
                };
            });
        };
    });
});

app.put('/update-team-ajax', function(req, res) {
    let tData = req.body;

    // make empty input values null
    setEmptyValuesToNull(tData);
        
    // capture & change ill-formed input to NULL values
    let coach_last_name = tData.coach_last_name;
    if (coach_last_name) {
        coach_last_name = tData.coach_last_name.trim();
        if (!namesNcitiesRegex.test(coach_last_name)) {
            coach_last_name = null;
        };
    };

    // define update query
    const updateTeamQ = "UPDATE Teams SET division = ?, coach_last_name = ?, games_played = ?, games_won = ?, games_lost = ?, home_field = ?, standings = ? WHERE team_name = ?;";
    // define update query values
    const updateTeamQval = [tData.division, coach_last_name, tData.games_played, tData.games_won, tData.games_lost, tData.home_field, tData.standings, tData.team_name];

    // define read query
    const getUpdatedTeamQ = "SELECT IFNULL(standings, 'Unknown') AS standings, team_name, IFNULL(division, 'Unknown') AS division, IFNULL(coach_last_name, 'Unknown') AS coach_last_name, IFNULL(games_played, 'Unknown') AS games_played, IFNULL(games_won, 'Unknown') AS games_won, IFNULL(games_lost, 'Unknown') AS games_lost, home_field, IFNULL((CONCAT(stadium, ' (', city, ', ', state, ')')), 'Unknown') AS location_str FROM Teams LEFT JOIN Locations ON Teams.home_field = Locations.location_id WHERE team_name = ?;";
    // define read query values
    const getUpdatedTeamQval = [tData.team_name];

    // run update query
    db.pool.query(updateTeamQ, updateTeamQval, function(error, rows) {
        // check for errors
        if (error) {
            console.log(error);     // log error to terminal
            res.sendStatus(400);    // send a 400 indicating bad request
        } else {
            // run read query
            db.pool.query(getUpdatedTeamQ, getUpdatedTeamQval, function(error, updatedTeams) {
                // check for errors, etc.
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // send updated Team -1st Obj in Arr
                    res.send(updatedTeams[0]);
                };
            });
        };
    });
});

app.delete('/delete-team-ajax', function(req, res, next) {
    let data = req.body;
    const teamName = data.team_name;
    
    // define delete queries
    const delTeamFromCQ = "DELETE FROM Contracts WHERE team_name = ?;";
    const delTeamFromTQ = "DELETE FROM Teams WHERE team_name = ?;";
    // define delete query values
    const deleteTeamQval = [teamName];
    // let deletePlayerFromContracts = `DELETE FROM Contracts WHERE player_id = ?;`;

    // run delete Team from Contracts query
    db.pool.query(delTeamFromCQ, deleteTeamQval, function(error, rows) {
        if (error) {
            // check for errors, etc...
            console.log(error);
            res.sendStatus(400);
        } else {
            // run delete Team from Teams query
            db.pool.query(delTeamFromTQ, deleteTeamQval, function(error, rows) {  
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                };
            });
        };
    });
});

app.get('/batbox-positions', function(req, res) {

    // define read queries
    let getBatBoxPosQ;
    let getPositionsQ = "SELECT * FROM Positions;";
    // define read query values
    let getBatBoxPosQval = [];

    if (req.query.batbox_id_search === undefined || req.query.batbox_id_search === "") {
        getBatBoxPosQ = "SELECT bat_boxscore_id, position FROM Batter_Boxscores_has_Positions ORDER BY bat_boxscore_id;";
    } else {
        // if search data, include it in query
        getBatBoxPosQ = "SELECT bat_boxscore_id, position FROM Batter_Boxscores_has_Positions WHERE bat_boxscore_id = ?;";
        getBatBoxPosQval.push(req.query.batbox_id_search);
    };

    // run queries
    db.pool.query(getBatBoxPosQ, getBatBoxPosQval, function(error, batBoxhasPos) {
        db.pool.query(getPositionsQ, function(error, positions) {
            // send Arr of obj w bbhp & positions
            return res.render('batbox-positions', 
            {data: batBoxhasPos, positions: positions});
        });
    });
});

app.post('/add-batbox-position-ajax', function(req, res) {
    let data = req.body;

    // define insert and read queries
    const insertBBhPQ = "INSERT INTO Batter_Boxscores_has_Positions (bat_boxscore_id, position) VALUES (?, ?);";
    const getAddedBBhPQ = "SELECT * FROM Batter_Boxscores_has_Positions WHERE bat_boxscore_id = ? AND position = ?;";
    // define insert & read queries values
    const insertNgetBBhPQval = [data.bat_boxscore_id, data.position];

    // run insert query
    db.pool.query(insertBBhPQ, insertNgetBBhPQval, function(error, rows) {
        // check for errors
        if (error) {
            console.log(error)      // log error to terminal
            res.sendStatus(400);    // send a 400 indicating bad request
        } else {
            // run read query
            db.pool.query(getAddedBBhPQ, insertNgetBBhPQval, function(error, batBoxHasPos) {
                // check for errors, etc.
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // send added Batter Boxscores has Positions -1st Obj in Arr
                    res.send(batBoxHasPos[0]);
                };
            });
        };
    });
});

app.put('/update-batbox-position-ajax', function(req, res, next) {
    let bbhpData = req.body;

    // console.log('app.js/update-batbox-position-ajax/data: ', pData); // ----------------
    
    // define update query & values
    const updateBBhPQ = "UPDATE Batter_Boxscores_has_Positions SET position = ? WHERE bat_boxscore_id = ? AND position = ?;";
    const updateBBhPQvalues = [bbhpData.position, bbhpData.bat_boxscore_id, bbhpData.oldPosition];

    // define read query & values
    const getUpdatedBBhPQ = "SELECT * FROM Batter_Boxscores_has_Positions WHERE bat_boxscore_id = ? AND position = ?;";
    const getUpdatedBBhPQvalues = [bbhpData.bat_boxscore_id, bbhpData.position];
    
    // run update query
    db.pool.query(updateBBhPQ, updateBBhPQvalues, function(error, rows) {
        if (error) {
            // check for errors
            console.log(error);         // log error to terminal
            res.sendStatus(400);        // send a 400 indicating bad request
        } else {
            // run read query
            db.pool.query(getUpdatedBBhPQ, getUpdatedBBhPQvalues, function(error, updatedBBhPs) {
                if (error) {
                    // check for errors, etc.
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // send updated BBhP obj
                    // include oldPosition so updateRow can find old data-value
                    res.send({ ...updatedBBhPs[0], oldPosition: bbhpData.oldPosition });
                };
            });
        };
    });
});

app.delete('/delete-batbox-position-ajax', function(req, res, next) {
    let data = req.body;

    // unpack data into a composite PK of two FKs
    const batBoxscoreID = parseInt(data.bat_boxscore_id_str);
    const positionID = data.position;

    // define delete query
    let deleteBatBoxHasPosQ = "DELETE FROM Batter_Boxscores_has_Positions WHERE bat_boxscore_id = ? AND position = ?;";
    // define delete query values
    const deleteBatBoxHasPosQval = [batBoxscoreID, positionID];

    // run delete query
    db.pool.query(deleteBatBoxHasPosQ, deleteBatBoxHasPosQval, function(error, rows) {
        // check for errors
        if (error) {
            console.log(error);         // log error to terminal
            res.sendStatus(400);        // send a 400 indicating bad request
        } else {
            res.sendStatus(204);
        };
    });
});

app.get('/positions', function(req, res) {
    // define read Positions query; exclude 'Pending' from displaying
    const getPositionsQ = "SELECT * FROM Positions WHERE position <> 'Pending';";

    // run read query
    db.pool.query(getPositionsQ, function(error, positions) {
        // send Arr of Position Objs
        res.render('positions', {data: positions});
    });
});

app.get('/contracts', function(req, res) {

    // define read query for getting Contracts
    let getContractsQ = "SELECT contract_id, team_name, CONCAT_WS(', ', last_name, first_name) AS player_name, IF(ISNULL(start_date) = 1, 'Unknown', DATE_FORMAT(start_date, '%m/%d/%Y')) AS start_date_str, IFNULL(length_years, 'Unknown') AS length_years, IFNULL(total_value, 'Unknown') AS total_value FROM Contracts JOIN Players ON Contracts.player_id = Players.player_id";
    // define read query values
    let getContractsQval = [];

    // if search data, include it in query
    if (req.query.lname_search) {
        getContractsQ += " WHERE Players.last_name LIKE ?";
        getContractsQval.push(`%${req.query.lname_search}%`);
    };

    getContractsQ += ";";

    let getTeamsQ = "SELECT * FROM Teams;";
    let getPlayersQ = "SELECT * FROM Players;";

    // run queries & send Arr of Contracts, Teams, and Players
    db.pool.query(getContractsQ, getContractsQval, function(error, contracts) {
        db.pool.query(getTeamsQ, function(error, teams) {
            db.pool.query(getPlayersQ, function(error, players) {
                return res.render('contracts', {cData: contracts, tData: teams, pData: players});
            });
        });
    });
});

app.post('/add-contract-ajax', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let cData = req.body;

    // make empty values null
    setEmptyValuesToNull(cData);

    // define insert query
    const insertContractQ = "INSERT INTO Contracts (team_name, player_id, start_date, length_years, total_value) VALUES (?, ?, ?, ?, ?);";
    // define insert query values
    const insertContractQval = [cData.team_name, cData.player_id, cData.start_date, cData.length_years, cData.total_value];

    // define read query to get Contract just added
    const getAddedContrQ = "SELECT contract_id, team_name, CONCAT_WS(', ', last_name, first_name) AS player_name, IF(ISNULL(start_date) = 1, 'Unknown', DATE_FORMAT(start_date, '%m/%d/%Y')) AS start_date_str, IFNULL(length_years, 'Unknown') AS length_years, IFNULL(total_value, 'Unknown') AS total_value FROM Contracts JOIN Players ON Contracts.player_id = Players.player_id WHERE team_name = ? AND Contracts.player_id = ? AND start_date = ? ORDER BY contract_id DESC;";
    // define read query values
    const getAddedContrQval = [cData.team_name, cData.player_id, cData.start_date];

    // run insert query
    db.pool.query(insertContractQ, insertContractQval, function(error, rows) {
        // check for errors
        if (error) {
            console.log(error);     // log error to terminal
            res.sendStatus(400);    // // send a 400 indicating bad request
        } else {
            // run read query
            db.pool.query(getAddedContrQ, getAddedContrQval, function(error, addedContr) {
                // check for errors, etc...
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // send added Contract -1st Obj in Arr
                    res.send(addedContr[0]);
                };
            });
        };
    });
});

app.delete('/delete-contract-ajax', function(req, res, next) {
    const cData = req.body;
    const contractID = parseInt(cData.contract_id);
    
    // define delete query
    const deleteContractQ = "DELETE FROM Contracts WHERE contract_id = ?;";
    // define delete query value
    const deleteContractQval = [contractID];

    // run delete query
    db.pool.query(deleteContractQ, deleteContractQval, function(error, rows) {
        if (error) {
            // check for errors, etc...
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        };
    });
});

app.put('/update-contract-ajax', function(req, res, next) {
    let uData = req.body;

    // define update Contract query
    const updateContractQ = "UPDATE Contracts SET team_name = ?, length_years = ?, total_value = ? WHERE contract_id = ?;";
    // define update Contract query values
    const updateContractQval = [uData.team_name, uData.length_years, uData.total_value, uData.contract_id];

    // define read query to get Contract just updated
    const getUpdatedContrQ = "SELECT contract_id, team_name, CONCAT_WS(', ', last_name, first_name) AS player_name, IF(ISNULL(start_date) = 1, 'Unknown', DATE_FORMAT(start_date, '%m/%d/%Y')) AS start_date_str, IFNULL(length_years, 'Unknown') AS length_years, IFNULL(total_value, 'Unknown') AS total_value FROM Contracts JOIN Players ON Contracts.player_id = Players.player_id WHERE contract_id = ?;";
    // define read query value
    const getUpdatedContrQval = [uData.contract_id];
    
    // run update query
    db.pool.query(updateContractQ, updateContractQval, function(error, rows) {
        if (error) {
            // check for errors
            console.log(error);         // log error to terminal
            res.sendStatus(400);        // send a 400 indicating bad request
        } else {
            // run read query
            db.pool.query(getUpdatedContrQ, getUpdatedContrQval, function(error, updatedContrs) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // send updated Contract -1st Obj in Arr
                    res.send(updatedContrs[0]);
                };
            });
        };
    });
});

app.get('/locations', function(req, res) {
    // define read query
    const getLocationsQ = "SELECT * FROM Locations;";

    // run read query
    db.pool.query(getLocationsQ, function(error, locations) {
        res.render('locations', {lData: locations});
    });
});

app.post('/add-location-ajax', function(req, res) {
    let lData = req.body;

    // make empty values null
    setEmptyValuesToNull(lData);
    
    // capture & abort if ill-formed input
    const stadium = lData.stadium.trim();
    if (!namesNcitiesRegex.test(stadium)) {
        // abort & send error response
        return res.status(400).send('Invalid stadium name.');
    };

    let city = lData.city;
    if (city) {
        city = lData.city.trim();
        if (!namesNcitiesRegex.test(city)) {
            city = null;
        };
    };

    let state = lData.state;
    if (state) {
        state = lData.state.trim();
        if (!stateRegex.test(state)) {
            state = null;
        };
    };

    // define insert Location query
    const insertLocQ = "INSERT INTO Locations (stadium, city, state) VALUES (?, ?, ?);";
    // define insert Location query values
    const insertLocQval = [stadium, city, state];

    // define read Location query
    const getAddedLocQ = "SELECT * FROM Locations WHERE stadium = ?;";
    // define read Location query value
    const getAddedLocQval = [stadium];

    db.pool.query(insertLocQ, insertLocQval, function(error, rows) {
        // check for errors
        if (error) {
            console.log(error);     // log error to terminal
            res.sendStatus(400);    // send a 400 indicating bad request
        } else {
            // run read query to get added Location. Use 'stadium' because it is unique
            db.pool.query(getAddedLocQ, getAddedLocQval, function(error, addedLocs) {
                // check for errors, etc...
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // send added Location -1st Obj in Arr
                    res.send(addedLocs[0]);
                };
            });
        };
    });
});

app.delete('/delete-location-ajax', function(req, res, next) {
    let locData = req.body;
    
    // define delete Location query
    const deleteLocQ = "DELETE FROM Locations WHERE location_id = ?;";
    // define delete Location query value
    const deleteLocQval = [locData.location_id];

    // run delete query
    db.pool.query(deleteLocQ, deleteLocQval, function(error, rows) {
        if (error) {
            // check for errors, etc...
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        };
    });
});

app.put('/update-location-ajax', function(req, res, next) {
    let lData = req.body;
    
    // capture & abort if ill-formed input
    const stadium = lData.stadium.trim();
    if (!namesNcitiesRegex.test(stadium)) {
        // abort & send error response
        return res.status(400).send('Invalid stadium name.');
    };

    // define update Loc query
    const updateLocationQ = "UPDATE Locations SET stadium = ? WHERE location_id = ?;";
    // define update Loc query values
    const updateLocQvals = [stadium, lData.location_id];

    // define read updated Loc query
    const getUpdatedLocQ = "SELECT * FROM Locations WHERE location_id = ?;";
    // define read updated Loc query value
    const getUpdatedLocQval = [lData.location_id]

    // run update Loc query
    db.pool.query(updateLocationQ, updateLocQvals, function(error, rows) {
        if (error) {
            // check for errors
            console.log(error);         // log error to terminal
            res.sendStatus(400);        // send a 400 indicating bad request
        } else {
            // run read Loc query
            db.pool.query(getUpdatedLocQ, getUpdatedLocQval, function(error, updatedLocs) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // send updated Location -1st Obj in Arr
                    res.send(updatedLocs[0]);
                };
            });
        };
    });
});

app.get('/batter_boxscores', function(req, res) {

    // define basic read query
    let getBbQ = "SELECT bat_boxscore_id, Batter_Boxscores.game_id, Batter_Boxscores.player_id, is_starter, at_bats, hits, runs, errors, strikeouts, walks FROM Batter_Boxscores";
    // define read BB query values
    let getBbQval = [];

    let bLastName = req.query.lname_search;
    // make datetime able to be compared
    let datetime = "";
    if (req.query.date_search) {
        datetime = req.query.date_search.replace("T", " ") + ":00";
    };
    
    // modify read query & values according to search input
    if (Object.keys(req.query).length === 0 || (bLastName === "" && datetime === "")) {
        getBbQ += " ORDER BY bat_boxscore_id;";
    } else if (bLastName === "" && datetime !== "") {
        getBbQ += " JOIN Games ON Batter_Boxscores.game_id = Games.game_id WHERE Games.date = ? ORDER BY bat_boxscore_id;";
        getBbQval.push(datetime);
    } else if (bLastName !== "" && datetime === "") {
        getBbQ += " JOIN Players ON Batter_Boxscores.player_id = Players.player_id WHERE Players.last_name LIKE ? ORDER BY bat_boxscore_id;";
        getBbQval.push(`%${bLastName}%`);
    } else {
        getBbQ += " JOIN Games ON Batter_Boxscores.game_id = Games.game_id JOIN Players on Batter_Boxscores.player_id = Players.player_id WHERE Players.last_name LIKE ? AND Games.date = ? ORDER BY bat_boxscore_id;";
        getBbQval.push(`%${bLastName}%`, datetime);
    };

    // define read Games & Players queries
    const getGamesQ = "SELECT * FROM Games;";
    const getBattersQ = "SELECT * FROM Players WHERE is_pitcher = 0;";  // get position Players (batters) only

    db.pool.query(getBbQ, getBbQval, function(error, bBoxscores) {
        db.pool.query(getGamesQ, function(error, games) {
            db.pool.query(getBattersQ, function(error, players) {
                return res.render('batter_boxscores', {bbData: bBoxscores, gData: games, pData: players});
            });
        });
    });
});

app.post('/add-bat_boxscore-ajax', function(req, res) {
    const bbData = req.body;
    
    // define insert Batter Boxscores query
    const insertBbQ = "INSERT INTO Batter_Boxscores (game_id, player_id, is_starter, at_bats, hits, runs, errors, strikeouts, walks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);";
    // define insert Batter Boxscores query values
    const insertBbQval = [bbData.game_id, bbData.player_id, bbData.is_starter, bbData.at_bats, bbData.hits, bbData.runs, bbData.errors, bbData.strikeouts, bbData.walks];

    // define read query to get Batter Boxscores just added from game_id and player_id
    const getAddedBbQ = "SELECT * FROM Batter_Boxscores WHERE game_id = ? AND player_id = ?;";
    // define read query values
    const getAddedBbQval = [bbData.game_id, bbData.player_id];

    // define insert Batter Boxscores has Positions query; every Player in a Game played at some Position
    const insertBBhPQ = "INSERT INTO Batter_Boxscores_has_Positions (bat_boxscore_id, position) VALUES ((SELECT bat_boxscore_id FROM Batter_Boxscores WHERE game_id = ? AND player_id = ?), 'Pending');";
    // define insert Batter Boxscores has Positions query values
    const insertBBhPQval = [bbData.game_id, bbData.player_id];

    // run insert query
    db.pool.query(insertBbQ, insertBbQval, function(error, rows) {
        // check for errors
        if (error) {
            console.log(error);     // log error to terminal
            res.sendStatus(400);    // send a 400 indicating bad request
        } else {
            // run read added Batter Boxscores query
            db.pool.query(getAddedBbQ, getAddedBbQval, function(error, addedBBoxscores) {
                // check for errors, etc...
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // run insert query to add row into Bat_Box_has_Positions table 
                    db.pool.query(insertBBhPQ, insertBBhPQval, function(error, bposition) {
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            // send added Batter Boxscores -1st Obj in Arr
                            res.send(addedBBoxscores[0]);
                        };
                    });
                };
            });
        };
    });
});

app.delete('/delete-bat_boxscore-ajax', function(req, res, next) {
    const bbData = req.body;
    const bBoxscoreID = parseInt(bbData.bat_boxscore_id);
    
    // define delete Batter Boxscore query
    const deleteBbQ = "DELETE FROM Batter_Boxscores WHERE bat_boxscore_id = ?;";
    // define delete query value
    const deleteBbQval = [bBoxscoreID];

    // run delete query
    db.pool.query(deleteBbQ, deleteBbQval, function(error, rows) {
        if (error) {
            // check for errors, etc...
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        };
    });
});

app.get('/pitcher_boxscores', function(req, res) {  
    
    // define basic read query
    let getPbQ = "SELECT pitch_boxscore_id, Pitcher_Boxscores.game_id, Pitcher_Boxscores.player_id, is_starting_p, innings_pitched, earned_runs, hits_allowed, pitch_count, strike_pitches, ball_pitches, strikeouts_given, walks_given, is_winner, is_loser, is_save FROM Pitcher_Boxscores";
    // define read PB query values
    let getPbQval = [];

    let pLastName = req.query.lname_search;
    // make datetime able to be compared
    let datetime = "";
    if (req.query.date_search) {
        datetime = req.query.date_search.replace("T", " ") + ":00";
    };

    // modify read query & values according to search input
    if (Object.keys(req.query).length === 0 || (pLastName === "" && datetime === "")) {
        getPbQ += " ORDER BY pitch_boxscore_id;";
    } else if (pLastName === "" && datetime !== "") {
        getPbQ += " JOIN Games ON Pitcher_Boxscores.game_id = Games.game_id WHERE Games.date = ? ORDER BY pitch_boxscore_id;";
        getPbQval.push(datetime);
    } else if (pLastName !== "" && datetime === "") {
        getPbQ += " JOIN Players ON Pitcher_Boxscores.player_id = Players.player_id WHERE Players.last_name LIKE ?;";
        getPbQval.push(`%${pLastName}%`);
    } else {
        getPbQ += " JOIN Games ON Pitcher_Boxscores.game_id = Games.game_id JOIN Players on Pitcher_Boxscores.player_id = Players.player_id WHERE Players.last_name LIKE ? AND Games.date = ?;";
        getPbQval.push(`%${pLastName}%`, datetime);
    };

    // define read Games & Players queries
    const getGamesQ = "SELECT * FROM Games;";
    const getPitchersQ = "SELECT * FROM Players WHERE is_pitcher = 1;"; // get pitcher Players only

    db.pool.query(getPbQ, getPbQval, function(error, pboxscores) {
        db.pool.query(getGamesQ, function(error, games) {
            db.pool.query(getPitchersQ, function(error, players) {
                return res.render('pitcher_boxscores', {pbData: pboxscores, gData: games, pData: players});
            });
        });
    });
});

app.post('/add-pitch_boxscore-ajax', function(req, res) {
    const pbData = req.body;
    
    // define insert Pitcher Boxscores query
    let insertPbQ = "INSERT INTO Pitcher_Boxscores (game_id, player_id, is_starting_p, innings_pitched, earned_runs, hits_allowed, pitch_count, strike_pitches, ball_pitches, strikeouts_given, walks_given, is_winner, is_loser, is_save) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
    // define insert Pitcher Boxscores query values
    const insertPbQval = [pbData.game_id, pbData.player_id, pbData.is_starting_p, pbData.innings_pitched, pbData.earned_runs, pbData.hits_allowed, pbData.pitch_count, pbData.strike_pitches, pbData.ball_pitches, pbData.strikeouts_given, pbData.walks_given, pbData.is_winner, pbData.is_loser, pbData.is_save];

    // define read query to get Pitcher Boxscores just added from game_id and player_id
    const getAddedPbQ = "SELECT * FROM Pitcher_Boxscores WHERE game_id = ? AND player_id = ?;";
    // define read query values
    const getAddedPbQval = [pbData.game_id, pbData.player_id];

    // run insert query
    db.pool.query(insertPbQ, insertPbQval, function(error, rows) {
        // check for errors
        if (error) {
            console.log(error);     // log error to terminal
            res.sendStatus(400);    // send a 400 indicating bad request
        } else {
            // run read added Pitcher Boxscores query
            db.pool.query(getAddedPbQ, getAddedPbQval, function(error, addedPBoxscores) {
                // check for errors, etc...
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // send added Pitcher Boxscores -1st Obj in Arr
                    res.send(addedPBoxscores[0]);
                };
            });
        };
    });
});

app.delete('/delete-pitch_boxscore-ajax', function(req, res, next) {
    const pbData = req.body;
    const pBoxscoreID = parseInt(pbData.pitch_boxscore_id);
    
    // define delete Pitcher Boxscore query
    const deletePbQ = "DELETE FROM Pitcher_Boxscores WHERE pitch_boxscore_id = ?;";
    // define delete query value
    const deletePbQval = [pBoxscoreID];

    // run delete query
    db.pool.query(deletePbQ, deletePbQval, function(error, rows) {
        if (error) {
            // check for errors, etc...
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        };
    });
});

/*
    LISTENER
*/
app.listen(PORT, function() {            // receive incoming requests on the specified PORT
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.');
});