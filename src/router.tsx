import { Route, Routes } from "react-router-dom";
import App from "./pages/App_TMP/App";
import ButtonDemo from "./pages/Demo_TMP/ButtonDemo";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/button-demo" element={<ButtonDemo />} />
    </Routes>
  );
};

export default AppRouter;
