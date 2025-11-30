import {
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  useTheme,
} from "@mui/material";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  actionText: string;
}

const FeatureCard = ({
  title,
  description,
  icon,
  onClick,
  actionText,
}: FeatureCardProps) => {
  const theme = useTheme();
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: alpha(theme.palette.primary.main, 0.01),
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: 4,
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
          boxShadow: `0 12px 24px ${alpha(theme.palette.common.black, 0.2)}`,
          borderColor: alpha(theme.palette.primary.main, 0.3),
        },
      }}
    >
      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          p: 4,
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
            mb: 3,
          }}
        >
          {icon}
        </Box>
        <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <Box sx={{ p: 4, pt: 0 }}>
        <Button
          variant="outlined"
          onClick={onClick}
          fullWidth
          sx={{
            borderWidth: "2px",
            fontWeight: "bold",
            "&:hover": {
              borderWidth: "2px",
            },
          }}
        >
          {actionText}
        </Button>
      </Box>
    </Card>
  );
};

export default FeatureCard;
