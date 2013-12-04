var fs = require('fs');
var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response){
    response.writeHead(200);
    fs.readFile(__dirname+'/dst/index.html', function(err, file){
        response.write(file, 'binary');
        response.end();
    });
});

server.listen(80);

var wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

function originIsAllowed(origin){
    return true;
}

wsServer.on('request', function(request){
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    var connection = request.accept(null, request.origin);
    
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            var filename = message.utf8Data;
            fs.readFile(filename, function(err, file){
                console.log('Received Message: ' + filename);
                connection.sendUTF(filename+"\n"+file.toString('base64'));
            });
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});
