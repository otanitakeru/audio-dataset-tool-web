import { Box, GlobalStyles } from "@mui/material";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";
import type { CursorBehavior } from "../../../types";
import { LabelManager } from "../../../utils/LabelManager";

export interface LabelEditorRef {
  syncScroll: (scrollLeft: number) => void;
  syncZoom: (pxPerSec: number) => void;
  syncCursor: (time: number) => void;
  load: (url: string, duration: number) => void;
  addLabel: (start: number, end: number, name: string) => void;
  updateLabel: (id: string, name: string) => void;
  removeLabel: (id: string) => void;
}

interface LabelEditorProps {
  zoomLevel: number;
  cursorBehavior: CursorBehavior;
  labelManager: LabelManager;
  onLabelEdit: (id: string, currentName: string) => void;
}

export const LabelEditor = forwardRef<LabelEditorRef, LabelEditorProps>(
  ({ zoomLevel, labelManager, onLabelEdit }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const wavesurferRef = useRef<WaveSurfer | null>(null);
    const regionsPluginRef = useRef<RegionsPlugin | null>(null);
    const [trackHeight, setTrackHeight] = useState(50);
    const regionCleanups = useRef<Map<string, () => void>>(new Map());

    const registerRegionEvents = useCallback((region: any) => {
      if (regionCleanups.current.has(region.id)) return;

      const element = region.element;
      if (element) {
        const onMouseEnter = () => {
          region.setOptions({ color: "rgba(0, 123, 255, 0.3)" });
        };
        const onMouseLeave = () => {
          region.setOptions({ color: "rgba(0, 123, 255, 0.1)" });
        };

        element.addEventListener("mouseenter", onMouseEnter);
        element.addEventListener("mouseleave", onMouseLeave);

        regionCleanups.current.set(region.id, () => {
          element.removeEventListener("mouseenter", onMouseEnter);
          element.removeEventListener("mouseleave", onMouseLeave);
        });
      }
    }, []);

    const unregisterRegionEvents = useCallback((regionId: string) => {
      const cleanup = regionCleanups.current.get(regionId);
      if (cleanup) {
        cleanup();
        regionCleanups.current.delete(regionId);
      }
    }, []);

    // 外部へのメソッド公開
    useImperativeHandle(ref, () => ({
      syncScroll: (scrollLeft: number) => {
        if (wavesurferRef.current) {
          wavesurferRef.current.setScroll(scrollLeft);
        }
      },
      syncZoom: (pxPerSec: number) => {
        wavesurferRef.current?.zoom(pxPerSec);
      },
      syncCursor: (time: number) => {
        const ws = wavesurferRef.current;
        if (ws) {
          // カーソル位置を更新（再生はしない）
          const progress = time / ws.getDuration();
          if (!isNaN(progress) && isFinite(progress)) {
            ws.seekTo(progress);
          }
        }
      },
      load: (url: string, duration: number) => {
        const ws = wavesurferRef.current;
        if (ws) {
          // ダミーのピークデータとdurationを渡すことで、デコードをスキップして高速に初期化
          // 波形は透明なのでピークデータは適当で良い
          // peaksは Array<Float32Array | number[]> 型なので、[[0]] (ステレオチャンネルの配列の配列) として渡す必要がある
          ws.load(url, [[0]], duration);
        }
      },
      addLabel: (start: number, end: number, name: string) => {
        const id = Math.random().toString(36).substring(7);
        const newLabel = { id, start, end, name };
        labelManager.addLabel(newLabel);

        const region = regionsPluginRef.current?.addRegion({
          id: newLabel.id,
          start: newLabel.start,
          end: newLabel.end,
          content: newLabel.name,
          color: "rgba(0, 123, 255, 0.1)",
          drag: true,
          resize: true,
        });
      },
      updateLabel: (id: string, name: string) => {
        labelManager.updateLabel(id, { name });
        // リージョンのcontentも更新
        const region = regionsPluginRef.current
          ?.getRegions()
          .find((r) => r.id === id);
        if (region) {
          region.setOptions({ content: name });
        }
      },
      removeLabel: (id: string) => {
        labelManager.removeLabel(id);
        const region = regionsPluginRef.current
          ?.getRegions()
          .find((r) => r.id === id);
        if (region) {
          region.remove();
        }
      },
    }));

    // WaveSurfer初期化
    useEffect(() => {
      if (!containerRef.current) return;

      const regions = RegionsPlugin.create();
      regionsPluginRef.current = regions;

      const ws = WaveSurfer.create({
        container: containerRef.current,
        waveColor: "transparent", // 波形は見せない
        progressColor: "transparent",
        cursorColor: "#ff5722",
        barWidth: 0,
        height: trackHeight,
        minPxPerSec: zoomLevel,
        autoScroll: false, // スクロールはWaveformEditorと同期するため無効化
        autoCenter: false, // センターリングもWaveformEditorと同期するため無効化
        interact: false, // 波形クリックでの移動を無効化（同期のため）
        plugins: [regions],
        hideScrollbar: true, // スクロールバーはメインに従うので隠す
      });

      // 音が出ないようにミュート
      ws.setVolume(0);

      wavesurferRef.current = ws;

      regions.on("region-created", registerRegionEvents);

      regions.on("region-removed", (region) => {
        unregisterRegionEvents(region.id);
      });

      // リージョン初期化・更新イベント
      ws.on("decode", () => {
        // 既存のリスナーをクリーンアップ
        regionCleanups.current.forEach((cleanup) => cleanup());
        regionCleanups.current.clear();

        regions.clearRegions();
        labelManager.getLabels().forEach((label) => {
          const region = regions.addRegion({
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

      regions.on("region-clicked", (region, e) => {
        // クリックイベントの伝播を止める（WaveSurfer本体のシークを防ぐため）
        e.stopPropagation();

        // クリックで編集
        // region.content は HTMLElement または string なので、string として扱う
        const content =
          typeof region.content === "string"
            ? region.content
            : region.content?.textContent || "";
        onLabelEdit(region.id, content);
      });

      return () => {
        ws.destroy();
        regionCleanups.current.forEach((cleanup) => cleanup());
        regionCleanups.current.clear();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // オプション更新
    useEffect(() => {
      if (wavesurferRef.current) {
        wavesurferRef.current.setOptions({
          minPxPerSec: zoomLevel,
          height: trackHeight,
        });
      }
    }, [zoomLevel, trackHeight]);

    // リサイズハンドラー
    const handleResize = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        const startY = e.clientY;
        const startHeight = trackHeight;

        const handleMouseMove = (moveEvent: MouseEvent) => {
          const delta = moveEvent.clientY - startY;
          setTrackHeight(Math.max(30, startHeight + delta));
        };

        const handleMouseUp = () => {
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      },
      [trackHeight]
    );

    return (
      <Box
        sx={{
          position: "relative",
          border: "1px solid #ccc",
          bgcolor: "#f0f0f0", // ラベルトラックの背景色
        }}
      >
        <GlobalStyles
          styles={{
            ".wavesurfer-region": {
              // ラベルトラック内でのスタイル
              backgroundColor: "rgba(0, 123, 255, 0.1) !important",
              borderBottom: "1px solid #ccc",
              zIndex: 10,
              cursor: "pointer !important",
              transition: "background-color 0.2s ease",
            },
            ".wavesurfer-region:hover": {
              backgroundColor: "rgba(0, 123, 255, 0.3) !important",
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
        <Box ref={containerRef} sx={{ width: "100%" }} />

        {/* リサイズハンドル */}
        <Box
          onMouseDown={handleResize}
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
    );
  }
);

LabelEditor.displayName = "LabelEditor";
