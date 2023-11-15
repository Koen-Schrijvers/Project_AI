import pandas as pd

df = pd.read_csv('big.csv', sep=',')
relevant_data = df[["timestamp","terts001250","terts001575","terts001984","terts002500","dBA"]]
relevant_data['timestamp'] = pd.to_datetime(relevant_data['timestamp'], format="mixed")
relevant_data.set_index('timestamp', inplace=True)

tertsMask = \
    (relevant_data['terts001984'] > 65) & \
    (relevant_data['terts001575'] > 60) & \
    (relevant_data['terts002500'] > 55) & \
    (relevant_data['terts001250'] > 55) & \
    (relevant_data['dBA'] > 65)
relevant_data = relevant_data[tertsMask]

relevant_data = relevant_data.resample('2T').count()
possible_lions = relevant_data[["dBA"]]
possible_lions = possible_lions[possible_lions["dBA"] > 0]
possible_lions = possible_lions.rename(columns={'dBA': 'Count'})
possible_lions = possible_lions.sort_values(by='Count', ascending=False)

possible_lions.to_csv('possible-lions.csv')