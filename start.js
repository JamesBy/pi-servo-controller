// start.js
// Responsible for starting and runing the server and listening and executing socket io calls

//These two variables may need to be changed
//  default port
var port = process.argv[2] || 3150;
// path to servod
// pathToServodCommand = '/home/pi/PiBits/ServoBlaster/user/servod';
var pathToServodCommand = '/home/pi/PiBits/ServoBlaster/user/servod';


// These are the mappings to the servos. I have left all settings as default which works out as below
// check the referenced web pages for more, you can change the servoMap pan and tilt numbers if needed.

// http://4tronix.co.uk/blog/?p=50
// Pan servo is attached to x22/#25 on the PiRoCon board. Tilt servo is attached to x18/#24

//https://github.com/richardghirst/PiBits/tree/master/ServoBlaster:
/*
Servo mapping:
     0 on P1-7           GPIO-4
     1 on P1-11          GPIO-17
     2 on P1-12          GPIO-18
     3 on P1-13          GPIO-21
     4 on P1-15          GPIO-22
     5 on P1-16          GPIO-23
     6 on P1-18          GPIO-24
     7 on P1-22          GPIO-25
*/
var servoMapPan = 7;
var servoMapTilt = 6;

//The Server code comes straight from:
//https://gist.github.com/rpflorence/701407
var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs");

 
app = http.createServer(function(request, response) {
    var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri);

    fs.exists(filename, function(exists) {
    if(!exists) {
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404 Not Found\n");
        response.end();
    return;
    }

    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    fs.readFile(filename, "binary", function(err, file) {
    if(err) {        
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
    return;
    }

    response.writeHead(200);
    response.write(file, "binary");
    response.end();
    });
    });
}).listen(parseInt(port, 10));
 

// http://stackoverflow.com/a/8440736
// Get the local ip to display to the user
var os = require('os');
var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}

if (addresses.length > 0)
    console.log("Static file server running at\n  => http://"+addresses[0]+":" + port + "/\nCTRL + C to shutdown");
else
    console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");


var io = require('socket.io')(app);

io.on('connection', function(socket){

    // http://nodejs.org/api.html#_child_processes
    var sys = require('sys')
    var exec = require('child_process').exec;
    var child;
    var dCmd = "sudo "+pathToServodCommand;
    exec(dCmd, function (error, stdout, stderr) {
        if (error !== null) {
            console.log(error);
        }
    });
   
    function shExec(theCommand){
        var dString = "echo "+theCommand+" > /dev/servoblaster";
        child = exec(dString, function (error, stdout, stderr) {
            // sys.print('stderr: ' + stderr);
            if (error !== null) {
                console.log('Error outputted from index.js line 99: ' + error);
            }
        });
    }

    socket.on('pan', function(msg){
        shExec(servoMapPan+"="+msg);
    });

    socket.on('tilt', function(msg){
        shExec(servoMapTilt+"="+msg);
    });
});


// http://stackoverflow.com/a/14032965
// Clean up the gpio
process.stdin.resume();//so the program will not close instantly

function exitHandler(options, err) {
    moveBot.closeAll(gpio);
}
//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));
//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
