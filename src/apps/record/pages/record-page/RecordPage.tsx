import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Box, Button, Container, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import type { TextSegmentLine } from "../../types/textSegment";
import { Card } from "./components/Card";
import { FileUploader } from "./components/FileUploader";
import { NavigationButton } from "./components/NavigationButton";
import { Progress } from "./components/Progress";
import { TextDisplay } from "./components/TextDisplay";

const RecordPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [textSegments, setTextSegments] = useState<TextSegmentLine[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);

  const hasData = textSegments.length > 0;

  const currentSegment = hasData ? textSegments[currentIndex] : [];
  const isFirst = currentIndex === 0;
  const isLast = !hasData || currentIndex === textSegments.length - 1;

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) =>
      prev < textSegments.length - 1 ? prev + 1 : prev
    );
  }, [textSegments.length]);

  const scrollToContent = useCallback(() => {
    // HACK: ヘッダー分スクロールして隠すため、AppLayoutのscrollTo(0,0)と競合しないように少し遅延させる
    const timer = setTimeout(() => {
      const header = document.querySelector("header");
      if (header) {
        window.scrollTo({
          top: header.clientHeight,
          behavior: "smooth",
        });
      }
    }, 100);
    return timer;
  }, []);

  const handleFileLoad = useCallback(
    (segments: TextSegmentLine[], name: string) => {
      setTextSegments(segments);
      setCurrentIndex(0);
      setFileName(name);
      scrollToContent();
    },
    [scrollToContent]
  );

  const handleReset = useCallback(() => {
    setTextSegments([]);
    setCurrentIndex(0);
    setFileName(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!hasData) return;

      if (event.key === "ArrowLeft") {
        handlePrevious();
      } else if (event.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrevious, hasData]);

  useEffect(() => {
    const timer = scrollToContent();
    return () => clearTimeout(timer);
  }, [scrollToContent]);

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
        {hasData ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            {fileName && (
              <Typography variant="body2" color="text.secondary">
                {fileName}
              </Typography>
            )}
            <Button
              variant="outlined"
              size="small"
              startIcon={<CloudUploadIcon />}
              onClick={handleReset}
              sx={{ ml: "auto" }}
            >
              別のファイルを読み込む
            </Button>
          </Box>
        ) : (
          <Box sx={{ mb: 2 }} />
        )}

        {/* Progress - centered */}
        {hasData && (
          <Progress current={currentIndex + 1} total={textSegments.length} />
        )}

        {/* Main Content Area */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            gap: 4,
            minHeight: 0,
          }}
        >
          {/* Previous Button */}
          <NavigationButton
            onClick={handlePrevious}
            disabled={isFirst || !hasData}
            direction="prev"
          />

          {/* Text Display Card */}
          {hasData ? (
            <Card>
              <TextDisplay textSegments={currentSegment} />
            </Card>
          ) : (
            <Card>
              <FileUploader onFileLoad={handleFileLoad} />
            </Card>
          )}

          {/* Next Button */}
          <NavigationButton
            onClick={handleNext}
            disabled={isLast || !hasData}
            direction="next"
          />
        </Box>

        {/* Helper Text */}
        {hasData && (
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              キーボードの矢印キー（← →）でも操作できます
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default RecordPage;
