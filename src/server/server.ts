require('dotenv').config();

import express from "express";
import chalk from "chalk";
import * as path from "path";
import * as socketio from "socket.io";
import layouts from "express-ejs-layouts";
import { createServer } from "http";

import * as codenames from "./game/codenames";
import * as meta from "../../package.json";

const app = express();
const http = createServer(app);
const io = new socketio.Server(http);

const port = process.env.APP_PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(layouts);
app.use(express.static(path.join(__dirname, './../client')));
app.use((req, res, next) => {
    res.locals.meta = meta;
    next();
})

app.get('/', (req, res) => {
    res.render('index');
});
app.get('/game', (req, res) => {
    res.render('game');
});

codenames.initialize(io);

http.listen(port, () => {
    console.log(chalk.white`${chalk.magenta`Codenames v${meta.version}`} is up and running at '${chalk.cyan.underline`http://localhost:${port}`}'!`);
});