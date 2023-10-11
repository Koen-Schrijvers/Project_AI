import dash
import dash_core_components as dcc
import dash_html_components as html
from dash.dependencies import Input, Output
import threading
import websocket_client  # Import the WebSocket client module

app = dash.Dash(__name__)

app.layout = html.Div([
    dcc.Interval(
        id='interval-component',
        interval=1*1000,  # in milliseconds
        n_intervals=0
    ),
    html.H1(id='live-update-text'),
])

@app.callback(Output('live-update-text', 'children'),
              [Input('interval-component', 'n_intervals')])
def update_layout(n):
    global latest_message
    # Update UI using latest_message from WebSocket
    return f"Data: {websocket_client.latest_message}"

if __name__ == '__main__':
    # Start WebSocket in a separate thread
    ws_thread = threading.Thread(target=websocket_client.start_websocket)
    ws_thread.start()

    # Start Dash app
    app.run_server(debug=True)
