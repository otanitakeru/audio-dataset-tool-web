import { lazy } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

// Lazy load各ページ
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
