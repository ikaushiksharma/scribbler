import { handleNewUser, handleDisconnected } from "./notifications.js";
import { handleNewMessage } from "./chat.js";
import { handleBeganPath, handleStrokedPath, handleFilled } from "./paint.js";
import { handlePlayerUpdate, handleGameStarted, handleLeaderNotif, handleGameEnded, handleGameStarting} from "./players.js";

let socket = null;

export const getSocket = () => socket;

export const updateSocket = (aSocket) => (socket = aSocket);

export const initSockets = (aSocket) => {
  const {events} = window;
  //console.log(aSocket)
  socket = aSocket
  updateSocket(socket);
  socket.on(events.newUser, handleNewUser);
  socket.on(events.disconnected, handleDisconnected);
  socket.on(events.newMsg, handleNewMessage);
  socket.on(events.beganPath, handleBeganPath);
  socket.on(events.strokedPath, handleStrokedPath);
  socket.on(events.filled, handleFilled);
  socket.on(events.playerUpdate, handlePlayerUpdate);
  socket.on(events.gameStarted, handleGameStarted);
  socket.on(events.leaderNotif, handleLeaderNotif);
  socket.on(events.gameEnded, handleGameEnded);
  socket.on(events.gameStarting, handleGameStarting);
};
