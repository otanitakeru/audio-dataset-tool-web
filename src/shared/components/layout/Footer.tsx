import GitHubIcon from "@mui/icons-material/GitHub";
import {
  Box,
  Container,
  IconButton,
  Link,
  Stack,
  Typography,
} from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: "secondary.main",
      }}
    >
      <Container maxWidth="md">
        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          sx={{ mb: 1 }}
        >
          <IconButton
            color="inherit"
            component={Link}
            href="https://github.com/otanitakeru/audio-dataset-tool-web"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubIcon />
          </IconButton>
        </Stack>

        <Typography variant="body2" color="text.secondary" align="center">
          {"Copyright © "}
          READ App {new Date().getFullYear()}
          {"."}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
