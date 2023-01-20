const express = require('express')
const socketIO = require('socket.io')
const morgan = require('morgan')
const app = express()
const port = 4000
// pug setup
app.set('view engine', 'pug')
app.set('views', __dirname + '/views')
// static files setup
app.use(express.static(__dirname + '/static'))
app.get('/', (req, res) => res.render('home'))
//middlewares
app.use(morgan('tiny'))
const server = app.listen(port, () => console.log(`scribbler app listening on port ${port}!`))
// socket io setup
const io = socketIO(server)
io.on('connection', (socket) => {
  socket.on('newMessage', ({ message }) => {
    socket.broadcast.emit('messageNotif', { message })
  })
})