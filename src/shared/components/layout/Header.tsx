import ConstructionIcon from "@mui/icons-material/Construction";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <AppBar
      position="static"
      onClick={() => navigate("/")}
      sx={{ cursor: "pointer" }}
    >
      <Toolbar>
        <IconButton size="large" edge="start" color="inherit">
          <ConstructionIcon />
        </IconButton>
        <Typography variant="h6">Audio Dataset Tool</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
