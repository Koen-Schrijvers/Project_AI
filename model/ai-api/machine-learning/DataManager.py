import os, pathlib, shutil
from keras.utils import image_dataset_from_directory

class DataManager:
    def __init__(self,data_folder = "../data/unsorted") -> None:
        self.original_dir = pathlib.Path(data_folder)
        self.new_base_dir = pathlib.Path("../data/sorted")

    def make_subset_per_category(self,subset_name, category, start_index, end_index): 
        base_folder = category.replace("no","")
        dir = self.new_base_dir / base_folder / subset_name / category
        os.makedirs(dir)
        for i in range(start_index, end_index):
            fname = f"{category}.{i}.png"
            shutil.copyfile(src=self.original_dir/ category / fname, dst=dir / fname)

    def make_preset_subsets(self):
        for category in ("Lion", "Bird", "noLion", "noBird"):
            self.make_subset_per_category("Train", category ,start_index=0, end_index=20) 
            self.make_subset_per_category("Validation", category, start_index=20, end_index=30) 
            self.make_subset_per_category("Test", category, start_index=30, end_index=40)
 

    def get_train_data(self,model_type):
        return image_dataset_from_directory(
            self.new_base_dir / model_type / "Train",
            image_size=(387, 385),
            batch_size=32)
    def get_test_data(self,model_type):
        return image_dataset_from_directory(
            self.new_base_dir / model_type / "Test",
            image_size=(387, 385),
            batch_size=32)
    def get_validation_data(self,model_type):
        return image_dataset_from_directory(
            self.new_base_dir / model_type / "Validation",
            image_size=(387, 385),
            batch_size=32)