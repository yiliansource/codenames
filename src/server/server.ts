import express from "express";
import * as path from "path";
import * as socketio from "socket.io";
import layouts from "express-ejs-layouts";
import { createServer } from "http";

import * as codenames from "./game/codenames";
import chalk from "chalk";

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

codenames.initialize(io);

http.listen(port, () => {
    console.log(chalk.white`The Codenames server is up and running at '${chalk.cyan.underline`http://localhost:${port}`}'!`);
});