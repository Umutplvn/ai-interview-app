import { Box, Typography } from "@mui/material";
import React from "react";
import {
  homeWrapperStyle,
  glowEffectStyle,
  titleTextStyle,
} from "../styles/homeStyle";

const Home = () => {
  return (
    <Box sx={homeWrapperStyle}>
      <Box sx={glowEffectStyle} />
      <Typography variant="h3" sx={titleTextStyle}>
        Hello App
      </Typography>
    </Box>
  );
};

export default Home;
