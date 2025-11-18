import { Route, Routes } from "react-router-dom";
import App from "./pages/app/App";
import ButtonDemo from "./pages/demo/ButtonDemo";
import TextViewer from "./pages/text-viewer/TextViewer";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/button-demo" element={<ButtonDemo />} />
      <Route path="/text-viewer" element={<TextViewer />} />
    </Routes>
  );
};

export default AppRouter;
