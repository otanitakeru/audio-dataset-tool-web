import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="80vh"
      gap={2}
    >
      <Typography variant="h1" color="primary" sx={{ fontWeight: "bold" }}>
        404
      </Typography>
      <Typography variant="h5" color="text.primary" gutterBottom>
        ページが見つかりません
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        align="center"
        sx={{ maxWidth: 600, mb: 4 }}
      >
        お探しのページは削除されたか、URLが変更された可能性があります。
      </Typography>
      <Button variant="contained" size="large" onClick={() => navigate("/")}>
        ホームに戻る
      </Button>
    </Box>
  );
};

export default NotFoundPage;
