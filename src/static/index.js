const socket = io('/')
function sendMessage(message) {
  socket.emit('newMessage', { message })
}
function handleMessageNotif(data) {
  const { message } = data
  console.log(message)
}
socket.on('messageNotif', handleMessageNotif)
