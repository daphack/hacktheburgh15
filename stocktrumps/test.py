#!/usr/bin/env python3
# usage: python3 HistoricalDataRequest.py <host-ip>

import argparse
import datetime
import json
import ssl
import sys
import urllib.request

now = datetime.datetime.now().isoformat()
print(now)

data = {
    "securities": ["IBM US Equity", "AAPL US Equity"],
    "fields": ["PX_LAST", "OPEN", "LAST_PRICE"],
    "startDate": "20140101",
    "endDate": "20140201",
    "periodicitySelection": "DAILY"
}

endpoint = "http-api.openbloomberg.com"

def request():
    req = urllib.request.Request('https://{}/request?ns=blp&service=refdata&type=HistoricalDataRequest'.format(endpoint))
    req.add_header('Content-Type', 'application/json')

    ctx = ssl.SSLContext(ssl.PROTOCOL_SSLv23)
    ctx.load_verify_locations('certs/bloomberg.crt')
    ctx.load_cert_chain('certs/client.crt', 'certs/client.key')

    https_sslv23_handler = urllib.request.HTTPSHandler(context=ctx)
    opener = urllib.request.build_opener(https_sslv23_handler)
    urllib.request.install_opener(opener)

    try:
        res = opener.open(req, data=json.dumps(data).encode("ascii"))
        print(res.read())
    except Exception as e:
        e
        print(e)
        return 1
    return 0

request()
