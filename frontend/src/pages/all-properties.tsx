import React from "react";
import { CustomButton } from "../components";
import PropertyCard from "../components/common/PropertyCard";
import { useNavigate } from "react-router-dom";
import { Add, InsertEmoticon } from "@mui/icons-material";
import { useTable } from "@refinedev/core";
import { Typography, Box, Stack } from "@mui/material";
import { useMemo } from "react";
import { TextField } from "@mui/material";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";

const AllProperties = () => {
  const navigate = useNavigate();

  const {
    tableQuery: { data, isLoading, isError },
    current,
    setCurrent,
    setPageSize,
    pageCount,
    sorters,
    setSorters,
    filters,
    setFilters,
  } = useTable();

  const AllProperties = data?.data ?? [];

  const currentPrice = sorters.find((item) => item.field === "price")?.order;

  const toggleSort = (field: string) => {
    setSorters([{ field, order: currentPrice === "asc" ? "desc" : "asc" }]);
  };

  const currentFilters = useMemo(() => {
    const logical = filters.flatMap((item) => ("field" in item ? item : []));

    return {
      title: logical.find((item) => item.field === "title")?.value || "",
      propertyType:
        logical.find((item) => item.field === "propertyType")?.value || "",
    };
  }, [filters]);

  if (isLoading) return <Typography>isLoading...</Typography>;
  if (isError) return <Typography>isError...</Typography>;

  return (
    <Box>
      <Box mt={"20px"} sx={{ display: "flex", flexWrap: "Wrap", gap: 3 }}>
        <Stack direction={"column"} width={"100%"}>
          <Typography mt={1} fontSize={25} fontWeight={600} color={"#11142d"}>
            {AllProperties.length > 0 ? "All properties" : "No properties"}
          </Typography>
          <Box
            mb={2}
            mt={1}
            display={"flex"}
            width={"84%"}
            justifyContent={"space-between"}
            flexWrap={"wrap"}
          >
            <Box
              display={"flex"}
              gap={2}
              flexWrap={"wrap"}
              mb={{ xs: "20px", sm: "0px" }}
            >
              <CustomButton
                title={`Sort price ${currentPrice === "asc" ? "↑" : "↓"}`}
                handleClick={() => toggleSort("price")}
                backgroundColor="#475be8"
                color="#fcfcfc"
              ></CustomButton>
              <TextField
                variant="outlined"
                color="info"
                placeholder="Search Property"
                value={currentFilters.title}
                onChange={(e) => {
                  setFilters([
                    {
                      field: "title",
                      operator: "contains",
                      value: e.currentTarget.value
                        ? e.currentTarget.value
                        : undefined,
                    },
                  ]);
                }}
              />
              <Select
                variant="outlined"
                color="info"
                displayEmpty
                required
                inputProps={{ "aria-label": "without label" }}
                defaultValue=""
                value={currentFilters.propertyType}
                onChange={(e) => {
                  setFilters(
                    [
                      {
                        field: "propertyType",
                        operator: "eq",
                        value: e.target.value,
                      },
                    ],
                    "replace"
                  );
                }}
              >
                <MenuItem value="">All</MenuItem>
                {["apartment", "villa", "farmhouse", "condo", "studio"].map(
                  (type) => (
                    <MenuItem key={type} value={type.toLowerCase()}>
                      {type}
                    </MenuItem>
                  )
                )}
              </Select>
            </Box>
          </Box>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <CustomButton
              title="Add Property"
              handleClick={() => navigate("/properties/create")}
              backgroundColor="#475be8"
              color="#fcfcfc"
              icon={<Add />}
            />
          </Stack>
        </Stack>
        {AllProperties.map((property) => (
          <PropertyCard
            key={property._id}
            id={property._id}
            title={property.title}
            location={property.location}
            price={property.price}
            photo={property.photo}
          />
        ))}
      </Box>
      {AllProperties.length > 0 && (
        <Box display={"flex"} gap={2} mt={3} flexWrap={"wrap"}>
          <CustomButton
            title="Previous"
            handleClick={() => setCurrent((prev) => prev - 1)}
            backgroundColor="#475be8"
            color="#fcfcfc"
            disabled={!(current > 1)}
          />
          <Box
            display={{ xs: "hidden", sm: "flex" }}
            alignItems={"center"}
            gap={"5px"}
          >
            Page{" "}
            <strong>
              {current} of {pageCount}
            </strong>
          </Box>
          <CustomButton
            title="Next"
            handleClick={() => setCurrent((prev) => prev - 1)}
            backgroundColor="#475be8"
            color="#fcfcfc"
            disabled={current === pageCount}
          />

          <Select
            variant="outlined"
            color="info"
            displayEmpty
            required
            inputProps={{ "aria-label": "without label" }}
            defaultValue={10}
            onChange={(e) => {
              setPageSize(e.target.value ? Number(e.target.value) : 10);
            }}
          >
            <MenuItem value="">All</MenuItem>
            {[5, 10, 20, 30].map((size) => (
              <MenuItem key={size} value={size}>
                Show {size}
              </MenuItem>
            ))}
          </Select>
        </Box>
      )}
    </Box>
  );
};

export default AllProperties;
