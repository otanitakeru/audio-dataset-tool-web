import BookIcon from "@mui/icons-material/Book";
import { AppBar, Box, Icon, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Box
          sx={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
          onClick={() => {
            navigate("/");
          }}
        >
          <Icon component={BookIcon} color="inherit" fontSize="medium" />
          <Typography variant="h6">READ App</Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
