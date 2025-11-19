// src/shared/components/layout/AppLayout/AppLayout.tsx
import { Box } from "@mui/material";
import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

const AppLayout = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Header />
      <Box component="main" sx={{ py: 1, minHeight: "100vh" }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default AppLayout;
