import React from "react";
import BedroomBabyIcon from "@mui/icons-material/BedroomBaby";
import { Box, Typography } from "@mui/material";

function title({ collapsed }: any) {
  return (
    <Box display={"flex"}>
      <BedroomBabyIcon sx={{ marginRight: 2 }} />
      <Typography
        fontSize={20}
        fontWeight={700}
        display={collapsed ? "none" : "block"}
      >
        Dashboard MERN
      </Typography>
    </Box>
  );
}

export default title;
