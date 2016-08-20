var config = require('./config.json');
var http = require("http");
var PushBullet = require('pushbullet');
var pusher = new PushBullet(config.pushbulletId);
var BigNumber = require('big-number').n;

var pbVals = { 
	lastCheckedTs:0,
	recheckTimeout:30000,
	checkModifiedAfter: 6.048e+8,
	pushHistory: [],
	maxNotes: 3,
	deviceIdentity: config.deviceIdentity
}



pbCheck();

http.createServer(function (request, response) {
	pbCheck();
	response.writeHead(200, {'Content-Type': 'application/json'});
 
       // Send the response body as "Hello World"
       response.end(JSON.stringify({response: pbVals.pushHistory}));
}).listen(8081);
   
// Console will print the message
console.log('Server running at http://127.0.0.1:8081/');

function pbCheck(){
	var options = {
	    //limit: 10,
	    modified_after: 1.4e+09
	};

	pusher.history(options, function(error, response) {
		if(error){
			console.error(error);
			return;
		}
		//console.log(response);

		var count = 0;
		pbVals.pushHistory.length = 0;

		response.pushes.forEach(function(value){
			if(pbVals.pushHistory.length >= pbVals.maxNotes){
				return;
			}else if(value.type == "note" && value.target_device_iden == pbVals.deviceIdentity){
				//console.log(value.body);
				pbVals.pushHistory.push(value.body);
			}
		});
	});
}
