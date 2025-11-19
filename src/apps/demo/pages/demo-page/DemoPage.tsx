import { useNavigate } from "react-router-dom";
import Button from "../../../../shared/components/base-ui/Button";

const DemoPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <Button onClick={() => navigate("/demo/button")}>Button Demo</Button>
    </>
  );
};

export default DemoPage;
