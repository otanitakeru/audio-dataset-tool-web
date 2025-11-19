import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

// Lazy load各ページ
const EditPage = lazy(() => import("./pages/edit-page/EditPage"));

const EditRouter = () => {
  return (
    <Routes>
      {/* デフォルトルート */}
      <Route index element={<Navigate to="edit" replace />} />

      <Route path="edit" element={<EditPage />} />
    </Routes>
  );
};

export default EditRouter;
