import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.colors as colors
import numpy as np
import re
from datetime import datetime
import sys
import os

# Check if the filename is provided as a command-line argument
if len(sys.argv) > 1:
    csv_file = sys.argv[1]  # The first command line argument after the script name
else:
    print("Please provide the filename as a command line argument.")
    sys.exit(1)  # Exit the script if no argument is given


#Make leeuw directory
category_name = 'leeuw'
category_dir = os.path.join('dataset', category_name)
os.makedirs(category_dir, exist_ok=True)

# Read the CSV file
print("Reading the CSV file...")
data = pd.read_csv(csv_file)

# Convert timestamp column to datetime objects
data['timestamp'] = pd.to_datetime(data['timestamp'])

# Calculate the time differences in seconds
time_differences = data['timestamp'].diff().dt.total_seconds().fillna(0).cumsum()

# Selecting only the octave band columns
octave_bands = data.filter(regex='terts')

# Function to extract frequency from column name
def extract_frequency(col_name):
    match = re.search(r'\d+', col_name)
    return float(match.group()) if match else None

# Preparing the data for the spectrogram
print("Preparing the data for the spectrogram...")
frequencies = [extract_frequency(col) for col in octave_bands.columns]
frequencies = [freq for freq in frequencies if freq is not None]

plt.figure(figsize=(10, 5))
frequencies_array = np.array(frequencies)
octave_bands_values = octave_bands.T.values  # Transpose and get numpy array for plotting

# Use SymLogNorm for a logarithmic color scale
norm = colors.SymLogNorm(linthresh=0.03, linscale=0.03, vmin=octave_bands_values.min(), vmax=octave_bands_values.max(), base=10)

# Calculate the number of measurements that fit into a 10-second window
time_step = time_differences[1] - time_differences[0]  # Time step between consecutive measurements
measurements_per_segment = int(10 / time_step) # Number of measurements in 10 seconds

# Generate overlapping spectrograms, shifted by one measurement each time

timestamp_str = data['timestamp'][2].strftime('%Y-%m-%d_%H%M%S')

print("Generating spectrograms...")
for start_idx in range(len(time_differences) - measurements_per_segment):
    end_idx = start_idx + measurements_per_segment
    segment_times = time_differences[start_idx:end_idx]
    segment_values = octave_bands_values[:, start_idx:end_idx]

    


    # Plotting the spectrogram for the current segment
    plt.figure(figsize=(5, 5))
    plt.pcolormesh(segment_times, frequencies_array, segment_values, shading='auto', norm=norm, cmap='inferno', edgecolor='none')
    plt.yscale('log')
    plt.axis('off')
    
    # Save the figure
    output_filename = os.path.join(category_dir, f'{timestamp_str}spectrogram_segment_{start_idx}.png')
    plt.savefig(output_filename, bbox_inches='tight', pad_inches=0)
    print(f'saved spectrogram_segment_{start_idx}.png')
    plt.close()  # Close the plot to free up memory


print("Done!")
