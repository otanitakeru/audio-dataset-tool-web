import { Route, Routes } from "react-router-dom";
import App from "./pages/app/App";
import ButtonDemo from "./pages/demo/ButtonDemo";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/button-demo" element={<ButtonDemo />} />
    </Routes>
  );
};

export default AppRouter;
