import os
from datetime import datetime, timedelta

def parse_filename(filename):
    parts = filename.split('_')
    if len(parts) < 3:
        print(f"Bestandsnaam '{filename}' heeft niet het verwachte formaat. Overgeslagen.")
        return None

    sensor_name = parts[0]
    start_date_str = parts[1]

    if len(parts) == 4:  # Formaat met relatieve tijd binnen absolute tijdspanne
        absolute_times_str, relative_times_str = parts[2], parts[3].split('.')[0]
        try:
            if '-' in absolute_times_str:
                absolute_start_str, absolute_end_str = absolute_times_str.split('-')
                absolute_start = datetime.strptime(start_date_str + '_' + absolute_start_str, "%Y%m%d_%H%M%S")
                absolute_end = datetime.strptime(start_date_str + '_' + absolute_end_str, "%Y%m%d_%H%M%S")
            else:
                # Als er geen '-' in absolute_times_str, gebruik start_date_str voor zowel begin als eind
                absolute_start = datetime.strptime(start_date_str + '_' + absolute_times_str, "%Y%m%d_%H%M%S")
                absolute_end = absolute_start

            if '-' in relative_times_str:
                relative_start_str, relative_end_str = relative_times_str.split('-')
                relative_start = float(relative_start_str)
                relative_end = float(relative_end_str) if relative_end_str != 'end' else (absolute_end - absolute_start).total_seconds()
            else:
                # Als er geen '-' in relative_times_str, gebruik het als start en eind
                relative_start = float(relative_times_str)
                relative_end = relative_start

            return sensor_name, absolute_start, absolute_end, relative_start, relative_end
        except ValueError as e:
            print(f"Ongeldig datumformaat in bestandsnaam '{filename}': {e}. Overgeslagen.")
            return None


def calculate_absolute_times(absolute_start, absolute_end, relative_start, relative_end):
    new_start = absolute_start + timedelta(seconds=relative_start)
    new_end = new_start + timedelta(seconds=relative_end)
    return new_start, new_end

def format_new_filename(sensor_name, start, end, extension):
    formatted_start = start.strftime("%m-%d__%H_%M_%S")
    formatted_end = end.strftime("%H_%M_%S")
    return f"{formatted_start}__{formatted_end}{extension}"

def rename_files_in_directory(directory):
    for filename in os.listdir(directory):
        if filename.endswith('.mp3') or filename.endswith('.flac'):  
            parsed = parse_filename(filename)
            if parsed:
                sensor_name, absolute_start, absolute_end, relative_start, relative_end = parsed
                new_start, new_end = calculate_absolute_times(absolute_start, absolute_end, relative_start, relative_end)

                new_filename = format_new_filename(sensor_name, new_start, new_end, os.path.splitext(filename)[1])
                os.rename(os.path.join(directory, filename), os.path.join(directory, new_filename))
                print(f"Renamed {filename} to {new_filename}")


directory_path = './audiofiles/2023-11-01/'  # Vervang dit door het pad naar je map
rename_files_in_directory(directory_path)
