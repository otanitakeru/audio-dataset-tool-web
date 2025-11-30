import { GraphicEq, Mic, PlayCircleOutline } from "@mui/icons-material";
import { Box, Container, Grid, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FeatureCard from "./components/FeatureCard";

const HomePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 10 }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 800,
              mb: 3,
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 20%, ${theme.palette.secondary.main} 60%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.02em",
            }}
          >
            Audio Dataset Tool
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto", lineHeight: 1.6 }}
          >
            音声データセットの録音、編集を効率的に行うための
            webアプリケーションです。
          </Typography>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={4} justifyContent="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <FeatureCard
              title="録音"
              description="洗練された録音インターフェースで、高品質な音声サンプルを効率的に収録できます。"
              icon={<Mic sx={{ fontSize: 32 }} />}
              onClick={() => navigate("/record")}
              actionText="録音画面へ"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FeatureCard
              title="編集"
              description="収録データの確認、テキストの修正、ファイルの整理を一元管理できます。"
              icon={<GraphicEq sx={{ fontSize: 32 }} />}
              onClick={() => navigate("/edit")}
              actionText="編集画面へ"
            />
          </Grid>
          {import.meta.env.DEV && (
            <Grid size={{ xs: 12, md: 4 }}>
              <FeatureCard
                title="デモ"
                description="UIコンポーネントの動作確認や、各機能のインタラクティブなテストが行えます。"
                icon={<PlayCircleOutline sx={{ fontSize: 32 }} />}
                onClick={() => navigate("/demo")}
                actionText="デモ画面へ"
              />
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;
