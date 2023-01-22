import {join} from "path";
import express from "express";
import { Server } from "socket.io";
import logger from "morgan";

import path from 'path';
const __dirname = path.resolve();

const PORT = 4000;
const app = express();
app.set("view engine", "pug");
app.set("views", join(__dirname, "src/views"));
//app.engine('pug', require('pug').__express)
app.use(logger("dev"));
app.use(express.static(join(__dirname, "src/static")));
app.get("/", (req, res) => res.render("home"));

const handleListening = () => console.log(`✅ Server running: http://localhost:${PORT}`);

const server = app.listen(PORT, handleListening);
const io = new Server(server);
let sockets = []

io.on("connection", socket => {
	socket.on("newMessage", ({ message }) => {
		socket.broadcast.emit("messageNotif", { 
      message,
      nickname: socket.nickname || "Anon"
     });
	});
  socket.on("setNickname", ({nickname}) => {
    socket.nickname = nickname;
  })
})

/* 
io.on("connection", socket => {
  //sockets.push(socket.id) // 접속한 socket id 리스트를 배열에 담아줌
  //socket.emit("hello"); // 방금 연결된 socket이 hello 메시지 보내기
  // setTimeout(() => socket.emit("hello"), 5000); // 해당 유저에게만 실행
  //setTimeout(() => socket.broadcast.emit("hello"), 5000); // 방금 접속한 클라이언트를 제외하고 접속해 있는 다른 유저들에게도 실행
  socket.on("helloGuys", () => console.log("the client said hello"));
});
//setInterval(() => console.log(sockets), 1000);
*/