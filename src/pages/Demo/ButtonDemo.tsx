import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import Button from "../../components/base-ui/Button";

/**
 * ButtonDemo - ボタンコンポーネントのデモページ
 *
 * 様々なバリエーションのボタンを表示し、
 * 使用例を確認できるページ
 */
export default function ButtonDemo() {
  const [clickCount, setClickCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setClickCount((prev) => prev + 1);
  };

  const handleLoadingDemo = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
        Button Component Demo
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        theme.tsを活用したカスタムButtonコンポーネントの様々なバリエーション
      </Typography>

      <Stack spacing={4} sx={{ mt: 4 }}>
        {/* Click Counter Demo */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Interactive Demo
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleClick}>
              Click Me!
            </Button>
            <Typography>Clicked {clickCount} times</Typography>
          </Box>
        </Paper>

        {/* Variants */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Variants
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            sx={{ mt: 2 }}
            flexWrap="wrap"
            useFlexGap
          >
            <Button variant="contained">Contained</Button>
            <Button variant="outlined">Outlined</Button>
            <Button variant="text">Text</Button>
          </Stack>
        </Paper>

        {/* Colors */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Colors
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            theme.tsで定義されたカラーパレット
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <Button color="primary">Primary</Button>
            <Button color="secondary">Secondary</Button>
            <Button color="error">Error</Button>
            <Button color="warning">Warning</Button>
            <Button color="info">Info</Button>
            <Button color="success">Success</Button>
          </Stack>
        </Paper>

        {/* Sizes */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Sizes
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
            <Button size="small">Small</Button>
            <Button size="medium">Medium</Button>
            <Button size="large">Large</Button>
          </Stack>
        </Paper>

        {/* States */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            States
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            sx={{ mt: 2 }}
            flexWrap="wrap"
            useFlexGap
          >
            <Button>Normal</Button>
            <Button disabled>Disabled</Button>
            <Button
              onClick={handleLoadingDemo}
              disabled={loading}
              startIcon={
                loading ? <CircularProgress size={20} color="inherit" /> : null
              }
            >
              {loading ? "Loading..." : "Click for Loading Demo"}
            </Button>
          </Stack>
        </Paper>

        {/* Full Width */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Full Width
          </Typography>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Button fullWidth variant="contained" color="primary">
              Full Width Primary Button
            </Button>
            <Button fullWidth variant="outlined" color="secondary">
              Full Width Outlined Button
            </Button>
          </Stack>
        </Paper>

        {/* Combinations */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Combinations - Outlined Buttons
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            sx={{ mt: 2 }}
            flexWrap="wrap"
            useFlexGap
          >
            <Button variant="outlined" color="primary">
              Primary
            </Button>
            <Button variant="outlined" color="secondary">
              Secondary
            </Button>
            <Button variant="outlined" color="error">
              Error
            </Button>
            <Button variant="outlined" color="success">
              Success
            </Button>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h5" gutterBottom>
            Combinations - Text Buttons
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            sx={{ mt: 2 }}
            flexWrap="wrap"
            useFlexGap
          >
            <Button variant="text" color="primary">
              Primary
            </Button>
            <Button variant="text" color="secondary">
              Secondary
            </Button>
            <Button variant="text" color="error">
              Error
            </Button>
            <Button variant="text" color="success">
              Success
            </Button>
          </Stack>
        </Paper>

        {/* Additional Props */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Additional Props
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              sx={{
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                borderRadius: 3,
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              Custom Gradient Button
            </Button>
          </Stack>
        </Paper>

        {/* Usage Example */}
        <Paper sx={{ p: 3, bgcolor: "background.default" }}>
          <Typography variant="h5" gutterBottom>
            Usage Example
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            このコンポーネントはMaterial-UIのButtonをラップし、
            プロジェクト固有のスタイルとアニメーションを適用しています。
          </Alert>
          <Box
            component="pre"
            sx={{
              bgcolor: "background.paper",
              p: 2,
              borderRadius: 1,
              overflow: "auto",
              fontSize: "0.875rem",
            }}
          >
            {`import { Button } from "@/components/base-ui";

// 基本的な使用法
<Button variant="contained" color="primary" onClick={handleClick}>
  Click Me
</Button>

// サイズとフル幅
<Button size="large" fullWidth>
  Full Width Large Button
</Button>

// 無効化状態
<Button disabled>
  Disabled Button
</Button>`}
          </Box>
        </Paper>
      </Stack>
    </Container>
  );
}
