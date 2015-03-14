import asyncio

import simplejson as json
import websockets

data = [
    {
        "tick" : "AP",
        "name" : "apple",
        "cap" : "1",
        "price" : 300,
        "change" : 20
        },
    {
        "tick" : "A",
        "name" : "a",
        "cap" : "1",
        "price" : 300,
        "change" : 20
        },
    {
        "tick" : "p",
        "name" : "ple",
        "cap" : "1",
        "price" : 300,
        "change" : 20
        },
    {
        "tick" : "m",
        "name" : "amm",
        "cap" : "1",
        "price" : 300,
        "change" : 20
        },
    {
        "tick" : "d",
        "name" : "dd",
        "cap" : "1",
        "price" : 300,
        "change" : 20
    }
]

@asyncio.coroutine
def hello(websocket, path):
    payload = json.dumps(data)
    yield from websocket.send(payload)

start_server = websockets.serve(hello, 'localhost', 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
