var trumpet = require('trumpet');

var fs = require('fs');

var tr = trumpet();


var imgCount = 0;

fs.createReadStream(__dirname + '/socky.part').pipe(tr.select('script[src=socky]').createWriteStream({ outer:true }));

tr.selectAll('img', function (img) {
    var ws = img.createWriteStream({ outer:true });
    var src = img.attributes.SRC;
    var id = '__img__'+(imgCount++);
    ws.end('<script id="'+id+'">socky("'+src+'", "'+id+'")</script>');
});

var src = fs.createReadStream(__dirname + '/src/index.html');
var dst = fs.createWriteStream(__dirname + '/dst/index.html');
src.pipe(tr).pipe(dst);