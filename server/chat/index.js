exports.WS = (server) => {

  const clients = {};
  const io = require('socket.io').listen(server);

  io.on('connection', (socket) => {
    const currentClient = {
      id: socket.id,
      username: socket.handshake.headers['username']
    };
    console.log(`Current client: ${JSON.stringify(currentClient)}`);

    clients[socket.id] = currentClient;
    console.log(`All connected clients: ${JSON.stringify(clients)}`);

    socket.emit('all users', clients);
    io.sockets.emit('new user', currentClient);

    socket.on('chat message', (msg, user) => {
      console.log(`Send message from: '${currentClient.username}' to: '${user}'`);
      socket.broadcast.to(user).emit('chat message', msg, currentClient.id);
    });

    socket.on('disconnect', (data) => {
      io.sockets.emit('delete user', currentClient.id);
      delete clients[socket.id];
      console.log(`Disconnect data: ${data}`);
    });
  });
};