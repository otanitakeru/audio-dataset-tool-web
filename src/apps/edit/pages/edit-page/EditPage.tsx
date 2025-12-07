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
import React, { useEffect, useRef, useState } from "react";
import { mockLabels } from "../../constants/mockLabels";
import type { ActiveDialog, CursorBehavior, StopBehavior } from "../../types";
import { LabelManager } from "../../utils/LabelManager";
import type { LabelEditorRef } from "./components/LabelEditor";
import { LabelEditor } from "./components/LabelEditor";
import { SettingsDialog } from "./components/SettingsDialog";
import type { WaveformEditorRef } from "./components/WaveformEditor";
import { WaveformEditor } from "./components/WaveformEditor";

const EditPage: React.FC = () => {
  // Refs
  const waveformEditorRef = useRef<WaveformEditorRef>(null);
  const labelEditorRef = useRef<LabelEditorRef>(null);
  const labelManagerRef = useRef(new LabelManager(mockLabels));
  const currentAudioUrlRef = useRef<string | null>(null);

  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(50); // pixels per second
  const [stopBehavior, setStopBehavior] =
    useState<StopBehavior>("pause_at_current");
  const [isReady, setIsReady] = useState(false);
  const [activeDialog, setActiveDialog] = useState<ActiveDialog>(null);
  const [cursorBehavior, setCursorBehavior] =
    useState<CursorBehavior>("fixed_center");

  // ファイル読み込みハンドラー
  // オーディオファイルが選択されたときに実行される。
  // オーディオファイルをWaveformEditorに読み込む
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // 選択されたファイル（の最初のファイル）
    // ファイルが存在し、WaveformEditorのrefが有効なら読み込む
    if (file && waveformEditorRef.current) {
      const url = URL.createObjectURL(file);
      currentAudioUrlRef.current = url;
      waveformEditorRef.current.load(url);
    }
  };

  // WaveformEditorからのイベントハンドラー
  const handleWaveformReady = () => {
    // WaveformEditorが準備完了したときに呼ばれる
    setIsReady(true); // isReadyをtrueに設定
    // 必要なすべてのRefが存在するか確認
    if (
      waveformEditorRef.current &&
      labelEditorRef.current &&
      currentAudioUrlRef.current
    ) {
      const duration = waveformEditorRef.current.getDuration();
      labelEditorRef.current.load(currentAudioUrlRef.current, duration);
    }
  };

  const handleWaveformScroll = (scrollLeft: number) => {
    labelEditorRef.current?.syncScroll(scrollLeft);
  };

  const handleWaveformTimeUpdate = (time: number) => {
    labelEditorRef.current?.syncCursor(time);
  };

  // キーボードショートカットとマウスイベントの制御
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // もし設定画面などを開いていたら、音声編集を行うためのショートカットは無効化
      if (activeDialog) return;

      const editor = waveformEditorRef.current;
      if (!editor) return;

      // スペースキー: 再生/停止
      if (e.code === "Space") {
        e.preventDefault(); // スクロール防止
        // 再生/停止切り替え
        if (editor.isPlaying()) {
          editor.pause();
        } else {
          editor.play();
        }
      }

      // g: 縮小, h: 拡大
      if (e.key === "g") {
        const newZoom = Math.max(10, zoomLevel - 10);
        setZoomLevel(newZoom);
      }
      if (e.key === "h") {
        const newZoom = Math.min(1000, zoomLevel + 10);
        setZoomLevel(newZoom);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zoomLevel, activeDialog]);

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
              isPlaying
                ? waveformEditorRef.current?.pause()
                : waveformEditorRef.current?.play()
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

        <WaveformEditor
          ref={waveformEditorRef}
          zoomLevel={zoomLevel}
          stopBehavior={stopBehavior}
          cursorBehavior={cursorBehavior}
          onReady={handleWaveformReady}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onFinish={() => setIsPlaying(false)}
          onScroll={handleWaveformScroll}
          onTimeUpdate={handleWaveformTimeUpdate}
        />

        <Box sx={{ mt: 1 }}>
          <LabelEditor
            ref={labelEditorRef}
            zoomLevel={zoomLevel}
            cursorBehavior={cursorBehavior}
            labelManager={labelManagerRef.current}
          />
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
