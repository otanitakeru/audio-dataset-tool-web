import { Paper, useTheme } from "@mui/material";
import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
};

export const Card = ({ children }: CardProps) => {
  const theme = useTheme();

  return (
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
        overflow: "auto",
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
      {children}
    </Paper>
  );
};
