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
import { ZOOM_SETTINGS } from "../../../constants/settings";
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
  onZoom: (delta: number) => void;
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
      onZoom,
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

    // ホイールイベント（ズーム）の制御
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const handleWheel = (e: WheelEvent) => {
        if (e.ctrlKey) {
          e.preventDefault();
          // ズーム処理: 上スクロールで拡大、下スクロールで縮小
          // deltaYは通常100単位なので、適当な係数を掛けて調整
          const delta = -e.deltaY * ZOOM_SETTINGS.WHEEL_COEFFICIENT;
          onZoom(delta);
        }
      };

      container.addEventListener("wheel", handleWheel, { passive: false });

      return () => {
        container.removeEventListener("wheel", handleWheel);
      };
    }, [onZoom]);

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
            height: 60,
            waveColor: "#90caf9", // 薄い青（未再生部分）
            progressColor: "#1976d2", // 濃い青（再生済み部分）
            container: minimapRef.current,
            cursorWidth: 1,
            cursorColor: "#ff5722",
            overlayColor: "rgba(0, 0, 0, 0.15)", // 表示範囲を少し暗く強調
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
        // 再生中もスクロール位置を同期する
        onScroll(ws.getScroll());
      });

      ws.on("interaction", (time) => {
        onTimeUpdate(time);
      });

      ws.on("seeking", (time) => {
        onTimeUpdate(time);
      });

      ws.on("scroll", () => {
        // wavesurferのscrollイベントはstart/endの秒数を返す
        // 実際のスクロール位置を取得するにはAPIを使用する
        const scrollLeft = ws.getScroll();
        onScroll(scrollLeft);
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
            mb: 2,
            borderRadius: 1,
            overflow: "hidden",
            bgcolor: "#f5f5f5",
            boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
            "& ::part(minimap)": {
              // Shadow DOM内のスタイルが必要な場合（WaveSurferのバージョンによる）
            },
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
