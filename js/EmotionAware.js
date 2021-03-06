var Habitat = Habitat || {};


jQuery(document).ready(function () {
    Habitat.EmotionAware.DomReady();
});


Habitat.EmotionAware = {

    DomReady: function () {
        this.CreateImageStreamFromVisitor(function (faceStream) {
             document.querySelector('img').src = faceStream;
			 jQuery("#stringBase").val(faceStream);
        });

    },

    CreateImageStreamFromVisitor: function (callback) {

        window.URL || (window.URL = window.webkitURL || window.msURL || window.oURL);

        var video = document.createElement('video'),
                    canvas = document.createElement('canvas'),
                    context = canvas.getContext('2d'),
                    localMediaStream = null,
                    snap = false;

				
					
        var mediaConstraints = { audio: false, video: { width: 400, height: 320 } }

        navigator.mediaDevices.getUserMedia(mediaConstraints).then(successCallback).catch(errorCallback);
		
        canvas.setAttribute('width', 400);
        canvas.setAttribute('height', 320);

		video.setAttribute('autoplay', true);	
		
		jQuery(canvas).appendTo("#feed");	
        

        function successCallback(stream) {
            video.src = (window.URL && window.URL.createObjectURL) ? window.URL.createObjectURL(stream) : stream;
            localMediaStream = stream;
            processWebcamVideo();
        }

        function errorCallback(error) {
            console.log(error.message);
        }


        function snapshot(faces) {
            if (!faces) {
                return false;
            }

            for (var i = 0; i < faces.length; i++) {
                var face = faces[i];

                if (face.height <= 35)
                    continue;

                if (localMediaStream) {
					callback(canvas.toDataURL('image/jpeg', 0.5));
                    return true;
                }
            }

            return false;


        }

        function processWebcamVideo() {

            var startTime = +new Date(),
                faces;

            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            faces = detectFaces();

            if (!snap) {
                snap = snapshot(faces);
            }

            // Log process time
            console.log(+new Date() - startTime);

            // And repeat.
            if (!snap) {
                setTimeout(processWebcamVideo, 50);
            } else {
                localMediaStream.stop();
            }
        }

        function detectFaces() {
            // What do these parameters mean?
            // I couldn't find any documentation, and used what was found here:
            // https://github.com/liuliu/ccv/blob/unstable/js/index.html

            return ccv.detect_objects({ canvas: (ccv.pre(canvas)), cascade: cascade, interval: 2, min_neighbors: 1 });
        }

    }


}





