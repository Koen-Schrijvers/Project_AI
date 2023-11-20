from TimestampsToTertsCSV import TimestampsToTertsCSV
from SpectroFromTerts import GenerateSpectros
import pandas as pd
import os

categories = {"lion", "bird", "noBird","noLion"}

for category in categories:

    print(f"========|category: {category}|========")

    #Prepare directories
    CSVdir = f"../data/unsorted/{category}/{category}-tertsCSVs"
    PNGdir = f"../data/unsorted/{category}/{category}-spectroPNGs"
    print(f"Creating directories: {CSVdir} and {PNGdir}", end="\r")
    os.makedirs(CSVdir, exist_ok=True)
    os.makedirs(PNGdir, exist_ok=True)
    print(f"Creating directories: {CSVdir} and {PNGdir}: Done!")

    #select node
    node = "27" if category.lower().find("lion") != -1 else "17"

    #read audio fragment timestamps
    timestamps = pd.read_csv(f"{category}.csv", sep=',')

    #Create data csv's
    for index, row in timestamps.iterrows():
        print(f"Dowloading CSV's: {(index+1)*100/timestamps.shape[0]:.2f}%", end="\r")
        TimestampsToTertsCSV(row["begin_date"], row["end_date"],node, index, CSVdir)

    print("")
    
    index = 0
    filenames = os.listdir(CSVdir)
    for file in filenames:
        GenerateSpectros(file,time_window=10,step_size=2,figsize=(5,5),CSVfolder=CSVdir, PNGfolder=PNGdir)
        print(f"Creating PNG's: {(index + 1)*100/timestamps.shape[0]:.2f}%", end="\r")
        index+=1

    print("\n====|Done!|====")


