var trackerAr = (function () {
    let videoContainer
    let videoEle;
    let canvasEle;
    let canvasCtx;
    let video = false;

    let instantiate = {};

    instantiate.takePhoto = function() {
        if (video == false) {
            initCamera();
        } else {
            canvasEle.toBlob((blob) => {
                let file = new File([blob], "fileName.jpg", {
                    type: "image/jpeg"
                });
                let container = new DataTransfer();
                container.items.add(file);

                let formFile = document.getElementById("formFile");
                formFile.files = container.files;

                video = false;
                videoEle.pause();

            }, 'image/jpeg');
        }
    }

    function initCamera() {
        videoContainer = document.getElementById('videoContainer');
        videoEle = document.getElementById("video");
        canvasEle = document.getElementById("canvas");
        canvasCtx = canvas.getContext('2d');

        const faceMesh = new FaceMesh({
            locateFile: (file) => {
                return `src/mediapipe/${file}`;
            }
        });
        faceMesh.setOptions({
            enableFaceGeometry: false,
            maxNumFaces: 1,
            refineLandmarks: false,
            minDetectionConfidence: 0.95,
            minTrackingConfidence: 0.95
        });
        faceMesh.onResults(onResults);

        navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "user"
            },
            audio: false,
        }).then(function (stream) {
            videoEle.srcObject = stream;

            videoContainer.style.display = 'block';
            canvasEle.width = videoContainer.clientWidth;
            canvasEle.height = videoContainer.clientHeight;
            video = true;

            function onFrame() {
                faceMesh.send({
                    image: videoEle
                }).then(n => {
                    if (!videoEle.paused && !videoEle.ended) {
                        requestAnimationFrame(onFrame)
                    }
                })
            }
            onFrame();
        });
    }

    function onResults(results) {
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasEle.width, canvasEle.height);
        canvasCtx.drawImage(results.image, 0, 0, canvasEle.width, canvasEle.height);
        if (results.multiFaceLandmarks) {
            for (const landmarks of results.multiFaceLandmarks) {
                //drawMesh(landmarks);
                drawMask(landmarks);
            }
        }
        canvasCtx.restore();
    }

    function drawMesh(landmarks) {
        drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, {
            color: '#C0C0C070',
            lineWidth: 1
        });
        drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE, {
            color: '#FF3030'
        });
        drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYEBROW, {
            color: '#FF3030'
        });
        drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_IRIS, {
            color: '#FF3030'
        });
        drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE, {
            color: '#30FF30'
        });
        drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYEBROW, {
            color: '#30FF30'
        });
        drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_IRIS, {
            color: '#30FF30'
        });
        drawConnectors(canvasCtx, landmarks, FACEMESH_FACE_OVAL, {
            color: '#E0E0E0'
        });
        drawConnectors(canvasCtx, landmarks, FACEMESH_LIPS, {
            color: '#E0E0E0'
        });
        showNumbers(landmarks);
    }

    function showNumbers(landmarks) {
        let i = 0;
        for (const landmark of landmarks) {
            canvasCtx.fillText(i, canvasEle.width * landmark.x, canvasEle.height * landmark.y);
            i++;
        }
    }

    function loadImage(url) {
        let img = new Image();
        img.src = url;
        return img;
    }

    const imgDogEarRight = loadImage("images/masks/dog-ear-right.png");
    const imgDogEarLeft = loadImage("images/masks/dog-ear-left.png");
    const imgDogNose = loadImage("images/masks/dog-nose.png");

    function drawMask(landmarks) {
        canvasCtx.drawImage(imgDogEarRight, canvasEle.width * landmarks[103].x - 100, canvasEle.height * landmarks[103].y - 90);
        canvasCtx.drawImage(imgDogEarLeft, canvasEle.width * landmarks[332].x - 0, canvasEle.height * landmarks[332].y - 90);
        canvasCtx.drawImage(imgDogNose, canvasEle.width * landmarks[1].x - 54, canvasEle.height * landmarks[1].y - 32);
    }

    return instantiate;
})();