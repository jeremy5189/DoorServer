var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/lock', function(req, res) {
  run_cmd('./scripts/lock.sh', [], function(output) {
    res.send({status: 1});
  });
});

app.get('/unlock', function(req, res) {
  run_cmd('./scripts/unlock.sh', [], function(output) {
    res.send({status: 0});
  });
});

app.get('/status', function(req, res) {
  run_cmd('./scripts/status.sh', [], function(output) {
    res.send({
	lock: parseInt(output.replace("\n", '').replace(" ", "")) 
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

    child.stdout.on('data', function (buffer) { resp += buffer.toString() });
    child.stdout.on('end', function() { callBack (resp) });
}

