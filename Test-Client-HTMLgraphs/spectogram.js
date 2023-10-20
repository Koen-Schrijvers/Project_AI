// Wrap your JavaScript code in a DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function () {
    // Create an audio context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Access the user's microphone
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function (stream) {
            const source = audioContext.createMediaStreamSource(stream);

            // Create an AnalyserNode
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256; // Adjust the FFT size as needed
            const bufferLength = analyser.frequencyBinCount;

            // Set up a canvas for the spectrogram
            const canvas = document.getElementById('spectrogram');
            const canvasContext = canvas.getContext('2d');
            const width = canvas.width;
            const height = canvas.height;

            // Create a dataArray to store audio data
            const dataArray = new Uint8Array(bufferLength);

            // Set up the drawing
            canvasContext.fillStyle = 'black';
            canvasContext.fillRect(0, 0, width, height);

            function drawSpectrogram() {
                analyser.getByteFrequencyData(dataArray);

                // Clear the canvas
                canvasContext.fillStyle = 'black';
                canvasContext.fillRect(0, 0, width, height);

                // Draw the spectrogram
                for (let i = 0; i < bufferLength; i++) {
                    const value = dataArray[i];
                    const color = `rgb(${value}, 0, 0)`; // Adjust color representation
                    canvasContext.fillStyle = color;
                    canvasContext.fillRect(0, i, width, 1);
                }

                requestAnimationFrame(drawSpectrogram);
            }

            // Connect the microphone source to the analyser
            source.connect(analyser);

            // Start drawing the spectrogram
            drawSpectrogram();
        })
        .catch(function (error) {
            console.error('Error accessing the microphone:', error);
        });
});
