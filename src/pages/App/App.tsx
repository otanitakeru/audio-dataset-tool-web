import { useNavigate } from "react-router-dom";
import { Button } from "../../components/base-ui";

function App() {
  const navigate = useNavigate();
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => navigate("/button-demo")}
    >
      Go to Button Demo
    </Button>
  );
}

export default App;
