import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import {
  Box,
  Container,
  IconButton,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import type { TextSegmentLine } from "../../types/textSegment";
import TextViewer from "./components/TextViewer";

const getTextSegments = (): TextSegmentLine[] => {
  return [
    [
      { type: "plain", text: "こんにちは" },
      { type: "ruby", data: { base: "本日", ruby: "ほんじつ" } },
      { type: "plain", text: "は" },
      { type: "ruby", data: { base: "日曜日", ruby: "にちようび" } },
      { type: "plain", text: "です。" },
    ],
    [
      { type: "plain", text: "この" },
      { type: "ruby", data: { base: "文章", ruby: "ぶんしょう" } },
      { type: "plain", text: "は" },
      { type: "ruby", data: { base: "長", ruby: "なが" } },
      { type: "plain", text: "い" },
      { type: "ruby", data: { base: "文章", ruby: "ぶんしょう" } },
      { type: "plain", text: "の" },
      { type: "ruby", data: { base: "一行目", ruby: "いちぎょうめ" } },
      { type: "plain", text: "です。" },
    ],
    [
      { type: "plain", text: "これは" },
      { type: "ruby", data: { base: "短", ruby: "みじか" } },
      { type: "plain", text: "い" },
      { type: "ruby", data: { base: "例", ruby: "れい" } },
      { type: "plain", text: "です。" },
    ],
  ];
};

const RecordPage = () => {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const textSegments = getTextSegments();

  const currentSegment = textSegments[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === textSegments.length - 1;

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) =>
      prev < textSegments.length - 1 ? prev + 1 : prev
    );
  }, [textSegments.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        handlePrevious();
      } else if (event.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrevious]);

  // マウント時にヘッダー分スクロールして隠す
  useEffect(() => {
    // AppLayoutのscrollTo(0,0)と競合しないように少し遅延させる
    const timer = setTimeout(() => {
      const header = document.querySelector("header");
      if (header) {
        window.scrollTo({
          top: header.clientHeight,
          behavior: "smooth",
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        py: 2,
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Status Header */}
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography variant="subtitle1" color="text.secondary">
            {currentIndex + 1} / {textSegments.length}
          </Typography>
        </Box>

        {/* Main Content Area */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            gap: 4,
            minHeight: 0, // フレックスアイテムの縮小を許可
          }}
        >
          {/* Previous Button */}
          <IconButton
            onClick={handlePrevious}
            disabled={isFirst}
            sx={{
              alignSelf: "center",
              width: 64,
              height: 64,
              bgcolor: "background.paper",
              boxShadow: 3,
              "&:hover": {
                bgcolor: "background.paper",
                transform: "scale(1.05)",
              },
              "&:disabled": {
                opacity: 0.5,
                boxShadow: "none",
              },
              transition: "all 0.2s",
            }}
            aria-label="previous sentence"
          >
            <NavigateBefore sx={{ fontSize: 40 }} />
          </IconButton>

          {/* Text Display Card */}
          <Paper
            elevation={4}
            sx={{
              flex: 1,
              p: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 4,
              position: "relative",
              overflow: "auto", // コンテンツが多い場合はスクロール
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "4px",
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              },
            }}
          >
            <Box
              sx={{
                typography: "h2", // サイズを大きく
                lineHeight: 2,
                textAlign: "center",
                "& rt": {
                  fontSize: "0.5em",
                  color: "text.secondary",
                },
              }}
            >
              <TextViewer textSegments={currentSegment} />
            </Box>
          </Paper>

          {/* Next Button */}
          <IconButton
            onClick={handleNext}
            disabled={isLast}
            sx={{
              alignSelf: "center",
              width: 64,
              height: 64,
              bgcolor: theme.palette.primary.main,
              color: "common.white",
              boxShadow: 4,
              "&:hover": {
                bgcolor: theme.palette.primary.dark,
                transform: "scale(1.05)",
              },
              "&:disabled": {
                bgcolor: "action.disabledBackground",
                color: "action.disabled",
                boxShadow: "none",
              },
              transition: "all 0.2s",
            }}
            aria-label="next sentence"
          >
            <NavigateNext sx={{ fontSize: 40 }} />
          </IconButton>
        </Box>

        {/* Helper Text */}
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            キーボードの矢印キー（← →）でも操作できます
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default RecordPage;
