import { Box, Typography } from "@mui/material";
import "./App.css";
import Products from "./components/Products";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <Box>
      <Box className="app">
        <Typography sx={{ fontSize: "40px", fontWeight: 600 }}>
          Products
        </Typography>
      </Box>
      <Outlet />
    </Box>
  );
}

export default App;
