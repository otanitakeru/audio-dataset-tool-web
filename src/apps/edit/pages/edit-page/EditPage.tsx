import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SettingsIcon from "@mui/icons-material/Settings";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import Minimap from "wavesurfer.js/dist/plugins/minimap.esm.js";
import Timeline from "wavesurfer.js/dist/plugins/timeline.esm.js";
import { SettingsDialog } from "./components/SettingsDialog";
import type { CursorBehavior, StopBehavior } from "./types";

const EditPage: React.FC = () => {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const minimapRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(50); // pixels per second
  const [stopBehavior, setStopBehavior] =
    useState<StopBehavior>("pause_at_current");
  const [playbackStartPosition, setPlaybackStartPosition] = useState<number>(0);
  const [isReady, setIsReady] = useState(false);
  const [activeDialog, setActiveDialog] = useState<"settings" | null>(null);
  const [cursorBehavior, setCursorBehavior] =
    useState<CursorBehavior>("fixed_center");

  // カーソル挙動の変更を反映
  useEffect(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.setOptions({
        autoCenter: cursorBehavior === "fixed_center",
      });
    }
  }, [cursorBehavior]);

  // ファイル読み込みハンドラー
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && wavesurferRef.current) {
      setIsReady(false);
      const url = URL.createObjectURL(file);
      wavesurferRef.current.load(url);
    }
  };

  // WaveSurferの初期化
  useEffect(() => {
    if (!containerRef.current || !minimapRef.current) return;

    // WaveSurferインスタンス作成
    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#4a90e2",
      progressColor: "#1976d2",
      cursorColor: "#ff5722",
      barWidth: 2,
      barGap: 1,
      height: 200,
      minPxPerSec: zoomLevel,
      autoScroll: true, // 再生バーが右端に行くと波形が移動する
      autoCenter: true, // 再生中、常にカーソルを中心に保つ（Audacityに近い挙動）
      normalize: true,
      plugins: [
        // 全体波形を表示するミニマッププラグイン
        Minimap.create({
          height: 50,
          waveColor: "#ddd",
          progressColor: "#999",
          container: minimapRef.current, // 専用のコンテナを指定
          cursorWidth: 0,
          overlayColor: "rgba(0, 0, 0, 0.1)", // 表示領域を示す窓の色
        }),
        // タイムライン（オプションだが編集には必須級）
        Timeline.create({
          height: 20,
        }),
      ],
    });

    wavesurferRef.current = ws;

    // イベントリスナー登録
    ws.on("ready", () => {
      setIsReady(true);
    });

    ws.on("play", () => {
      setIsPlaying(true);
      // 再生開始位置を記録（停止時の挙動用）
      setPlaybackStartPosition(ws.getCurrentTime());
    });

    ws.on("pause", () => {
      setIsPlaying(false);
    });

    ws.on("finish", () => {
      setIsPlaying(false);
    });

    // クリーンアップ
    return () => {
      ws.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 停止ロジックのカスタム処理
  const handleStop = useCallback(() => {
    const ws = wavesurferRef.current;
    if (!ws) return;

    ws.pause();

    // 「再生前の位置に戻る」設定の場合
    if (stopBehavior === "return_to_start") {
      ws.setTime(playbackStartPosition);
    }
  }, [playbackStartPosition, stopBehavior]);

  // キーボードショートカットとマウスイベントの制御
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeDialog) return;

      const ws = wavesurferRef.current;
      if (!ws) return;

      // スペースキー: 再生/停止
      if (e.code === "Space") {
        e.preventDefault(); // スクロール防止
        if (ws.isPlaying()) {
          handleStop();
        } else {
          ws.play();
        }
      }

      // g: 縮小, h: 拡大
      if (e.key === "g") {
        const newZoom = Math.max(10, zoomLevel - 10);
        setZoomLevel(newZoom);
        ws.zoom(newZoom);
      }
      if (e.key === "h") {
        const newZoom = Math.min(1000, zoomLevel + 10);
        setZoomLevel(newZoom);
        ws.zoom(newZoom);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zoomLevel, handleStop, activeDialog]);

  // マウスホイールイベント (Ctrl+Scrollで拡大縮小, Shift+Scrollで左右移動)
  // 注意: ReactのonWheelではなく、passive: falseオプションが必要なためDOMイベントを使用
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      const ws = wavesurferRef.current;
      if (!ws) return;

      // Ctrl + Scroll: 拡大縮小
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -10 : 10;
        const newZoom = Math.max(10, Math.min(1000, zoomLevel + delta));
        setZoomLevel(newZoom);
        ws.zoom(newZoom);
      }

      // Shift + Scroll: 左右移動
      // wavesurfer自体がoverflow:scrollなコンテナを持つため、
      // 標準のブラウザ挙動でShift+Scrollは横スクロールになることが多いが、
      // 明示的に制御する場合の実装。
      if (e.shiftKey) {
        // 横スクロールイベントはブラウザがネイティブに処理するが、
        // 必要に応じてここでws.setScrollLeftなどの微調整を行う
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [zoomLevel]);

  // 再生バークリック移動はWavesurferのデフォルト機能(interaction: true)で対応済み

  return (
    <Box sx={{ p: 4, maxWidth: "1200px", margin: "0 auto" }}>
      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        {/* コントロールエリア */}
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Button
            variant="contained"
            component="label"
            startIcon={<UploadFileIcon />}
            disabled={!!activeDialog}
          >
            オーディオをロード
            <input
              type="file"
              hidden
              accept="audio/*"
              onChange={handleFileUpload}
            />
          </Button>

          <Button
            variant="contained"
            color={isPlaying ? "warning" : "primary"}
            onClick={() =>
              isPlaying ? handleStop() : wavesurferRef.current?.play()
            }
            startIcon={isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            disabled={!isReady || !!activeDialog}
          >
            {isPlaying ? "停止 (Space)" : "再生 (Space)"}
          </Button>

          <Box sx={{ flexGrow: 1 }} />

          <IconButton
            onClick={() => setActiveDialog("settings")}
            disabled={isPlaying || !!activeDialog}
          >
            <SettingsIcon />
          </IconButton>
        </Stack>

        <Typography variant="caption" display="block" gutterBottom>
          操作: [Space] 再生/停止 | [G] 縮小 | [H] 拡大 | [Ctrl+Wheel] 拡大縮小
          | [Shift+Wheel] 横スクロール | [Click] カーソル移動
        </Typography>

        {/* 全体波形（ミニマップ） */}
        <Box
          ref={minimapRef}
          sx={{
            width: "100%",
            mb: 1,
            border: "1px solid #e0e0e0",
            bgcolor: "#f5f5f5",
          }}
        />

        {/* メイン波形 */}
        <Box
          ref={containerRef}
          sx={{
            width: "100%",
            border: "1px solid #ccc",
            position: "relative", // ローディング表示用
          }}
        >
          {!isReady && wavesurferRef.current && (
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              <Typography>ファイルをロードしてください...</Typography>
            </Box>
          )}
        </Box>
      </Paper>

      <SettingsDialog
        open={activeDialog === "settings"}
        onClose={() => setActiveDialog(null)}
        stopBehavior={stopBehavior}
        setStopBehavior={setStopBehavior}
        cursorBehavior={cursorBehavior}
        setCursorBehavior={setCursorBehavior}
      />
    </Box>
  );
};

export default EditPage;
