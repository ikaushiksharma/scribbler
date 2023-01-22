import events from "./events.js";

const socketController = (socket) => {
  const broadcast = (event, data) => socket.broadcast.emit(event, data);
  socket.on(events.setNickname, ({nickname}) => {
    socket.nickname = nickname;
    broadcast(events.newUser, { nickname });
    console.log(nickname);
  });
  socket.on(events.disconnect, () => {
    broadcast(events.disconnected, { nickname: socket.nickname })
  })
}

export default socketController;