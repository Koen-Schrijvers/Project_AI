import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.colors import Normalize
from datetime import datetime, timedelta
import pandas as pd 
import requests
from io import StringIO 



# Global variable to keep track of the "current" datetime
current_datetime = datetime.strptime("2023-10-02 02:00:00.000", "%Y-%m-%d %H:%M:%S.%f")

print("ASAsenseService.py loaded, time set to: ", current_datetime)



token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTgsInJvbGUiOiJzdGFuZGFyZF91c2VyIiwiaWF0IjoxNzA0NDE3MTU2LCJleHAiOjE3MDcwMDkxNTZ9.k1-RP99I_ZnzPNUUe2s3uKdL1cAB5famFQx0C9YxhH8"
headers = {'Authorization': f'Bearer {token}'}

def GetLatest80Value(node):
    global current_datetime

    current_timestamp = int(current_datetime.timestamp())
    earlier_timestamp = int(current_timestamp - 10)  # 10 seconds earlier

    print("current_datetime: " + str(current_datetime))


    url = f"https://api-new.asasense.com/ambient/node/{node}/export/{earlier_timestamp}/{current_timestamp}/csv"
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        csv_data = response.content.decode('utf-8')
        csv_data = StringIO(csv_data)
        df = pd.read_csv(csv_data, sep=",")
        #print(df.shape[0])
        spectro(df, False, node)  # Directly use df, as it should have 80 values
        timestamps = GetFirstAndLastTimestamp(df)

        # Increment the global datetime by 10 seconds for the next call
        current_datetime += timedelta(seconds=10)

        return timestamps
    else:
        print(f"Error: {response.status_code}")
        print(response.text)


def spectro(df, normalized, node):
    fig, ax = plt.subplots(1, 1, figsize=(5,5))
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
    plt.savefig(f'latest_from_node{node}.png',bbox_inches='tight',pad_inches = 0)
    plt.close(fig)  # Close the figure after saving

def GetFirstAndLastTimestamp(df):
    last_timestamp = df['timestamp'].iloc[-1]
    first_timestamp = df['timestamp'].iloc[0]
    last_timestamp = datetime.strptime(last_timestamp, "%Y-%m-%d %H:%M:%S.%f") + timedelta(hours=1)
    first_timestamp = datetime.strptime(first_timestamp, "%Y-%m-%d %H:%M:%S.%f") + timedelta(hours=1)
    last_timestamp = int(last_timestamp.timestamp())
    first_timestamp = int(first_timestamp.timestamp())
    return ( first_timestamp,last_timestamp)
