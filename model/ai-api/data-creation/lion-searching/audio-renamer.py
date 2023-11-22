import os
from datetime import datetime, timedelta

folder = "./audiofiles/2023-11-01"
filenames = os.listdir(folder)

for current_filename in filenames:
    try:
        print(f"Processing file: {current_filename}")
        fragments = current_filename.split("_")
        if len(fragments) < 2:
            raise ValueError(f"Filename '{current_filename}' does not have enough parts to extract a date.")
        date = fragments[1]
        times = fragments[2].split("-")
        begin_time = times[0]
        end_time = times[1]

        if len(fragments) < 4:
            new_filename = f"{date}-{begin_time}-{end_time}"
        else:
            extra_seconds = fragments[3].replace(".flac", "").split("-")
            extra_seconds_begin = extra_seconds[0]
            extra_seconds_end = extra_seconds[1]

            datetime_object_begin = datetime.strptime(f"{begin_time}", '%H%M%S')
            datetime_object_begin += timedelta(seconds=float(extra_seconds_begin))
            final_begin_time = datetime_object_begin.strftime("%H%M%S")

            if extra_seconds_end == "end":
                new_filename = f"{date}-{final_begin_time}-{end_time}.flac"
            else:
                datetime_object_end = datetime.strptime(f"{begin_time}", '%H%M%S')
                datetime_object_end += timedelta(seconds=float(extra_seconds_end))
                final_end_time = datetime_object_end.strftime("%H%M%S")
                new_filename = f"{date}-{final_begin_time}-{final_end_time}.flac"
        
        os.rename(f"{folder}/{current_filename}", f"{folder}/{new_filename}")

    except IndexError as e:
        print(f"IndexError occurred for file '{current_filename}': {e}")
    except ValueError as e:
        print(f"ValueError occurred: {e}")
    except Exception as e:
        print(f"An unexpected error occurred for file '{current_filename}': {e}")

