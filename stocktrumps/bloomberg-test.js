var https = require("https"),
    fs = require("fs");

// read in tickers
var tickers = fs.readFileSync("./symbols/symbols.txt",
                              {"encoding":"utf8"}).split("\n");

// get start and end dates from a difference in days
function getDates(difference) {
    var cleanDate = function (d) {
        var splitDate = d.split("T")[0];
        return splitDate.replace(/-/g, "");
    };

    var now = new Date();
    var end = cleanDate(now.toISOString());
    var start = cleanDate(
        new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - difference
        ).toISOString()
     );

    return [start, end];
}

// "tickers" is a list of strings with stock tickers
function getData(tickers) {
    var dates = getDates(5);
    var payload = {};

    payload.securities = [];
    for (var tick in tickers) {
        payload.securities.push(tickers[tick] + " US Equity");
    }

    payload.fields = ["CHG_PCT_5D", "CUR_MKT_CAP", "PX_LAST"];
    payload.startDate = dates[0];
    payload.endDate = dates[1];
    payload.periodicitySelection = "WEEKLY";

    return payload;
}

// get 5 random stock tickers
function getFiveRandomTickers(tickers) {
    var rTicks = [];
    for (var i = 0; i < 5; i += 1) {
        rTicks.push(tickers[Math.floor(Math.random() * tickers.length)]);
    }

    return rTicks;
}

var options = {
    hostname: 'http-api.openbloomberg.com',
    port: 443,
    path: '/request?ns=blp&service=refdata&type=HistoricalDataRequest',
    method: 'POST',
    key: fs.readFileSync('certs/client.key'),
    cert: fs.readFileSync('certs/client.crt'),
    ca: fs.readFileSync('certs/bloomberg.crt'),
};

var req = https.request(options, function(res) {
    res.on('data', function(d) {
        process.stdout.write(d);
    });
});

var data = getData(getFiveRandomTickers(tickers));
console.log(data);
req.write(JSON.stringify(data));
req.end();
req.on('error', function(e) {
    console.error(e);
});
