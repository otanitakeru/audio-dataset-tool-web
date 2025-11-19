// src/shared/components/layout/AppLayout/AppLayout.tsx
import { Box } from "@mui/material";
import type { ReactNode } from "react";

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Box component="main" sx={{ flexGrow: 1, py: 1 }}>
        {children}
      </Box>
    </Box>
  );
};

export default AppLayout;
