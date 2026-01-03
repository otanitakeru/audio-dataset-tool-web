import { useEffect } from "react";
import { ZOOM_SETTINGS } from "../constants/settings";
import type { WaveformEditorRef } from "../pages/edit-page/components/WaveformEditor";
import type { ActiveDialog } from "../types";

interface UseEditShortcutsProps {
  activeDialog: ActiveDialog;
  waveformEditorRef: React.RefObject<WaveformEditorRef | null>;
  zoomLevel: number;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  onLabelAddStart: () => void;
}

export const useEditShortcuts = ({
  activeDialog,
  waveformEditorRef,
  zoomLevel,
  setZoomLevel,
  onLabelAddStart,
}: UseEditShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // もし設定画面などを開いていたら、音声編集を行うためのショートカットは無効化
      if (activeDialog) return;

      // 音声波形エディタの準備が完了していなかったらショートカットは無効化
      const editor = waveformEditorRef.current;
      if (!editor) return;

      // Ctrl+b: 選択範囲にラベルを追加
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        onLabelAddStart();
        return;
      }

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
      if (e.key === "g" || e.key === "h") {
        const direction = e.key === "h" ? 1 : -1;
        setZoomLevel((prev) => {
          const delta = direction * ZOOM_SETTINGS.KEYBOARD_DELTA;
          const newZoom = prev * Math.exp(delta * ZOOM_SETTINGS.SENSITIVITY);
          return Math.max(
            ZOOM_SETTINGS.MIN,
            Math.min(ZOOM_SETTINGS.MAX, newZoom)
          );
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    zoomLevel,
    activeDialog,
    waveformEditorRef,
    setZoomLevel,
    onLabelAddStart,
  ]);
};
