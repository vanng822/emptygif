var util = require('util');
var emptyGifBuffer = new Buffer('R0lGODlhAQABAPAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==', 'base64');
var emptyGifBufferLength = emptyGifBuffer.length;
var DEFAULT_MAX_AGE = 86400000;

var DEFAULT_HEADERS = {
	'Content-Type' : 'image/gif',
	'Content-Length' : emptyGifBufferLength,
	'Cache-Control' : 'public, max-age=' + (DEFAULT_MAX_AGE / 1000)
};

function sendEmptyGif(req, res, headers) {
	var headers = headers || DEFAULT_HEADERS;
	res.writeHead(200, headers);
	res.end(emptyGifBuffer);
}

function throwWithExample() {
	throw new Error("configs must be an array, for instance: [{path: '/img/empty.gif', maxAge : 86400000}]");
}

function emptyGif(configs) {
	/* An site may need multiple emptygif depending on expiry dates */
	var configs = configs || [{
		path : '/img/empty.gif',
		maxAge : DEFAULT_MAX_AGE
	}];
	var i, len, regex;
	
	// sanity check
	if(!util.isArray(configs)) {
		throwWithExample();
	}
	
	len = configs.length;
	
	for( i = 0; i < len; i++) {
		if(!configs[i].hasOwnProperty('path')) {
			throwWithExample();
		}
		if(!configs[i].hasOwnProperty('maxAge')) {
			configs[i].maxAge = DEFAULT_MAX_AGE;
		}
		
		if (util.isRegExp(configs[i].path)) {
			regex = configs[i].path;
		} else {
			regex = new RegExp('^' + configs[i].path);
		}
		
		configs[i].regex = regex;
	}

	return function(req, res, next) {
		var i;
		for( i = 0; i < len; i++) {
			if(configs[i].regex.test(req.url)) {
				sendEmptyGif(req, res, {
					'Content-Type' : 'image/gif',
					'Content-Length' : emptyGifBufferLength,
					'Cache-Control' : 'public, max-age=' + (configs[i].maxAge / 1000)
				});
				return;
			}
		}
		next();
	};
}

module.exports = {
	emptyGifBufferLength : emptyGifBufferLength, // customed headers
	emptyGif : emptyGif, // middleware
	sendEmptyGif : sendEmptyGif // send emptygif manually

}