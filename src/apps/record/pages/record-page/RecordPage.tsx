import { Box, Container, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { getTextSegments } from "../../data/mockData";
import { Card } from "./components/Card";
import { NavigationButton } from "./components/NavigationButton";
import { Progress } from "./components/Progress";
import { TextDisplay } from "./components/TextDisplay";

const RecordPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const textSegments = getTextSegments();
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
        <Progress current={currentIndex + 1} total={textSegments.length} />

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
          <NavigationButton
            onClick={handlePrevious}
            disabled={isFirst}
            direction="prev"
          />

          {/* Text Display Card */}
          {hasData ? (
            <Card>
              <TextDisplay textSegments={currentSegment} />
            </Card>
          ) : (
            <Card>
              <Typography
                variant="h4"
                color="text.primary"
                sx={{ textAlign: "center" }}
              >
                データをうまく読み込めませんでした。
              </Typography>
            </Card>
          )}

          {/* Next Button */}
          <NavigationButton
            onClick={handleNext}
            disabled={isLast}
            direction="next"
          />
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
