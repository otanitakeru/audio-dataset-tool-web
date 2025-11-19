import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Button from "../../../../shared/components/base-ui/Button";

const DemoPage = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1, py: 4 }}>
      <Button onClick={() => navigate("/demo/button")}>Button Demo</Button>
    </Box>
  );
};

export default DemoPage;
