import { useEffect } from "react";
import type { WaveformEditorRef } from "../pages/edit-page/components/WaveformEditor";
import type { ActiveDialog } from "../types";

interface UseEditShortcutsProps {
  activeDialog: ActiveDialog;
  waveformEditorRef: React.RefObject<WaveformEditorRef | null>;
  zoomLevel: number;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
}

export const useEditShortcuts = ({
  activeDialog,
  waveformEditorRef,
  zoomLevel,
  setZoomLevel,
}: UseEditShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // もし設定画面などを開いていたら、音声編集を行うためのショートカットは無効化
      if (activeDialog) return;

      // 音声波形エディタの準備が完了していなかったらショートカットは無効化
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
  }, [zoomLevel, activeDialog, waveformEditorRef, setZoomLevel]);
};
