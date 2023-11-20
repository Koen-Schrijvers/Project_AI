from datetime import datetime, timedelta
import requests

token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTgsInJvbGUiOiJzdGFuZGFyZF91c2VyIiwiaWF0IjoxNzAwNDE5NzI2LCJleHAiOjE3MDMwMTE3MjZ9.mka3hJSZZxOEruZHS2bM1n447uqfV8OKOZozXIuUyHk"

headers = {'Authorization': f'Bearer {token}'}
def TimestampsToTertsCSV(begin_date, end_date, node, index, CSVfolder):

    unixStartTime = TurnDateIntoUnixTimestamp(begin_date)
    unixEndTime = TurnDateIntoUnixTimestamp(end_date)

    url = f"https://api-new.asasense.com/ambient/node/{node}/export/{unixStartTime}/{unixEndTime}/csv"
    response = requests.get(url, headers=headers)

    name_template = f"{CSVfolder}/lion." if node == "27" else f"{CSVfolder}/bird."

    if response.status_code == 200:
        with open(f'{name_template}{index}.{unixStartTime}_{unixEndTime}.csv', 'wb') as csv_file:
            csv_file.write(response.content)
    else:
        print(f"Error: {response.status_code}")
        print(response.text)

def TurnDateIntoUnixTimestamp(date):
    corrected_date = datetime.strptime(date, "%Y-%m-%d %H:%M:%S.%f") + timedelta(hours=2)
    return corrected_date.timestamp()
    