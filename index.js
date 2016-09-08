var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/photo', function(req, res) {
  console.log('GET /photo ' + req.ip);

  var fn = '/tmp/' + (new Date().getTime()) + '.jpg';
  console.log(fn);
  run_cmd('raspistill', [
    '-o',
    fn,
    '-w',
    '800',
    '-h',
    '600',
    '-hf', 
    '-vf',
    '-n'
  ], function() {

    console.log('Photo done');

    var fs  = require('fs');
    var img = fs.readFileSync(fn);
    res.writeHead(200, {'Content-Type': 'image/jpeg' });
    res.end(img, 'binary'); 

    console.log('rm ' + fn);
//    run_cmd('rm', [fn], function() {});

  });

});

app.get('/lock', function(req, res) {
  console.log('GET /lock '+ req.ip);

  run_cmd('./scripts/lock.sh', [], function(output) {
    res.send({status: 1});
  });
});

app.get('/unlock', function(req, res) {
  console.log('GET /unlock ' + req.ip);
  run_cmd('./scripts/unlock.sh', [], function(output) {
    res.send({status: 0});
  });
});

app.get('/status', function(req, res) {
  console.log('GET /status ' + req.ip);

  run_cmd('./scripts/status.sh', [], function(output) {
    var ret = parseInt(output.replace("\n", '').replace(" ", ""));
    console.log('status = ' + ret);
    res.send({
	lock: ret
    });
  });
});

app.listen(3000, function () {
  console.log('DoorServer listening on port 3000');
});

function run_cmd(cmd, args, callBack) {
    var spawn = require('child_process').spawn;
    var child = spawn(cmd, args);
    var resp = "";
    console.log(args);
    child.stdout.on('data', function (buffer) { resp += buffer.toString() });
    child.stdout.on('end', function() { callBack (resp) });
}

