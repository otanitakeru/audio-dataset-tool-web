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
}

interface LabelEditorProps {
  zoomLevel: number;
  cursorBehavior: CursorBehavior;
  labelManager: LabelManager;
}

export const LabelEditor = forwardRef<LabelEditorRef, LabelEditorProps>(
  ({ zoomLevel, cursorBehavior, labelManager }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const wavesurferRef = useRef<WaveSurfer | null>(null);
    const regionsPluginRef = useRef<RegionsPlugin | null>(null);
    const [trackHeight, setTrackHeight] = useState(50);

    // 外部へのメソッド公開
    useImperativeHandle(ref, () => ({
      syncScroll: (scrollLeft: number) => {
        if (wavesurferRef.current) {
          // WaveSurferの内部スクロール要素にアクセスして同期
          const wrapper = containerRef.current?.querySelector(
            ".wrapper"
          ) as HTMLElement;
          if (wrapper) {
            wrapper.scrollLeft = scrollLeft;
          }
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
        autoScroll: true,
        autoCenter: cursorBehavior === "fixed_center",
        interact: false, // 波形クリックでの移動を無効化（同期のため）
        plugins: [regions],
        hideScrollbar: true, // スクロールバーはメインに従うので隠す
      });

      // 音が出ないようにミュート
      ws.setVolume(0);

      wavesurferRef.current = ws;

      // リージョン初期化・更新イベント
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
          height: trackHeight,
        });
      }
    }, [zoomLevel, cursorBehavior, trackHeight]);

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
