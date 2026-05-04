import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

export default function AIExpressionDetector() {
  const videoRef = useRef(null);
  const [expression, setExpression] = useState("Loading...");

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true
        });

        videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Camera Error:", err);
      }
    };

    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models/tiny_face_detector");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models/face_expression");
    };

    const start = async () => {
      await loadModels();
      await startVideo();

      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play();
        detect();
      };
    };

    const detect = async () => {
      if (!videoRef.current) return;

      const result = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceExpressions();

      if (result) {
        const exp = result.expressions;

        const maxExp = Object.keys(exp).reduce((a, b) =>
          exp[a] > exp[b] ? a : b
        );

        setExpression(maxExp);
      }

      requestAnimationFrame(detect);
    };

    start();
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <video ref={videoRef} autoPlay playsInline width="400" />
      <h2>Emotion: {expression}</h2>
    </div>
  );
}