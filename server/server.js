// POST /games : create a new game
// GET /games/:id current board status
// GET /games/:id/join - join to game id. if cannot, will 4xx error.
// PUT /games/:id/move

var express = require('express'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser');
// in memory values
var nGames = 0;
var nUsers = 0;
var games = [];

var app = express();
app.use(cookieParser());
app.use(bodyParser.json());

app.get('/games', function(req, res) {
  res.send(games);
});

app.post('/games', function(req, res) {
  games.push({
    id: nGames,
    status: [0, 0, 0,
             0, 0, 0,
             0, 0, 0],
    current_player: 'x'
  });
  nGames += 1;
  res.status(200).end();
});

app.get('/games/:id', function(req, res) {
  if (req.params.id >= 0 && req.params.id < nGames) {
    res.send(games[req.params.id]);
  } else {
    res.status(404).send('Game not exists!');
  }
});

// assign user by using cookie
app.get('/games/:id/assign', function(req, res) {
  var gameId = req.params.id;
  if (gameId < 0 || gameId >= nGames) {
    res.status(404).send('Game not exists!');
  }

  var userId = req.cookies.userId;
  if (userId < 0) {
    res.status(400).send('Invalide user id!');
  }

  if (userId === undefined) {
    userId = nUsers;
    res.append('Set-Cookie', 'userId=' + userId + '; Path=/; HttpOnly');
    nUsers++;
  }

  if (!games[gameId].hasOwnProperty('x')) {
    games[gameId].x = userId;
  } else if (games[gameId].x === userId) {
    res.status(200).send('already assigned to game ' + gameId + '!');
  } else if (!games[gameId].hasOwnProperty('o')) {
    games[gameId].o = userId;
  } else if (games[gameId].o === userId) {
    res.status(200).send('already assigned to game ' + gameId + '!');
  } else {
    res.status(409).send('this game is full!');
  }
  res.status(200).send('get assigned to game ' + gameId + '!');
});

// assign user by using cookie
app.put('/games/:id/move', function(req, res) {
  var gameId = req.params.id;
  if (gameId < 0 || gameId >= nGames) {
    res.status(404).send('Game not exists!');
  }

  var userId = req.cookies.userId;
  if (userId < 0) {
    res.status(400).send('Invalide user id!');
  }

  if (userId === undefined) {
    userId = nUsers;
    res.append('Set-Cookie', 'userId=' + userId + '; Path=/; HttpOnly');
    nUsers++;
  }

  if (!games[gameId].hasOwnProperty('x')) {
    games[gameId].x = userId;
  } else if (games[gameId].x === userId) {
    res.status(200).send('already assigned to game ' + gameId + '!');
  } else if (!games[gameId].hasOwnProperty('o')) {
    games[gameId].o = userId;
  } else if (games[gameId].o === userId) {
    res.status(200).send('already assigned to game ' + gameId + '!');
  } else {
    res.status(409).send('this game is full!');
  }
  res.status(200).send('get assigned to game ' + gameId + '!');
});

app.listen(3000);