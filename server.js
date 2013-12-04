var fs = require('fs');
var WebSocketServer = require('websocket').server;
var http = require('http');
var path = require('path');

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
    autoAcceptConnections: true
});

var imageTypes = {
    '.jpg': true,
    '.png': true,
    '.gif': true
};

function sendFile(filename, connection){
    fs.readFile(filename, function(err, file){
        if(err){
            console.log(err);
            return
        }
        
        var isImage = path.extname(filename) in imageTypes;
        var content = file.toString(isImage ? 'base64' : 'utf8');
        
        connection.sendUTF(filename+"\n"+content);
    });
}

wsServer.on('connect', function(connection){
    console.log((new Date()) + ' Connection accepted.');
    
    //Lets send a file before the client asks for it!
    sendFile('script/test.js', connection);
    
    //When the client asks for a file we find it and send it
    connection.on('message', function(message) {
        var filename = message.utf8Data;
        
        sendFile(filename, connection)
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});
