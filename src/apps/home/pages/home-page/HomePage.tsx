import { useNavigate } from "react-router-dom";
import Button from "../../../../shared/components/base-ui/Button";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Button onClick={() => navigate("/record")}>Record</Button>
      <Button onClick={() => navigate("/edit")}>Edit</Button>
      <Button onClick={() => navigate("/demo")}>Demo</Button>
    </div>
  );
};

export default HomePage;
