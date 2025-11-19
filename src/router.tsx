import { Box, CircularProgress } from "@mui/material";
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import AppLayout from "./shared/components/layout/AppLayout";

const HomeRouter = lazy(() => import("./apps/home/router"));
const RecordRouter = lazy(() => import("./apps/record/router"));
const EditRouter = lazy(() => import("./apps/edit/router"));
const DemoRouter = lazy(() => import("./apps/demo/router"));

const LoadingFallback = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
  >
    <CircularProgress />
  </Box>
);

const AppRouter = () => {
  return (
    <AppLayout>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Main アプリケーション */}

          <Route index element={<HomeRouter />} />

          {/* Record アプリケーション */}
          <Route path="/record/*" element={<RecordRouter />} />

          {/* Edit アプリケーション */}
          <Route path="/edit/*" element={<EditRouter />} />

          {/* Demo アプリケーション */}
          {import.meta.env.DEV && (
            <Route path="/demo/*" element={<DemoRouter />} />
          )}
        </Routes>
      </Suspense>
    </AppLayout>
  );
};

export default AppRouter;
