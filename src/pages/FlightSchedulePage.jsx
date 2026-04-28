import React, { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import FlightTable from "../components/FlightTable";
import flightsData from "../data/flights.json";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";

const FlightSchedulePage = () => {
  const [flights] = useState(() => flightsData.flights ?? []);

  return (
    <Box
      component="main"
      sx={{
        py: { xs: 2, md: 4 },
        background:
          "linear-gradient(180deg, rgba(239,246,255,0.7) 0%, rgba(248,250,252,0.95) 28%, #f8fafc 100%)",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="xl">
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid #e2e8f0",
            boxShadow: "0 8px 30px rgba(15, 23, 42, 0.06)",
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
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Flight Schedule Management
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mt: 0.5, color: "text.secondary" }}
                >
                  Operations dashboard with virtualized schedule rendering.
                </Typography>
              </Box>
              <Chip
                label={`${flights.length} Flights`}
                color="primary"
                variant="outlined"
              />
            </Stack>
          </Box>

          <Divider />

          <FlightTable rows={flights} />
        </Paper>
      </Container>
    </Box>
  );
};

export default FlightSchedulePage;
