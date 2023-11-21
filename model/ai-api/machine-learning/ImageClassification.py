from keras import layers
import keras as k 
from DataManager import DataManager
from DisplayResult import display_stats

data_augmentation = k.Sequential(
 [
 layers.RandomFlip("horizontal"),
 layers.RandomRotation(0.1),
 layers.RandomZoom(0.2),
 ]
)

#Convolutional network
inputs = k.Input(shape = (387,385,3))
x = data_augmentation(inputs)
x = layers.Rescaling(1./255)(x)
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
model = k.Model(inputs=inputs, outputs=outputs)

model.compile(
    loss = "binary_crossentropy",
    optimizer = "rmsprop",
    metrics=["accuracy"]
    )

data_manager = DataManager()
validation_dataset = data_manager.get_validation_data("Lion")

train_dataset = data_manager.get_train_data("Lion")

test_dataset = data_manager.get_test_data("Lion")

callbacks = [
    k.callbacks.ModelCheckpoint(
    filepath="lion-model.keras",
    save_best_only=True,
    monitor="val_loss")
]
history = model.fit(
 train_dataset,
 epochs=10,
 validation_data=validation_dataset,
 callbacks=callbacks
)

display_stats(history)

test_model = k.models.load_model("lion-model.keras")
test_loss, test_acc = test_model.evaluate(test_dataset)
print(f"Test accuracy: {test_acc:.3f}")

