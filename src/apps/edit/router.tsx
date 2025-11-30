import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

// Lazy load各ページ
const EditPage = lazy(() => import("./pages/edit-page/EditPage"));

const EditRouter = () => {
  return (
    <Routes>
      <Route index element={<EditPage />} />
    </Routes>
  );
};

export default EditRouter;
