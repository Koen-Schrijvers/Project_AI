import os, pathlib, shutil
from keras.utils import image_dataset_from_directory


original_dir = pathlib.Path("data/unsorted")
new_base_dir = pathlib.Path("data/sorted")

class DataSorter:

    def make_subset(self,subset_name, category, start_index, end_index): 
        for subcategory in (category, f"no{category}"):
            dir = new_base_dir / f"{category}-data" / subset_name / subcategory
            os.makedirs(dir)
            for i in range(start_index, end_index):
                fname = f"{subcategory}.{i}.png"
                shutil.copyfile(src=original_dir/ subcategory / fname, dst=dir / fname)

data_sorter = DataSorter()    
#Alle Foto's
for category in ("Lion", "Bird"):
    data_sorter.make_subset("Train", category ,start_index=0, end_index=20) 
    data_sorter.make_subset("Validation", category, start_index=20, end_index=30) 
    data_sorter.make_subset("Test", category, start_index=30, end_index=40)


#Moet nog verder gemaakt worden
def get_train_data():
    return image_dataset_from_directory(
        new_base_dir / "train",
        image_size=(180, 180),
        batch_size=32)
def get_test_data():
    return image_dataset_from_directory(
        new_base_dir / "test",
        image_size=(180, 180),
        batch_size=32)
def get_validation_data():
    return image_dataset_from_directory(
        new_base_dir / "validation",
        image_size=(180, 180),
        batch_size=32)