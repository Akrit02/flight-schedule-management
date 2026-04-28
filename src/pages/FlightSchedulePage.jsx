import React, { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import FlightFilters from "../components/FlightFilters";
import FlightTable from "../components/FlightTable";
import flightsData from "../data/flights.json";
import { filterFlights } from "../utils/filterFlights";

const INITIAL_FILTERS = {
  searchTerm: "",
  dateFrom: "",
  dateTo: "",
  selectedDays: [],
  selectedStatus: "",
  selectedAoc: "",
  selectedBodyType: "",
};

const FlightSchedulePage = () => {
  const [flights] = useState(() => flightsData.flights ?? []);
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const aocOptions = useMemo(
    () => Array.from(new Set(flights.map((flight) => flight.aoc))).sort(),
    [flights],
  );

  const bodyTypeOptions = useMemo(
    () => Array.from(new Set(flights.map((flight) => flight.bodyType))).sort(),
    [flights],
  );

  const filteredFlights = useMemo(
    () => filterFlights(flights, filters),
    [flights, filters],
  );

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (Array.isArray(value)) return value.length > 0;
    return value !== INITIAL_FILTERS[key];
  });

  const activeFilterCount = [
    Boolean(filters.searchTerm),
    Boolean(filters.dateFrom || filters.dateTo),
    filters.selectedDays.length > 0,
    Boolean(filters.selectedStatus),
    Boolean(filters.selectedAoc),
    Boolean(filters.selectedBodyType),
  ].filter(Boolean).length;

  const handleUpdateFilter = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearAll = () => {
    setFilters(INITIAL_FILTERS);
  };

  return (
    <Box
      component="main"
      sx={{
        py: { xs: 2, md: 4 },
        background:
          "radial-gradient(circle at top right, #dbeafe 0%, transparent 35%), linear-gradient(180deg, #eff6ff 0%, #f8fafc 45%, #f8fafc 100%)",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="xl">
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid #dbe3ef",
            boxShadow: "0 12px 28px rgba(15, 23, 42, 0.08)",
          }}
        >
          <Box sx={{ p: { xs: 2.5, md: 3.5 } }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={2}
            >
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Flight Schedule Management
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mt: 0.75, color: "text.secondary" }}
                >
                  Operations dashboard with virtualized schedule rendering.
                </Typography>
              </Box>
              <Chip
                label={`${filteredFlights.length} / ${flights.length} Flights`}
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            </Stack>
          </Box>

          <Divider />

          <Box
            sx={{ px: { xs: 2.5, md: 3.5 }, py: 3, backgroundColor: "#f8fafc" }}
          >
            <FlightFilters
              filters={filters}
              aocOptions={aocOptions}
              bodyTypeOptions={bodyTypeOptions}
              hasActiveFilters={hasActiveFilters}
              activeFilterCount={activeFilterCount}
              onUpdateFilter={handleUpdateFilter}
              onClearAll={handleClearAll}
            />
          </Box>

          <Divider />

          <FlightTable rows={filteredFlights} />
        </Paper>
      </Container>
    </Box>
  );
};

export default FlightSchedulePage;
