import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

const DemoPage = lazy(() => import("./pages/demo-page/DemoPage"));

const DemoRouter = () => {
  return (
    <Routes>
      <Route index element={<DemoPage />} />
    </Routes>
  );
};

export default DemoRouter;
