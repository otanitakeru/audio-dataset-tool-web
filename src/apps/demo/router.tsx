import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const DemoPage = lazy(() => import("./pages/demo-page/DemoPage"));
const ButtonDemoPage = lazy(
  () => import("./pages/button-demo-page/ButtonDemoPage")
);

const DemoRouter = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="demo" replace />} />
      <Route path="demo" element={<DemoPage />} />
      <Route path="button" element={<ButtonDemoPage />} />
    </Routes>
  );
};

export default DemoRouter;
