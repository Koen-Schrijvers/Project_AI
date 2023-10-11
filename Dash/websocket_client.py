import websocket
import json

latest_message = None

def on_message(ws, message):
    global latest_message
    latest_message = message

def on_error(ws, error):
    print(error)

def on_close(ws, close_status_code, close_msg):
    print("Closed")

def on_open(ws):
    def run(*args):
        ws.send(json.dumps({'type': 'subscribe', 'symbol': 'AAPL'}))
    return run

def start_websocket():
    websocket.enableTrace(True)
    ws = websocket.WebSocketApp("ws://localhost:8080",
                                on_message=on_message,
                                on_error=on_error,
                                on_close=on_close)
    ws.on_open = on_open
    ws.run_forever()
