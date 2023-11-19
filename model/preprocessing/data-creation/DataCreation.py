from TimestampsToTertsCSV import TimestampsToTertsCSV
from SpectroFromTerts import GenerateSpectros
import pandas as pd
import os


lions = pd.read_csv("leeuwen.csv", sep=',')
#birds = pd.read_csv("vogels.csv", sep=',')

os.makedirs("lion-tertsCSVs", exist_ok=True)
os.makedirs("bird-tertsCSVs", exist_ok=True)

os.makedirs("lion-spectroPNGs", exist_ok=True)
os.makedirs("bird-spectroPNGs", exist_ok=True)

for index, row in lions.iterrows():
    TimestampsToTertsCSV(row["begin_date"], row["end_date"],"27", index)


#for index, row in birds.iterrows():
#    TimestampsToTertsCSV(row["begin_date"], row["end_date"],"17", index)


directory_path = 'lion-tertsCSVs'
filenames = os.listdir(directory_path)
for file in filenames:
    #time_window => een window van 10s doorheen de data, step_size => increment van aantal rijen
    GenerateSpectros(file,time_window=10,step_size=2,figsize=(5,5),CSVfolder="lion-tertsCSVs", PNGfolder="lion-spectroPNGs")

