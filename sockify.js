var trumpet = require('trumpet');

var fs = require('fs');

var tr = trumpet();


var elmCount = 0;

tr.selectAll('img', function (img) {
    var ws = img.createWriteStream({ outer:true });
    var src = img.attributes.SRC;
    var id = '__img__'+(elmCount++);
    ws.end('<script id="'+id+'">socky("'+src+'", "'+id+'")</script>');
});

tr.selectAll('script', function (script) {
    if(script.attributes.SRC == 'socky') return;

    var ws = script.createWriteStream({ outer:true });
    var src = script.attributes.SRC;
    var id = '__script__'+(elmCount++);
    ws.end('<script id="'+id+'">socky("'+src+'", "'+id+'")</script>');
});

tr.selectAll('link[rel=stylesheet]', function (style) {
    var ws = style.createWriteStream({ outer:true });
    var src = style.attributes.HREF;
    var id = '__style__'+(elmCount++);
    ws.end('<script id="'+id+'">socky("'+src+'", "'+id+'")</script>');
});

tr.selectAll('script[src=socky]', function(socky){
    var ws = socky.createWriteStream({ outer:true })
    fs.createReadStream(__dirname + '/socky.part').pipe(ws);
});

var src = fs.createReadStream(__dirname + '/src/index.html');
var dst = fs.createWriteStream(__dirname + '/dst/index.html');
src.pipe(tr).pipe(dst);