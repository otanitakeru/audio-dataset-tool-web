import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const RecordPage = lazy(() => import("./pages/record-page/RecordPage"));

const RecordRouter = () => {
  return (
    <Routes>
      {/* デフォルトルート */}
      <Route index element={<Navigate to="record" replace />} />

      <Route path="record" element={<RecordPage />} />
    </Routes>
  );
};

export default RecordRouter;
