import { Box, Typography } from "@mui/material";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import WaveSurfer from "wavesurfer.js";
import Minimap from "wavesurfer.js/dist/plugins/minimap.esm.js";
import Timeline from "wavesurfer.js/dist/plugins/timeline.esm.js";
import type { CursorBehavior, StopBehavior } from "../../../types";

export interface WaveformEditorRef {
  play: () => void;
  pause: () => void;
  isPlaying: () => boolean;
  load: (url: string) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  setScroll: (scrollLeft: number) => void;
}

interface WaveformEditorProps {
  zoomLevel: number;
  stopBehavior: StopBehavior;
  cursorBehavior: CursorBehavior;
  onReady: () => void;
  onPlay: () => void;
  onPause: () => void;
  onFinish: () => void;
  onScroll: (scrollLeft: number) => void;
  onTimeUpdate: (time: number) => void;
}

export const WaveformEditor = forwardRef<
  WaveformEditorRef,
  WaveformEditorProps
>(
  (
    {
      zoomLevel,
      stopBehavior,
      cursorBehavior,
      onReady,
      onPlay,
      onPause,
      onFinish,
      onScroll,
      onTimeUpdate,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const minimapRef = useRef<HTMLDivElement>(null);
    const wavesurferRef = useRef<WaveSurfer | null>(null);

    const [waveformHeight, setWaveformHeight] = useState(200);
    const [playbackStartPosition, setPlaybackStartPosition] =
      useState<number>(0);
    const [isReady, setIsReady] = useState(false);

    // 外部へのメソッド公開
    useImperativeHandle(ref, () => ({
      play: () => wavesurferRef.current?.play(),
      pause: () => handleStop(),
      isPlaying: () => wavesurferRef.current?.isPlaying() ?? false,
      load: (url: string) => {
        setIsReady(false);
        wavesurferRef.current?.load(url);
      },
      getCurrentTime: () => wavesurferRef.current?.getCurrentTime() ?? 0,
      getDuration: () => wavesurferRef.current?.getDuration() ?? 0,
      setScroll: (scrollLeft: number) => {
        if (wavesurferRef.current) {
          const wrapper = containerRef.current?.querySelector(
            ".wrapper"
          ) as HTMLElement;
          if (wrapper) {
            wrapper.scrollLeft = scrollLeft;
          }
        }
      },
    }));

    // 停止ロジック
    const handleStop = useCallback(() => {
      const ws = wavesurferRef.current;
      if (!ws) return;

      ws.pause();

      if (stopBehavior === "return_to_start") {
        ws.setTime(playbackStartPosition);
      }
    }, [playbackStartPosition, stopBehavior]);

    // WaveSurfer初期化
    useEffect(() => {
      if (!containerRef.current || !minimapRef.current) return;

      const ws = WaveSurfer.create({
        container: containerRef.current,
        waveColor: "#4a90e2",
        progressColor: "#1976d2",
        cursorColor: "#ff5722",
        barWidth: 2,
        barGap: 1,
        height: waveformHeight,
        minPxPerSec: zoomLevel,
        autoScroll: true,
        autoCenter: cursorBehavior === "fixed_center",
        normalize: true,
        plugins: [
          Minimap.create({
            height: 50,
            waveColor: "#ddd",
            progressColor: "#999",
            container: minimapRef.current,
            cursorWidth: 0,
            overlayColor: "rgba(0, 0, 0, 0.1)",
          }),
          Timeline.create({
            height: 20,
          }),
        ],
      });

      wavesurferRef.current = ws;

      ws.on("ready", () => {
        setIsReady(true);
        onReady();
      });

      ws.on("play", () => {
        setPlaybackStartPosition(ws.getCurrentTime());
        onPlay();
      });

      ws.on("pause", onPause);
      ws.on("finish", onFinish);

      ws.on("audioprocess", (time) => {
        onTimeUpdate(time);
      });

      ws.on("scroll", (start, end) => {
        // wavesurferのscrollイベントはstart/endの秒数を返す
        // 実際のスクロール位置を取得するにはDOMを見る必要がある
        const wrapper = containerRef.current?.querySelector(
          ".wrapper"
        ) as HTMLElement;
        if (wrapper) {
          onScroll(wrapper.scrollLeft);
        }
      });

      return () => {
        ws.destroy();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // オプション更新
    useEffect(() => {
      if (wavesurferRef.current) {
        wavesurferRef.current.setOptions({
          minPxPerSec: zoomLevel,
          autoCenter: cursorBehavior === "fixed_center",
          height: waveformHeight,
        });
      }
    }, [zoomLevel, cursorBehavior, waveformHeight]);

    // リサイズハンドラー
    const handleWaveformResize = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        const startY = e.clientY;
        const startHeight = waveformHeight;

        const handleMouseMove = (moveEvent: MouseEvent) => {
          const delta = moveEvent.clientY - startY;
          setWaveformHeight(Math.max(100, startHeight + delta));
        };

        const handleMouseUp = () => {
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      },
      [waveformHeight]
    );

    return (
      <Box>
        {/* ミニマップ */}
        <Box
          ref={minimapRef}
          sx={{
            width: "100%",
            mb: 1,
            border: "1px solid #e0e0e0",
            bgcolor: "#f5f5f5",
          }}
        />

        {/* メイン波形エリア */}
        <Box
          sx={{
            position: "relative",
            border: "1px solid #ccc",
            mb: 1,
          }}
        >
          <Box
            id="waveform"
            ref={containerRef}
            sx={{
              width: "100%",
              position: "relative",
            }}
          >
            {!isReady && (
              <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                <Typography>ファイルをロードしてください...</Typography>
              </Box>
            )}
          </Box>

          {/* 波形リサイズハンドル */}
          <Box
            onMouseDown={handleWaveformResize}
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "4px",
              cursor: "row-resize",
              bgcolor: "rgba(0,0,0,0.1)",
              zIndex: 20,
              "&:hover": {
                bgcolor: "primary.main",
              },
            }}
          />
        </Box>
      </Box>
    );
  }
);

WaveformEditor.displayName = "WaveformEditor";
