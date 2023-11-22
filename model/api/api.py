from flask import Flask
import keras as k 
from ASAsenseService import GetLatest80Value
import numpy as np
import json

app = Flask(__name__)

lion_model = k.models.load_model(f"lion-model.keras")
#bird_model = k.models.load_model(f"bird-model.keras")python ap

# Define a route for the GET method
@app.route('/api/lion', methods=['GET'])
def get_lion():
    first,last = GetLatest80Value("27")
    image1 = k.utils.load_img(
        "latest_from_node27.png",
        color_mode="rgb",
        target_size=[387,385],
        interpolation="nearest",
        keep_aspect_ratio=False,
    )
    input_arr = k.utils.img_to_array(image1)
    input_arr = np.array([input_arr]) 
    #lion => 0%
    prediction = lion_model.predict(input_arr)
    result_dict = {
        'first': first,
        'last': last,
        'prediction': float(prediction[0][0]*100)
    }

    # Convert the dictionary to a JSON-formatted string
    result_json = json.dumps(result_dict)

    return result_json

@app.route('/api/bird', methods=['GET'])
def get_bird():
    print("GET /api/bird")
    return 'Hello, this is your string!'

if __name__ == '__main__':
    port = 5001
    print(f"Starting the server on http://127.0.0.1:{port}/")
    app.run(debug=False, port=port)