## emptygif
Empty gif for nodejs

## Usage example
	var emptygif = require('emptygif');
	var express = require('express');
	
	app.use(emptygif.emptyGif([{path:'/erreport', maxAge: 0}]))
	
	// OR
	app.get('/img/empty.gif', function(req, res, next) {
		emptygif.sendEmptyGif(req, res);
	});

## methods

### emptyGif(configs)
* `configs` Array of objects. Each object contain path and maxAge. Path can be string or RegExp. maxAge is optional. For example:

	[{path: '/img/empty.gif', maxAge : 86400000}]
	
Returns
* `function(req, res, next)` middleware

### sendEmptyGif(req, res, headers)
* `req` Request object
* `res` Response object
* `headers` Headers associated with this image.
	
## Property
### emptyGifBufferLength
The length of the image incase it is needed for customed headers for sendEmptyGif