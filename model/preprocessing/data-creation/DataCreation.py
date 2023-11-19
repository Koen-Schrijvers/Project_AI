from TimestampsToTertsCSV import TimestampsToTertsCSV
import pandas as pd


lions = pd.read_csv("leeuwen.csv", sep=',')

for index, row in lions.iterrows():
    TimestampsToTertsCSV(row["begin_date"], row["end_date"],"27", index)


print(lions.head())