import { Box, Button, Typography } from "@mui/material";

const DemoPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 2,
        gap: 2,
      }}
    >
      <Box>
        <Typography variant="h6">Button</Typography>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Button variant="contained">Button</Button>
          <Button variant="outlined">Button</Button>
          <Button variant="text">Button</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default DemoPage;
