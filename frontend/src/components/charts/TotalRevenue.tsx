import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import { ArrowCircleUpRounded } from "@mui/icons-material";
import ReactApexChart from "react-apexcharts";
import { TotalRevenueOptions, TotalRevenueSeries } from "./chart.config";

function TotalRevenue() {
  return (
    <Box
      p={4}
      flex={1}
      bgcolor={"#fcfcfc"}
      display={"flex"}
      flexDirection={"column"}
      borderRadius={"15px"}
    >
      <Typography fontSize={18} fontWeight={600} color={"#11142D"}>
        Total Revenue
      </Typography>
      <Stack my={"20px"} direction={"row"} gap={4} flexWrap={"wrap"}>
        <Typography fontSize={28} fontWeight={600} color={"#11142D"}>
          $235,789
        </Typography>
        <Stack direction={"row"} alignItems={"center"} gap={1}>
          <ArrowCircleUpRounded sx={{ fontSize: 25, color: "#475be8" }} />
          <Stack>
            <Typography fontSize={15} color={"#475be8"}>
              0.08%
            </Typography>
            <Typography fontSize={14} color={"#808191"}>
              Than Last Month
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <ReactApexChart
        series={TotalRevenueSeries}
        type="bar"
        height={310}
        options={TotalRevenueOptions}
      ></ReactApexChart>
    </Box>
  );
}

export default TotalRevenue;
