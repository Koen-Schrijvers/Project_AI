from flask import Flask
import keras as k 
from ASAsenseService import GetLatest80Value
import numpy as np
import json
import pandas as pd
import time

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

@app.route('/api/lion/saveresults', methods=['GET'])
def save_lion():
    print("GET /api/lion/saveresults")
    
    node = 27
    results_df = pd.DataFrame(columns=['first', 'last', 'prediction'])
    csv_file_path = 'api_responses.csv'

    for i in range(8640):  # Or 8640 for a full day
        try:
            first, last = GetLatest80Value(node)

            # Load the image and preprocess it
            image1 = k.utils.load_img(
                f"latest_from_node{node}.png",
                color_mode="rgb",
                target_size=[387,385],
                interpolation="nearest",
                keep_aspect_ratio=False,
            )
            input_arr = k.utils.img_to_array(image1)
            input_arr = np.array([input_arr])  # Convert to a batch of size 1

            # Generate prediction
            prediction = lion_model.predict(input_arr)
            prediction_value = float(prediction[0][0] * 100)

            # Create a DataFrame from the response and concat it with the results_df
            response_df = pd.DataFrame([{'first': first, 'last': last, 'prediction': prediction_value}])
            results_df = pd.concat([results_df, response_df], ignore_index=True)
            # Save every 10 iterations
            if (i + 1) % 10 == 0:
                results_df.to_csv(csv_file_path, index=False)

        except Exception as e:
            print(f"Error during API call or prediction: {e}")
        
        # Delay for .05 sec to pray the api just works
        time.sleep(0.05)

    # Save any remaining data that wasn't saved in the last batch
    if len(results_df) % 10 != 0:
        results_df.to_csv(csv_file_path, index=False)

    return f"Results saved to {csv_file_path}"







@app.route('/api/bird', methods=['GET'])
def get_bird():
    print("GET /api/bird")
    return 'Hello, this is your string!'

if __name__ == '__main__':
    port = 5001
    print(f"Starting the server on http://127.0.0.1:{port}/")
    app.run(debug=False, port=port)