from Model import Model
from DisplayResult import display_stats

model = Model(type="Lion", targetDir="../../api")
history = model.Model_fit(epochs=10)
model.Model_evaluate()
model.Save("ModelV1")
display_stats(history)

