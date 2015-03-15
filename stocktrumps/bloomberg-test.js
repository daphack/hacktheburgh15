var https = require("https"),
    fs = require("fs");

// http://www.google.com/finance/info?infotype=infoquoteall&q=

// read in tickers
var tickers = ["ATVI", "ADBE", "AKAM", "ALXN", "ALTR", "AMZN", "AAL", "AMGN",
    "ADI", "AAPL", "AMAT", "ADSK", "ADP", "AVGO", "BIDU", "BBBY", "BIIB",
    "BRCM", "CHRW", "CA", "CTRX", "CELG", "CERN", "CHTR", "CHKP", "CSCO",
    "CTXS", "CTSH", "CMCSA", "CMCSK", "COST", "DTV", "DISCA", "DISCK", "DISH",
    "DLTR", "EBAY", "EA", "EQIX", "EXPD", "ESRX", "FB", "FAST", "FISV", "GRMN",
    "GILD", "GOOG", "GOOGL", "HSIC", "ILMN", "INTC", "INTU", "ISRG", "GMCR",
    "KLAC", "KRFT", "LRCX", "LBTYA", "LBTYK", "LVNTA", "QVCA", "LMCA", "LMCK",
    "LLTC", "MAR", "MAT", "MU", "MSFT", "MDLZ", "MNST", "MYL", "NTAP", "NFLX",
    "NVDA", "NXPI", "ORLY", "PCAR", "PAYX", "QCOM", "REGN", "ROST", "SNDK",
    "SBAC", "STX", "SIAL", "SIRI", "SPLS", "SBUX", "SRCL", "SYMC", "TSLA",
    "TXN", "PCLN", "TSCO", "TRIP", "FOX", "FOXA", "VRSK", "VRTX", "VIAB",
    "VIP", "VOD", "WDC", "WFM", "WYNN", "XLNX", "YHOO"]

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

// set up API options and built request
var options = {
    hostname: "http-api.openbloomberg.com",
    port: 443,
    path: "/request?ns=blp&service=refdata&type=HistoricalDataRequest",
    method: "POST",
    key: fs.readFileSync("certs/client.key"),
    cert: fs.readFileSync("certs/client.crt"),
    ca: fs.readFileSync("certs/bloomberg.crt"),
};

function getTickData(callback) {
    var req = https.request(options, function(res) {
        var buffer = "";
        var ticks = [];

        res.on("data",
            function(chunk) {
                buffer += chunk.toString();
            }
        );

        res.on("end",
            function() {
                var d = JSON.parse(buffer);
                var sd = {};

                for (var i in d["data"]) {
                    sd = d["data"][i]["securityData"];
                    ticks.push(
                        {
                            "tick": sd["security"].split(" ")[0],
                            "cap": sd["fieldData"][0]["CUR_MKT_CAP"],
                            "price": sd["fieldData"][0]["PX_LAST"],
                            "change": sd["fieldData"][0]["CHG_PCT_5D"]
                        }
                    );
                }

                console.log(JSON.stringify(ticks, null, "    "));
                callback(ticks);
            }
        );
    });

    var data = getData(getFiveRandomTickers(tickers));

    req.write(JSON.stringify(data));
    req.end();
    req.on("error", function(e) {
        console.error(e);
    });
}

module.exports.getTickData = getTickData;
