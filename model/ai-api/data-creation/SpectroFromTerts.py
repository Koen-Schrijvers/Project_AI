import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.colors import Normalize
import os 


def GenerateSpectros(csv_filename, time_window, step_size, figsize, CSVfolder, PNGfolder):
    fig, ax = plt.subplots(1, 1, figsize=figsize)
    df = pd.read_csv(f'{CSVfolder}/{csv_filename}')
    window = time_window*8
    step_size = 10
    num_iterations = (len(df) - window) // step_size

    for i in range(num_iterations):
        start_row = i * step_size
        end_row = start_row + window
        current_window = df.iloc[start_row:end_row]
        spectro(current_window, ax, False, i, csv_filename, PNGfolder)
    

def spectro(df, ax, normalized, index, csv_filename, png_folder):
    terts_columns = df.loc[:, 'terts000197':'terts201587']
    terts_columns.columns = terts_columns.columns.str.replace('terts', '')
    terts_columns = terts_columns.iloc[:, ::-1]

    if normalized:
        custom_norm = Normalize(vmin=0, vmax=85)
        ax.imshow(terts_columns.transpose(), cmap='inferno', aspect='auto', interpolation='none', norm=custom_norm)
    else:
        ax.imshow(terts_columns.transpose(), cmap='inferno', aspect='auto', interpolation='none')

    plt.gca().set_axis_off()
    plt.margins(0,0)

    plt.savefig(f'{png_folder}/{csv_filename}_{index}.png',bbox_inches='tight',pad_inches = 0)
