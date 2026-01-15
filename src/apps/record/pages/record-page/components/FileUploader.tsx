import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Box, Button, Typography } from "@mui/material";
import { useCallback, useRef, useState } from "react";
import { convertFileToSegments } from "../../../service/textConverter";
import type { TextSegmentLine } from "../../../types/textSegment";

interface FileUploaderProps {
  onFileLoad: (segments: TextSegmentLine[], fileName: string) => void;
}

export const FileUploader = ({ onFileLoad }: FileUploaderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const processFile = useCallback(
    async (file: File) => {
      setIsLoading(true);
      try {
        const segments = await convertFileToSegments(file);
        onFileLoad(segments, file.name);
      } catch (error) {
        console.error("ファイルの読み込みに失敗しました:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [onFileLoad]
  );

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      await processFile(file);
    },
    [processFile]
  );

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleDragEnter = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (
      dropZoneRef.current &&
      !dropZoneRef.current.contains(event.relatedTarget as Node)
    ) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    async (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);

      const file = event.dataTransfer.files?.[0];
      if (file && file.name.endsWith(".txt")) {
        await processFile(file);
      }
    },
    [processFile]
  );

  return (
    <Box
      ref={dropZoneRef}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        height: "100%",
        width: "100%",
        position: "relative",
      }}
    >
      {/* Drag overlay */}
      {isDragging && (
        <Box
          sx={{
            position: "absolute",
            top: -16,
            left: -16,
            right: -16,
            bottom: -16,
            backgroundColor: "rgba(25, 118, 210, 0.1)",
            border: "3px dashed",
            borderColor: "primary.main",
            borderRadius: 2,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <Typography
            variant="h4"
            color="primary"
            sx={{ fontWeight: "bold", textAlign: "center" }}
          >
            ファイルをドロップしてください
          </Typography>
        </Box>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".txt"
        style={{ display: "none" }}
      />

      {!isDragging && (
        <>
          <Typography
            variant="h5"
            color="text.primary"
            sx={{ textAlign: "center" }}
          >
            テキストファイルをアップロードしてください
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<CloudUploadIcon />}
            onClick={handleUploadClick}
            disabled={isLoading}
            sx={{ mt: 2 }}
          >
            {isLoading ? "読み込み中..." : "ファイルを選択"}
          </Button>
          <Typography variant="body2" color="text.secondary">
            ドラッグ＆ドロップにも対応しています
          </Typography>
        </>
      )}
    </Box>
  );
};
