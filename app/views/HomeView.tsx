"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import bin from "../../public/bin3.png";
import microphone from "../../public/mic.png";
import stopRec from "../../public/stop_rec1.png";
import $ from "jquery";

const OpusRecorder = () => {
  const [showAudioPlayer, setShowAudioPlayer] = useState(false); // To manage the visibility of the audio player
  const [audioSrc, setAudioSrc] = useState(""); // To store the audio URL

  useEffect(() => {
    // Dynamically load OpusMediaRecorder scripts
    const loadScripts = () => {
      return new Promise((resolve, reject) => {
        const opusScript = document.createElement("script");
        opusScript.src =
          "https://cdn.jsdelivr.net/npm/opus-media-recorder@latest/OpusMediaRecorder.umd.js";
        opusScript.async = true;

        const workerScript = document.createElement("script");
        workerScript.src =
          "https://cdn.jsdelivr.net/npm/opus-media-recorder@latest/encoderWorker.umd.js";
        workerScript.async = true;

        opusScript.onload = () => {
          workerScript.onload = resolve;
          workerScript.onerror = reject;
          document.body.appendChild(workerScript);
        };

        opusScript.onerror = reject;
        document.body.appendChild(opusScript);
      });
    };

    const initializeRecorder = () => {
      const workerOptions = {
        OggOpusEncoderWasmPath:
          "https://cdn.jsdelivr.net/npm/opus-media-recorder@latest/OggOpusEncoder.wasm",
        WebMOpusEncoderWasmPath:
          "https://cdn.jsdelivr.net/npm/opus-media-recorder@latest/WebMOpusEncoder.wasm",
      };

      window.MediaRecorder = window.OpusMediaRecorder;

      let recorder: MediaRecorder | null = null;

      // Start recording
      $("#startBtn").on("click", () => {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((stream) => {
            const options = { mimeType: "audio/ogg" };
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            recorder = new MediaRecorder(stream, options, workerOptions);

            recorder.start();
            console.log("Recording started");

            recorder.addEventListener("dataavailable", (event) => {
              const audioURL = URL.createObjectURL(event.data);
              setAudioSrc(audioURL); // Save the audio URL
              setShowAudioPlayer(true); // Show the audio player
            });
          })
          .catch((error) => {
            console.error("Error accessing microphone:", error);
          });
      });

      // Stop recording
      $("#stopBtn").on("click", () => {
        if (recorder) {
          recorder.stop();
          console.log("Recording stopped");
        }
      });
    };

    // Load scripts and initialize recorder
    loadScripts()
      .then(initializeRecorder)
      .catch((error) => console.error("Failed to load OpusMediaRecorder scripts:", error));
  }, []);

  const deleteAudio = () => {
    setShowAudioPlayer(false); // Hide the audio player
    setAudioSrc(""); // Clear the audio URL
  };

  return (
    <div>
      <p>Opus Recorder</p>
      <button id="startBtn">
        <Image className="audio-btn" src={microphone} alt="Start Recording" height={30} />
      </button>
      <button id="stopBtn">
        <Image className="red-btn" src={stopRec} alt="Stop Recording" height={30} />
      </button>
      {showAudioPlayer && (
          <button onClick={deleteAudio}>
            <Image className="red-btn" src={bin} alt="Delete Audio" height={30} />
          </button>
      )}
      {showAudioPlayer && (
          <audio id="player" controls src={audioSrc}></audio>
      )}
    </div>
  );
};

export default OpusRecorder;