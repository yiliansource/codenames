import express from "express";
import * as path from "path";
import * as socketio from "socket.io";
import layouts from "express-ejs-layouts";
import { createServer } from "http";

import * as game from "./game/game";

const app = express();
const http = createServer(app);
const io = new socketio.Server(http);

const port = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(layouts);

app.use(express.static(path.join(__dirname, './../client')));

app.get('/', (req, res) => {
    res.render('index');
});
app.get('/game', (req, res) => {
    res.render('game');
});

game.initialize(io);

http.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});