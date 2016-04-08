var app  = require('express')();
var http = require('http').Server(app);
var io   = require('socket.io')(http);

var hostSocket;
var activeFish : any = [];

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  socket.on( "checkIn", (userID)=>{
    if( hostSocket == null ){
      throw new Error("No host socket!");
    }else{
      console.log("A user checked in!");
      activeFish.push( userID );
      hostSocket.emit( "addFish", userID );
      socket.on("disconnect", ()=>{
        console.log("A user disconnected!");
        hostSocket.emit( "removeFish", userID );
        activeFish.splice( activeFish.indexOf( userID ), 1 );
      });
    }
  });
  socket.on("host", ()=>{
    console.log("Found host!");
    hostSocket = socket;
    hostSocket.emit( "setFishes", activeFish );
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});