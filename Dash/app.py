import dash
import dash_core_components as dcc
import dash_html_components as html
from dash.dependencies import Input, Output
import threading
import websocket
import json  # Importing json to parse WebSocket messages

# WebSocket Client
latest_message = None
ws = None  
should_continue = False  # Define should_continue globally

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
    global should_continue
    websocket.enableTrace(True)
    ws = websocket.WebSocketApp("ws://localhost:8080",
                                on_message=on_message,
                                on_error=on_error,
                                on_close=on_close)
    ws.on_open = on_open
    while should_continue:  # Keep running until should_continue is False
        ws.run_forever()
        if should_continue:  # If still True, try to reconnect
            print("WebSocket disconnected unexpectedly. Reconnecting...")



# Dash App
app = dash.Dash(__name__)

app.layout = html.Div([
    html.H1("WebSocket Client"),
    html.Button("Connect", id="connectButton"),
    html.Button("Stop", id="stopButton"),
    html.Br(),
    html.Br(),
    html.Div([
        html.Div(id="barGraph", style={
            "width": "50px",
            "height": "0%",
            "backgroundColor": "lightgray",
            "position": "relative",
            "borderRadius": "10px",
            "boxShadow": "-4px 0px 4px rgba(0, 0, 0, 0.2)"
        }),
        html.Span(id="latestDBA", style={"marginLeft": "10px"})
    ], style={"display": "flex", "alignItems": "flex-end"}),  # Corrected here
    dcc.Interval(
        id='interval-component',
        interval=1*1000,
        n_intervals=0
    )
])


@app.callback(
    [Output('barGraph', 'style'),
     Output('latestDBA', 'children')],
    [Input('interval-component', 'n_intervals')]
)
def update_layout(n):
    global latest_message
    try:
        # Parse the JSON message to get the dBA value
        message_data = json.loads(latest_message)
        dBA_value = float(message_data['dBA'])
    except (TypeError, ValueError, KeyError, json.JSONDecodeError):
        dBA_value = 1
    
    max_dBA = 100
    height_percentage = min((dBA_value / max_dBA) * 100, 100)
    
    bar_style = {
        "width": "50px",
        "height": f"{height_percentage}%",
        "backgroundColor": "red",
        "position": "relative",
        "borderRadius": "10px",
        "boxShadow": "-4px 0px 4px rgba(0, 0, 0, 0.2)"
    }
    
    latest_dBA_text = f"Latest dBA: {dBA_value}"
    
    return bar_style, latest_dBA_text

@app.callback(
    Output('connectButton', 'disabled'),
    [Input('connectButton', 'n_clicks')]
)
def start_connection(n):
    global should_continue
    if n:  # If button is clicked
        should_continue = True
        ws_thread = threading.Thread(target=start_websocket)
        ws_thread.start()
        return True  # Disable the button
    return False  # Enable the button

@app.callback(
    Output('stopButton', 'disabled'),
    [Input('stopButton', 'n_clicks')]
)
def stop_connection(n):
    global should_continue
    if n:  # If button is clicked
        should_continue = False  # Stop the WebSocket thread
        if ws:
            ws.close()  # Close the WebSocket connection
        return True  # Disable the button
    return False  # Enable the button

if __name__ == '__main__':
    ws_thread = threading.Thread(target=start_websocket)
    app.run_server(debug=True)
