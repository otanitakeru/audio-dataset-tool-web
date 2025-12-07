import { Box, GlobalStyles, Typography } from "@mui/material";
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
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";
import Timeline from "wavesurfer.js/dist/plugins/timeline.esm.js";
import type { CursorBehavior, StopBehavior } from "../../../types";
import { LabelManager } from "../../../utils/LabelManager";

export interface WaveformEditorRef {
  play: () => void;
  pause: () => void;
  isPlaying: () => boolean;
  load: (url: string) => void;
  getCurrentTime: () => number;
}

interface WaveformEditorProps {
  zoomLevel: number;
  stopBehavior: StopBehavior;
  cursorBehavior: CursorBehavior;
  labelManager: LabelManager;
  onReady: () => void;
  onPlay: () => void;
  onPause: () => void;
  onFinish: () => void;
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
      labelManager,
      onReady,
      onPlay,
      onPause,
      onFinish,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const minimapRef = useRef<HTMLDivElement>(null);
    const wavesurferRef = useRef<WaveSurfer | null>(null);
    const regionsPluginRef = useRef<RegionsPlugin | null>(null);

    const [waveformHeight, setWaveformHeight] = useState(200);
    const [labelTrackHeight, setLabelTrackHeight] = useState(50);
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

      const regions = RegionsPlugin.create();
      regionsPluginRef.current = regions;

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
          regions,
        ],
      });

      wavesurferRef.current = ws;

      ws.on("ready", () => {
        setIsReady(true);
        onReady();
      });

      ws.on("decode", () => {
        regions.clearRegions();
        labelManager.getLabels().forEach((label) => {
          regions.addRegion({
            id: label.id,
            start: label.start,
            end: label.end,
            content: label.name,
            color: "rgba(0, 123, 255, 0.1)",
            drag: true,
            resize: true,
          });
        });
      });

      regions.on("region-updated", (region) => {
        labelManager.updateLabel(region.id, {
          start: region.start,
          end: region.end,
        });
      });

      ws.on("play", () => {
        setPlaybackStartPosition(ws.getCurrentTime());
        onPlay();
      });

      ws.on("pause", onPause);
      ws.on("finish", onFinish);

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

    const handleLabelTrackResize = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        const startY = e.clientY;
        const startHeight = labelTrackHeight;

        const handleMouseMove = (moveEvent: MouseEvent) => {
          const delta = moveEvent.clientY - startY;
          setLabelTrackHeight(Math.max(30, startHeight + delta));
        };

        const handleMouseUp = () => {
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      },
      [labelTrackHeight]
    );

    return (
      <Box>
        <GlobalStyles
          styles={{
            // WaveSurferの内部ラッパーに対するスタイル
            // これが重要：波形コンテナのoverflowをvisibleにする
            "#waveform > div": {
              overflow: "visible !important",
            },
            ".wavesurfer-region": {
              // 波形の高さ分だけ下にずらす
              top: `${waveformHeight}px !important`,
              height: `${labelTrackHeight}px !important`,
              backgroundColor: "rgba(0, 0, 0, 0.05) !important",
              borderBottom: "1px solid #ccc",
              zIndex: 10,
            },
            ".wavesurfer-region-handle-left": {
              cursor: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><text x="8" y="22" font-size="24" font-family="monospace" fill="black">[</text></svg>') 10 16, w-resize !important`,
              borderLeft: "2px solid #000 !important",
              width: "4px !important",
              backgroundColor: "transparent !important",
              height: "100% !important",
            },
            ".wavesurfer-region-handle-right": {
              cursor: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><text x="8" y="22" font-size="24" font-family="monospace" fill="black">]</text></svg>') 14 16, e-resize !important`,
              borderRight: "2px solid #000 !important",
              width: "4px !important",
              backgroundColor: "transparent !important",
              height: "100% !important",
            },
          }}
        />

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
            id="waveform" // CSSセレクタ用ID
            ref={containerRef}
            sx={{
              width: "100%",
              position: "relative",
              mb: `${labelTrackHeight}px`, // ラベル表示用のスペース確保
              // ここでもoverflow: visibleを指定するが、WaveSurferが内部で生成するdivにも効かせる必要がある
              overflow: "visible",
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
              top: waveformHeight,
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

          {/* ラベルトラックリサイズハンドル */}
          <Box
            onMouseDown={handleLabelTrackResize}
            sx={{
              position: "absolute",
              top: waveformHeight + labelTrackHeight,
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
