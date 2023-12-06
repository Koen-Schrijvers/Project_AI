from keras import layers
import keras as k 
from DataManager import DataManager


class Model:
    def __init__(self, type, targetDir) -> None:
        self.type = type
        self.targetDir = targetDir
        inputs = k.Input(shape = (387,385,3))
        x = layers.Rescaling(1./255)(inputs)
        x = layers.Conv2D(filters=32, kernel_size = 3, activation = "relu") (x)
        x = layers.MaxPooling2D(pool_size=2)(x)
        x = layers.Conv2D(filters=64, kernel_size=3, activation="relu")(x)
        x = layers.MaxPooling2D(pool_size=2)(x)
        x = layers.Conv2D(filters=128, kernel_size=3, activation="relu")(x)
        x = layers.MaxPooling2D(pool_size=2)(x)
        x = layers.Conv2D(filters=256, kernel_size=3, activation="relu")(x)
        x = layers.MaxPooling2D(pool_size=2)(x)
        x = layers.Conv2D(filters=256, kernel_size=3, activation="relu")(x)
        x = layers.Flatten()(x)
        x = layers.Dropout(0.5)(x)
        outputs = layers.Dense(1, activation="sigmoid")(x)
        self.model = k.Model(inputs=inputs, outputs=outputs)
        self.model.compile(
            loss = "binary_crossentropy",
            optimizer = "rmsprop",
            metrics=["accuracy"]
        )
        self.data_manager = DataManager()

        self.validation_dataset = self.data_manager.get_validation_data(self.type)
        self.train_dataset = self.data_manager.get_train_data(self.type)
        self.test_dataset = self.data_manager.get_test_data(self.type)


    def Model_fit(self,epochs):
        callbacks = [
        k.callbacks.ModelCheckpoint(
            filepath=f"{self.targetDir}/{self.type}-model.keras",
            save_best_only=True,
            monitor="val_loss")
        ]
        return self.model.fit(
        self.train_dataset,
        epochs=epochs,
        validation_data=self.validation_dataset,
        callbacks=callbacks
    )
    def Save(self, name):
        self.model.save(name, save_format="tf")

    def Model_evaluate(self):
        test_model = k.models.load_model(f"{self.targetDir}/{self.type}-model.keras")
        test_loss, test_acc = test_model.evaluate(self.test_dataset)
        print(f"Test accuracy: {test_acc:.3f}")





