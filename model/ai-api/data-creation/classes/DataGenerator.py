from datetime import datetime, timedelta
import requests
from io import StringIO
import pandas as pd
import os
from classes.SpectroGenerator import SpectroGenerator
import shutil

class DataGenerator:
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTgsInJvbGUiOiJzdGFuZGFyZF91c2VyIiwiaWF0IjoxNzAwNDE5NzI2LCJleHAiOjE3MDMwMTE3MjZ9.mka3hJSZZxOEruZHS2bM1n447uqfV8OKOZozXIuUyHk"
    headers = {'Authorization': f'Bearer {token}'}
    categories = ("Lion", "Bird", "noBird","noLion")
    def __init__(self, targetDir = "../data/unsorted", figSize = (5,5), window_time = 10, step_size = 2) -> None:
        self.targetDir = targetDir
        self.figure_size = figSize
        self.window_time = window_time
        self.step_size = step_size
        self.spectro_generator = SpectroGenerator(targetDir=targetDir)

    def GenerateData(self):
        print(f"Removing previous png's")
        for category in self.categories:

            print(f"========|category: {category}|========")
            #Prepare directories
            PNGdir = f"{self.targetDir}/{category}" 
            print(f"Creating directory: {PNGdir}", end="\r")
            os.makedirs(PNGdir, exist_ok=True)
            print(f"Creating directory: {PNGdir}: Done!")

            #select node
            node = "27" if category.find("Lion") != -1 else "17"

            #read audio fragment timestamps
            timestamps = pd.read_csv(f"timestamps/{category}.csv", sep=',')

            #Create png's
            print(f"Dowloading data and creating PNG's: 0.00%", end="\r")
            for index, row in timestamps.iterrows():
                self.TimestampsToPNG(row["begin_date"], row["end_date"],node, category)
                print(f"Dowloading data and Creating PNG's: {(index+1)*100/timestamps.shape[0]:.2f}%", end="\r")
            self.spectro_generator.index = 0
            print("\n====|Done!|====")


    def TimestampsToPNG(self, begin_date, end_date, node,category):

        unixStartTime = self.TurnDateIntoUnixTimestamp(begin_date)
        unixEndTime = self.TurnDateIntoUnixTimestamp(end_date)

        url = f"https://api-new.asasense.com/ambient/node/{node}/export/{unixStartTime}/{unixEndTime}/csv"
        response = requests.get(url, headers=self.headers)

        if response.status_code == 200:
            csv_data = response.content.decode('utf-8')
            csv_data = StringIO(csv_data)
            df = pd.read_csv(csv_data, sep=",")
            self.spectro_generator.GenerateSpectros(df,self.window_time,self.step_size,self.figure_size,category)
        else:
            print(f"Error: {response.status_code}")
            print(response.text)


    def TurnDateIntoUnixTimestamp(self,date):
        corrected_date = datetime.strptime(date, "%Y-%m-%d %H:%M:%S.%f") + timedelta(hours=2)
        return corrected_date.timestamp()


