import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const DemoPage = lazy(() => import("./pages/demo-page/DemoPage"));

const DemoRouter = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="demo" replace />} />
      <Route path="demo" element={<DemoPage />} />
    </Routes>
  );
};

export default DemoRouter;
