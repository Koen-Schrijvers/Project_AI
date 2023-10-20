const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();

// Access the user's microphone
navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function (stream) {
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const canvas = document.getElementById('audioVisualizer');
        const canvasContext = canvas.getContext('2d');

        function draw() {
            analyser.getByteTimeDomainData(dataArray);
            canvasContext.clearRect(0, 0, canvas.width, canvas.height);

            canvasContext.lineWidth = 2;
            canvasContext.strokeStyle = 'rgb(0, 0, 0)';
            canvasContext.beginPath();

            const sliceWidth = canvas.width * 1.0 / bufferLength;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = v * canvas.height / 2;

                if (i === 0) {
                    canvasContext.moveTo(x, y);
                } else {
                    canvasContext.lineTo(x, y);
                }

                x += sliceWidth;
            }

            canvasContext.lineTo(canvas.width, canvas.height / 2);
            canvasContext.stroke();

            requestAnimationFrame(draw);
        }

        draw();
    })
    .catch(function (error) {
        console.error('Error accessing the microphone:', error);
    });

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
            analyser.fftSize = 2048; // Adjust the FFT size as needed
            const bufferLength = analyser.frequencyBinCount;

            // Set up a canvas for the vertical, colorful spectrogram
            const canvas = document.getElementById('spectrogram');
            const canvasContext = canvas.getContext('2d');
            const width = canvas.width;
            const height = canvas.height;

            // Create a dataArray to store audio data
            const dataArray = new Uint8Array(bufferLength);

            function drawSpectrogram() {
                analyser.getByteFrequencyData(dataArray);

                // Create a color palette
                const colorPalette = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];

                // Clear the canvas
                canvasContext.fillStyle = 'black';
                canvasContext.fillRect(0, 0, width, height);

                // Draw the vertical, colorful spectrogram
                for (let i = 0; i < bufferLength; i++) {
                    const value = dataArray[i];
                    const color = colorPalette[i % colorPalette.length];
                    canvasContext.fillStyle = color;

                    const amplitude = value / 255; // Normalize amplitude
                    const x = (i / bufferLength) * width; // Scale based on buffer length
                    const y = height - (amplitude * height); // Reverse the y-axis

                    canvasContext.fillRect(x, y, 1, height - y);
                }

                requestAnimationFrame(drawSpectrogram);
            }

            // Connect the microphone source to the analyser
            source.connect(analyser);

            // Start drawing the vertical, colorful spectrogram
            drawSpectrogram();
        })
        .catch(function (error) {
            console.error('Error accessing the microphone:', error);
        });
});
