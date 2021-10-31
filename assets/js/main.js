const video = document.getElementById('videoElm');

const loadFaceAPI = async () => {
  await faceapi.nets.faceLandmark68Net.loadFromUri("./assets/models");
  await faceapi.nets.faceRecognitionNet.loadFromUri("./assets/models");
  await faceapi.nets.tinyFaceDetector.loadFromUri("./assets/models");
  await faceapi.nets.faceExpressionNet.loadFromUri("./assets/models");
  await faceapi.nets.ageGenderNet.loadFromUri("./assets/models");
}

function getCameraStream() {
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: {}})
      .then(stream => {
        video.srcObject = stream
      }).catch(err => console.log(error));
  }
}

video.addEventListener('playing', () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = {
    width: video.videoWidth,
    height: video.videoHeight
  }

  setInterval(async () => {
    const detects = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withAgeAndGender()
      .withFaceExpressions()
      .withFaceDescriptors();
    console.log(detects)
    const resizedDetects = faceapi.resizeResults(detects, displaySize);
    canvas.getContext('2d').clearRect(0, 0, displaySize.width, displaySize.height);
    faceapi.draw.drawDetections(canvas, resizedDetects);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetects);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetects);
  }, 300);
});

loadFaceAPI().then(getCameraStream());
