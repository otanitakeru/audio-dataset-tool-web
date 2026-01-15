import MicIcon from "@mui/icons-material/Mic";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import {
  Box,
  Fab,
  LinearProgress,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";

type RecordingState = "idle" | "recording";

export const RecordingControls = () => {
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioUrlRef = useRef<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordingTimerRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isRecordingRef = useRef(false);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Update audio level visualization
  const updateAudioLevel = useCallback(() => {
    if (!isRecordingRef.current) return;

    if (analyserRef.current) {
      const bufferLength = analyserRef.current.fftSize;
      const dataArray = new Float32Array(bufferLength);
      analyserRef.current.getFloatTimeDomainData(dataArray);

      // Calculate RMS (Root Mean Square) for more accurate level
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i] * dataArray[i];
      }
      const rms = Math.sqrt(sum / bufferLength);

      // Normalize to 0-100
      const normalizedLevel = Math.min(100, Math.max(0, rms * 200));
      setAudioLevel(normalizedLevel);
    }

    animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    isRecordingRef.current = false;

    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    analyserRef.current = null;
    setAudioLevel(0);
  }, []);

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      // Clean up previous recording
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }
      setHasRecording(false);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      // Set up audio context and analyser for level monitoring
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      // Resume audio context if suspended
      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.3;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || "audio/webm",
        });
        const url = URL.createObjectURL(audioBlob);
        audioUrlRef.current = url;
        setHasRecording(true);

        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }

        // Close audio context
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }
        analyserRef.current = null;
        setAudioLevel(0);
      };

      mediaRecorder.start(1000);

      isRecordingRef.current = true;
      setRecordingState("recording");
      setRecordingDuration(0);

      // Start timer
      recordingTimerRef.current = window.setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);

      // Start audio level monitoring
      animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
    } catch (error) {
      console.error("Failed to start recording:", error);
      alert(
        "マイクへのアクセスが許可されていません。ブラウザの設定を確認してください。"
      );
    }
  }, [updateAudioLevel]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState === "recording") {
      isRecordingRef.current = false;
      mediaRecorderRef.current.stop();
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      setRecordingState("idle");
    }
  }, [recordingState]);

  // Play recording
  const playRecording = useCallback(() => {
    if (audioUrlRef.current && audioRef.current) {
      audioRef.current.src = audioUrlRef.current;
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, []);

  // Stop playback
  const stopPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  // Handle audio ended
  const handleAudioEnded = useCallback(() => {
    setIsPlaying(false);
  }, []);

  // Handle record button click
  const handleRecordClick = useCallback(() => {
    if (recordingState === "idle") {
      startRecording();
    } else {
      stopRecording();
    }
  }, [recordingState, startRecording, stopRecording]);

  // Handle play button click
  const handlePlayClick = useCallback(() => {
    if (isPlaying) {
      stopPlayback();
    } else {
      playRecording();
    }
  }, [isPlaying, playRecording, stopPlayback]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
    };
  }, [cleanup]);

  // Get level bar color based on audio level
  const getLevelColor = (level: number) => {
    if (level > 80) return "error";
    if (level > 50) return "warning";
    return "success";
  };

  return (
    <>
      {/* Center bottom volume meter - only visible during recording */}
      {recordingState === "recording" && (
        <Paper
          elevation={4}
          sx={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            px: 3,
            py: 2,
            borderRadius: 3,
            minWidth: 320,
            maxWidth: "90vw",
            zIndex: 1200,
            bgcolor: "background.paper",
          }}
        >
          {/* Recording status */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              mb: 1.5,
            }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                bgcolor: "error.main",
                animation: "pulse 1s infinite",
                "@keyframes pulse": {
                  "0%, 100%": { opacity: 1 },
                  "50%": { opacity: 0.5 },
                },
              }}
            />
            <Typography variant="body1" fontWeight="medium">
              録音中 {formatTime(recordingDuration)}
            </Typography>
          </Box>

          {/* Audio level meter */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ minWidth: 28 }}
            >
              音量
            </Typography>
            <LinearProgress
              variant="determinate"
              value={audioLevel}
              color={getLevelColor(audioLevel)}
              sx={{
                flex: 1,
                height: 10,
                borderRadius: 5,
                bgcolor: "grey.200",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 5,
                  transition: "transform 0.05s ease",
                },
              }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ minWidth: 36, textAlign: "right" }}
            >
              {Math.round(audioLevel)}%
            </Typography>
          </Box>
        </Paper>
      )}

      {/* Right bottom controls */}
      <Box
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          display: "flex",
          gap: 2,
          alignItems: "center",
          zIndex: 1100,
        }}
      >
        {/* Play button - only show when recording exists */}
        {hasRecording && (
          <Tooltip title={isPlaying ? "停止" : "再生"} placement="top">
            <Fab
              color="primary"
              size="medium"
              onClick={handlePlayClick}
              disabled={recordingState === "recording"}
              sx={{
                width: 56,
                height: 56,
                boxShadow: 3,
                "&:hover": {
                  boxShadow: 5,
                },
              }}
            >
              {isPlaying ? (
                <StopIcon sx={{ fontSize: 28 }} />
              ) : (
                <PlayArrowIcon sx={{ fontSize: 28 }} />
              )}
            </Fab>
          </Tooltip>
        )}

        {/* Record button */}
        <Tooltip
          title={recordingState === "idle" ? "録音開始" : "録音停止"}
          placement="top"
        >
          <Fab
            color="error"
            size="large"
            onClick={handleRecordClick}
            disabled={isPlaying}
            sx={{
              width: 64,
              height: 64,
              boxShadow: 4,
              "&:hover": {
                boxShadow: 6,
              },
            }}
          >
            {recordingState === "idle" ? (
              <MicIcon sx={{ fontSize: 32 }} />
            ) : (
              <StopIcon sx={{ fontSize: 32 }} />
            )}
          </Fab>
        </Tooltip>
      </Box>

      {/* Hidden audio element for playback */}
      <audio ref={audioRef} onEnded={handleAudioEnded} />
    </>
  );
};
