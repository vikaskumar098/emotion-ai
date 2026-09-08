/**
 * useFaceDetection — Core face detection hook for Emotion AI
 *
 * Extracts and upgrades the detection logic from the original ProDashboard.jsx.
 * Key improvements:
 * - Multi-face detection (detectAllFaces instead of detectSingleFace)
 * - Throttled detection at ~300ms intervals (not every rAF)
 * - Proper camera start/stop controls
 * - Model loading states and error handling
 * - Canvas overlay for bounding boxes (drawn via refs, not React state)
 * - Clean unmount/cleanup
 */
import { useRef, useState, useCallback, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import { getDominantExpression, getDominantConfidence, EXPRESSIONS } from '../utils/expressionUtils';

const DETECTION_INTERVAL_MS = 300;

export default function useFaceDetection() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const detectingRef = useRef(false);
  const intervalRef = useRef(null);

  const [isModelLoading, setIsModelLoading] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [isMirrored, setIsMirrored] = useState(true);
  const [error, setError] = useState(null);
  const [detections, setDetections] = useState([]);

  const isMirroredRef = useRef(true);
  const latestDetectionsRef = useRef([]);

  const toggleMirror = useCallback(() => {
    setIsMirrored((prev) => !prev);
  }, []);

  useEffect(() => {
    isMirroredRef.current = isMirrored;
  }, [isMirrored]);

  // Load face-api.js models (preserves original model paths)
  const loadModels = useCallback(async () => {
    if (isModelLoaded) return true;
    try {
      setIsModelLoading(true);
      setError(null);
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models/tiny_face_detector');
      await faceapi.nets.faceExpressionNet.loadFromUri('/models/face_expression');
      setIsModelLoaded(true);
      setIsModelLoading(false);
      return true;
    } catch (err) {
      setError('Failed to load AI models. Please refresh and try again.');
      setIsModelLoading(false);
      return false;
    }
  }, [isModelLoaded]);

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      setIsCameraLoading(true);
      setError(null);

      // Load models first
      const modelsReady = await loadModels();
      if (!modelsReady) {
        setIsCameraLoading(false);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            resolve();
          };
        });
      }

      setIsCameraActive(true);
      setIsCameraLoading(false);
      detectingRef.current = true;
      startDetection();
    } catch (err) {
      setIsCameraLoading(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Camera permission denied. Please allow camera access in your browser settings.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No camera found. Please connect a camera and try again.');
      } else if (err.name === 'NotReadableError') {
        setError('Camera is in use by another application. Please close it and try again.');
      } else {
        setError('Failed to start camera. Please check your device and try again.');
      }
    }
  }, [loadModels]);

  // Stop camera
  const stopCamera = useCallback(() => {
    detectingRef.current = false;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    setIsCameraActive(false);
    setDetections([]);
  }, []);

  // Draw bounding boxes on canvas overlay (via refs, not React state)
  const drawOverlay = useCallback((results) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const displayWidth = video.clientWidth;
    const displayHeight = video.clientHeight;
    if (!displayWidth || !displayHeight) return;

    // Use faceapi to match canvas dimensions to displayed video size
    const displaySize = { width: displayWidth, height: displayHeight };
    faceapi.matchDimensions(canvas, displaySize);

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!results || results.length === 0) return;

    // Transform detection coordinates to displayed element coordinates
    const resizedDetections = faceapi.resizeResults(results, displaySize);
    const mirrored = isMirroredRef.current;

    for (const detection of resizedDetections) {
      const { x, y, width, height } = detection.detection.box;
      const dominant = getDominantExpression(detection.expressions);
      const confidence = getDominantConfidence(detection.expressions);

      // Handle mirroring: if mirrored, mirror x coordinate so box matches flipped video
      const boxX = mirrored ? displaySize.width - (x + width) : x;

      // Bounding box
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.strokeRect(boxX, y, width, height);

      // Corner accents
      const cornerLen = Math.min(14, width / 4, height / 4);
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 3;

      // Top-left
      ctx.beginPath();
      ctx.moveTo(boxX, y + cornerLen);
      ctx.lineTo(boxX, y);
      ctx.lineTo(boxX + cornerLen, y);
      ctx.stroke();

      // Top-right
      ctx.beginPath();
      ctx.moveTo(boxX + width - cornerLen, y);
      ctx.lineTo(boxX + width, y);
      ctx.lineTo(boxX + width, y + cornerLen);
      ctx.stroke();

      // Bottom-left
      ctx.beginPath();
      ctx.moveTo(boxX, y + height - cornerLen);
      ctx.lineTo(boxX, y + height);
      ctx.lineTo(boxX + cornerLen, y + height);
      ctx.stroke();

      // Bottom-right
      ctx.beginPath();
      ctx.moveTo(boxX + width - cornerLen, y + height);
      ctx.lineTo(boxX + width, y + height);
      ctx.lineTo(boxX + width, y + height - cornerLen);
      ctx.stroke();

      // Label pill above box (or below if too close to top)
      if (dominant) {
        const label = `${dominant.charAt(0).toUpperCase() + dominant.slice(1)} ${Math.round(confidence * 100)}%`;
        ctx.font = '600 12px Inter, sans-serif';
        const textWidth = ctx.measureText(label).width;
        const labelH = 22;
        const pillW = textWidth + 16;
        const pillY = y > labelH + 8 ? y - labelH - 6 : y + height + 6;

        ctx.fillStyle = 'rgba(99, 102, 241, 0.9)';
        ctx.beginPath();
        ctx.roundRect(boxX, pillY, pillW, labelH, 4);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.fillText(label, boxX + 8, pillY + 15);
      }
    }
  }, []);

  const drawOverlayRef = useRef(drawOverlay);
  useEffect(() => {
    drawOverlayRef.current = drawOverlay;
  }, [drawOverlay]);

  // Run detection loop with throttling
  const startDetection = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(async () => {
      if (!detectingRef.current || !videoRef.current || videoRef.current.readyState < 2) return;

      try {
        const results = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions();

        latestDetectionsRef.current = results || [];
        setDetections(results || []);
        drawOverlayRef.current?.(results || []);
      } catch {
        // Detection can fail on occasional frames — ignore silently
      }
    }, DETECTION_INTERVAL_MS);
  }, []);

  // Immediate redraw on mirror change
  useEffect(() => {
    if (isCameraActive && latestDetectionsRef.current.length > 0) {
      drawOverlayRef.current?.(latestDetectionsRef.current);
    }
  }, [isMirrored, isCameraActive]);

  // Observe video element resize to adjust canvas overlay dimensions automatically
  useEffect(() => {
    const video = videoRef.current;
    if (!video || typeof ResizeObserver === 'undefined') return;

    const ro = new ResizeObserver(() => {
      if (detectingRef.current && latestDetectionsRef.current.length > 0) {
        drawOverlayRef.current?.(latestDetectionsRef.current);
      }
    });

    ro.observe(video);
    return () => ro.disconnect();
  }, []);

  // Capture snapshot from video
  const captureSnapshot = useCallback(() => {
    if (!videoRef.current || !isCameraActive) return null;

    const video = videoRef.current;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = video.videoWidth;
    tempCanvas.height = video.videoHeight;
    const ctx = tempCanvas.getContext('2d');

    if (isMirroredRef.current) {
      ctx.translate(tempCanvas.width, 0);
      ctx.scale(-1, 1);
    }

    // Draw video frame
    ctx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);

    return tempCanvas.toDataURL('image/png');
  }, [isCameraActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      detectingRef.current = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return {
    videoRef,
    canvasRef,
    isModelLoading,
    isModelLoaded,
    isCameraActive,
    isCameraLoading,
    isMirrored,
    toggleMirror,
    setIsMirrored,
    error,
    detections,
    startCamera,
    stopCamera,
    captureSnapshot,
    setError,
  };
}
