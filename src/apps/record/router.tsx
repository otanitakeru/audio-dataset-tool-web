import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

const RecordPage = lazy(() => import("./pages/record-page/RecordPage"));

const RecordRouter = () => {
  return (
    <Routes>
      {/* デフォルトルート */}
      <Route index element={<RecordPage />} />

      <Route path="/*" element={<RecordPage />} />
    </Routes>
  );
};

export default RecordRouter;
