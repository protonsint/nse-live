var express = require('express');
var Request = require('request');
var app = express();

app.get('/favicon.ico', function(req, res) {
    res.status(200);
});

app.get('/:symbol/', function(request, response) {
	if(request.params.symbol && request.params.symbol.length > 0) {
		var symbol = request.params.symbol;
		console.log("Symbol Requested is " + symbol);
		var stockUrl =`http://www.nseindia.com/live_market/dynaContent/live_watch/get_quote/ajaxGetQuoteJSON.jsp?symbol=${symbol}`;
		console.log(stockUrl);
		var options = {
  url: stockUrl,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
    "Referer": "http://www.nseindia.com/",
    "Accept": '*/*'
  }
};
		Request(options, function (error, res, body) {
			if (!error && response.statusCode == 200) {
				var stockData = JSON.parse(body);
				response.setHeader('Content-Type', 'application/json');
				delete stockData.otherSeries;
				delete stockData.optLink;
				delete stockData.futLink;
    			response.json(stockData);
			}
		})


	} else {
		response.status(400).send(invalidRequest());
	}
});

app.get('/*', function(req, res) {
	res.status(400).send(invalidRequest());
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

function invalidRequest() {
	return "Invalid Symbol";
}

