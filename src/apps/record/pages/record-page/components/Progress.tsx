import { Box, Typography } from "@mui/material";

type ProgressProps = {
  current: number;
  total: number;
};

export const Progress = ({ current, total }: ProgressProps) => {
  return (
    <Box sx={{ textAlign: "center", mb: 1 }}>
      <Typography variant="subtitle1" color="text.secondary">
        {total > 0 ? `${current} / ${total}` : "0 / 0"}
      </Typography>
    </Box>
  );
};
