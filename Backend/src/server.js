var express = require('express');
var util = require('util');
var app = express();
const port = 3000;

// Handling GET requests
app.get('/search', function (req, res) {
	console.log(util.inspect(req.headers, { showHidden: false, depth: null }))
	console.log(util.inspect(req.url, { showHidden: false, depth: null }))
	console.log(util.inspect(req.query, { showHidden: false, depth: null }))
	// res.status(200).send('These are the items found!');
});

// Handling POST requests
app.post('/subscribe', function (req, res) {
	console.log(util.inspect(req.headers, { showHidden: false, depth: null }))
	console.log(util.inspect(req.params, { showHidden: false, depth: null }))
	// res.status(201).send('You are now subscribed!');
});


app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});