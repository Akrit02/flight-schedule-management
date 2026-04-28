import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const FlightSchedulePage = () => {
  return (
    <Box
      component="main"
      sx={{ py: 4, backgroundColor: "#f8fafc", minHeight: "100vh" }}
    >
      <Container maxWidth="lg">
        <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Flight Schedule Management
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default FlightSchedulePage;
