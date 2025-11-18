import { useNavigate } from "react-router-dom";
import Button from "../../components/base-ui/Button";

function App() {
  const navigate = useNavigate();
  return (
    <>
      <Button onClick={() => navigate("/text-viewer")}>Text Viewer</Button>
      <Button onClick={() => navigate("/button-demo")}>Button Demo</Button>
    </>
  );
}

export default App;
