const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const audioPlayer = document.getElementById('audioPlayer');
const dbLevelDisplay = document.getElementById('db-level');
const dbValueDisplay = document.getElementById('db-value');
let mediaRecorder;
let audioChunks = [];

// Access the user's microphone
navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function (stream) {
        // Create a MediaRecorder instance
        mediaRecorder = new MediaRecorder(stream);

        // Set up an AudioContext and AnalyserNode
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const audioDataArray = new Uint8Array(bufferLength);

        // Function to calculate the dB level
        function calculateDecibelLevel(audioData) {
            let sum = 0;
            for (let i = 0; i < audioData.length; i++) {
                sum += audioData[i] * audioData[i];
            }
            const rms = Math.sqrt(sum / audioData.length);
            const dB = 20 * Math.log10(rms);
            return dB;
        }

        let dBSum = 0;
        let dBCount = 0;
        const updateInterval = 1000; // 1 second in milliseconds

        // Function to update the average dB level display
        function updateAverageDecibelLevel() {
            analyser.getByteFrequencyData(audioDataArray);
            const dB = calculateDecibelLevel(audioDataArray);
            dBSum += dB;
            dBCount++;
        }

        // Function to display the average dB level
        function displayAverageDecibelLevel() {
            if (dBCount > 0) {
                const averagedB = dBSum / dBCount;
                dbValueDisplay.textContent = averagedB.toFixed(2);
            } else {
                dbValueDisplay.textContent = '0.00';
            }
            dBSum = 0;
            dBCount = 0;
            setTimeout(displayAverageDecibelLevel, updateInterval);
        }

        // Handle data available event
        mediaRecorder.ondataavailable = function (event) {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }
        };

        // Handle stop event
        mediaRecorder.onstop = function () {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            audioPlayer.src = URL.createObjectURL(audioBlob);
        };

        // Start recording when the "Start Recording" button is clicked
        startButton.addEventListener('click', function () {
            mediaRecorder.start();
            startButton.disabled = true;
            stopButton.disabled = false;
            setInterval(updateAverageDecibelLevel, updateInterval); // Update dB level every second
            displayAverageDecibelLevel(); // Start displaying average dB level
        });

        // Stop recording when the "Stop Recording" button is clicked
        stopButton.addEventListener('click', function () {
            mediaRecorder.stop();
            startButton.disabled = false;
            stopButton.disabled = true;
        });
    })
    .catch(function (error) {
        console.error('Error accessing the microphone:', error);
    });