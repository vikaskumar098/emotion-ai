import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale);

export default function ProDashboard() {
  const videoRef = useRef(null);

  const [emotionData, setEmotionData] = useState({
    happy: 0,
    sad: 0,
    angry: 0,
    surprised: 0,
    neutral: 0,
  });

  const emojiMap = {
    happy: "😊",
    sad: "😢",
    angry: "😠",
    surprised: "😮",
    neutral: "😐",
  };

  // 🔥 animation hook
  const useAnimatedValue = (target, duration = 400) => {
    const [value, setValue] = useState(0);

    useEffect(() => {
      let startTime = null;

      const animate = (time) => {
        if (!startTime) startTime = time;
        const progress = time - startTime;
        const percent = Math.min(progress / duration, 1);

        setValue(target * percent);

        if (percent < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    }, [target]);

    return value;
  };

  useEffect(() => {
    const start = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models/tiny_face_detector");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models/face_expression");

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;

      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play();
        detect();
      };
    };

    const detect = async () => {
      const result = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceExpressions();

      if (result) {
        const exp = result.expressions;

        setEmotionData({
          happy: exp.happy,
          sad: exp.sad,
          angry: exp.angry,
          surprised: exp.surprised,
          neutral: exp.neutral,
        });
      }

      requestAnimationFrame(detect);
    };

    start();
  }, []);

  const maxEmotion = Object.keys(emotionData).reduce((a, b) =>
    emotionData[a] > emotionData[b] ? a : b
  );

  const chartData = {
    labels: Object.keys(emotionData),
    datasets: [
      {
        label: "Emotion",
        data: Object.values(emotionData),
        backgroundColor: [
          "#22c55e",
          "#6366f1",
          "#ef4444",
          "#facc15",
          "#a855f7",
        ],
        borderRadius: 12,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        labels: { color: "#111" },
      },
    },
    scales: {
      x: { ticks: { color: "#111" } },
      y: { ticks: { color: "#111" } },
    },
  };

  return (
    <div className="animated-bg min-h-screen flex flex-col items-center justify-center px-4">

      <h1 className="text-5xl font-bold mb-10 text-center text-gray-900 drop-shadow-lg">
        ✨ Emotion Intelligence
      </h1>

      <div className="flex flex-col md:flex-row gap-12 items-center">

        {/* LEFT CARD */}
        <div className="bg-white/20 backdrop-blur-2xl p-6 rounded-3xl border border-white/30 shadow-xl hover:scale-105 transition duration-500">

          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-[360px] rounded-2xl"
          />

          <h2 className="text-4xl mt-5 text-center font-semibold text-yellow-500">
            <span className="animate-pulse">{emojiMap[maxEmotion]}</span>{" "}
            <span className="capitalize">{maxEmotion}</span>
          </h2>

          {/* 🔥 LIVE ANIMATED STATS */}
          <div className="flex justify-between mt-6 gap-3">

            {["happy", "neutral", "angry"].map((key) => {
              const animated = useAnimatedValue(emotionData[key] * 100);

              return (
                <div
                  key={key}
                  className="flex-1 p-4 rounded-xl bg-gradient-to-br from-white/60 to-white/20 backdrop-blur-lg border border-white/30 shadow-md hover:scale-105 transition duration-300"
                >
                  <p className="capitalize text-sm text-gray-700 text-center">
                    {key}
                  </p>

                  <h3 className="text-lg font-bold text-gray-900 text-center">
                    {animated.toFixed(0)}%
                  </h3>

                  {/* progress bar */}
                  <div className="mt-2 h-2 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                      style={{ width: `${animated}%` }}
                    />
                  </div>
                </div>
              );
            })}

          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="bg-white/20 backdrop-blur-2xl p-6 rounded-3xl border border-white/30 shadow-xl hover:scale-105 transition duration-500">

          <h3 className="text-xl mb-4 text-center text-gray-800">
            📊 Emotion Analytics
          </h3>

          <div className="w-[360px]">
            <Bar data={chartData} options={options} />
          </div>

        </div>

      </div>
    </div>
  );
}