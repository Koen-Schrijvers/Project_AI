import os 
from datetime import datetime, timedelta
folder = "audio/2023-09-18"
test_folder = "test"
filenames =  os.listdir(folder)

for current_filename in filenames:
    print(current_filename)
    fragments = current_filename.split("_")
    date = fragments[1]
    times = fragments[2].split("-")
    begin_time = times[0]
    end_time = times[1]
    if len(fragments) < 4:
        new_filename = f"{date}-{begin_time}-{end_time}"
    else:
        extra_seconds = fragments[3].replace(".flac","").split("-")
        extra_seconds_begin = extra_seconds[0]
        extra_seconds_end = extra_seconds[1]

        datetime_object_begin = datetime.strptime(f"{begin_time}", '%H%M%S')
        datetime_object_begin = datetime_object_begin + timedelta(seconds=float(extra_seconds_begin))
        final_begin_time=datetime_object_begin.strftime("%H%M%S")
        if extra_seconds_end == "end":
            new_filename=f"{date}-{final_begin_time}-{end_time}.flac"
        else:
            datetime_object_end = datetime.strptime(f"{begin_time}", '%H%M%S')
            datetime_object_end = datetime_object_end + timedelta(seconds=float(extra_seconds_end))
            final_end_time=datetime_object_end.strftime("%H%M%S")
            new_filename = f"{date}-{final_begin_time}-{final_end_time}.flac"
    os.rename(f"{folder}/{current_filename}", f"{folder}/{new_filename}")