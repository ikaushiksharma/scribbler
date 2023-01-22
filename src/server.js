import {join} from "path";
import express from "express";
import { Server } from "socket.io";
import logger from "morgan";
import socketController from "./socketController.js";
import events from "./events.js";

import path from 'path';
const __dirname = path.resolve();

const PORT = 4000;
const app = express();

app.set("view engine", "pug");
app.set("views", join(__dirname, "src/views"));
//app.engine('pug', require('pug').__express)
app.use(logger("dev"));
app.use(express.static(join(__dirname, "src/static")));
app.get("/", (req, res) => res.render("home", { events: JSON.stringify(events) }));

const handleListening = () => console.log(`✅ Server running: http://localhost:${PORT}`);

const server = app.listen(PORT, handleListening);
const io = new Server(server);
let sockets = []

io.on("connection", socket => socketController(socket));