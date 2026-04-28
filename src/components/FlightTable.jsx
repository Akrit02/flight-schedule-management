import React, { useEffect, useMemo, useRef, useState } from "react";
import { Grid } from "react-window";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";

const COLUMNS = [
  { key: "id", label: "ID", width: 100 },
  { key: "aoc", label: "AOC", width: 80 },
  { key: "flightNumber", label: "Flight No", width: 110 },
  { key: "origin", label: "Origin", width: 100 },
  { key: "destination", label: "Destination", width: 110 },
  { key: "std", label: "STD", width: 90 },
  { key: "sta", label: "STA", width: 90 },
  { key: "days", label: "Days", width: 250 },
  { key: "bodyType", label: "Body Type", width: 130 },
  { key: "startDate", label: "Start Date", width: 130 },
  { key: "endDate", label: "End Date", width: 130 },
  { key: "status", label: "Status", width: 100 },
];

const DAY_MAP = {
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
  7: "Sun",
};

function formatCellValue(flight, key) {
  if (key === "days") {
    return (flight.daysOfOperation ?? [])
      .map((d) => DAY_MAP[d] || d)
      .join(", ");
  }
  return flight[key];
}

function FlightCell({ columnIndex, rowIndex, style, rows }) {
  const column = COLUMNS[columnIndex];
  const flight = rows[rowIndex];
  const value = formatCellValue(flight, column.key);

  return (
    <Box
      style={style}
      sx={{
        px: 2,
        py: 1.25,
        borderBottom: "1px solid",
        borderColor: "divider",
        backgroundColor: rowIndex % 2 === 0 ? "#fff" : "#fcfdff",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {column.key === "status" ? (
        <Chip
          label={value}
          size="small"
          color={value === "Active" ? "success" : "default"}
          variant={value === "Active" ? "filled" : "outlined"}
          sx={{ fontWeight: 600 }}
        />
      ) : (
        <Typography variant="body2" noWrap sx={{ fontSize: 13.5 }}>
          {value}
        </Typography>
      )}
    </Box>
  );
}

export default function FlightTable({ rows, height = 520, rowHeight = 48 }) {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const tableMinWidth = useMemo(
    () => COLUMNS.reduce((sum, column) => sum + column.width, 0),
    [],
  );

  // Measure parent width so react-window Grid always gets correct width
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  if (!rows.length) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="body2" color="text.secondary">
          No flights available.
        </Typography>
      </Box>
    );
  }

  const gridWidth = Math.max(containerWidth, tableMinWidth);
  const gridHeight = Math.min(height, rows.length * rowHeight);

  return (
    <Box
      ref={containerRef}
      sx={{ width: "100%", overflowX: "auto", backgroundColor: "#fff" }}
    >
      <Box sx={{ minWidth: tableMinWidth }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: COLUMNS.map((c) => `${c.width}px`).join(" "),
            borderBottom: "1px solid",
            borderColor: "divider",
            backgroundColor: "#f3f6fb",
            position: "sticky",
            top: 0,
            zIndex: 2,
          }}
        >
          {COLUMNS.map((column) => (
            <Box key={column.key} sx={{ px: 2, py: 1.5 }}>
              <Typography
                variant="caption"
                sx={{ fontSize: 12, fontWeight: 700, color: "#334155" }}
              >
                {column.label}
              </Typography>
            </Box>
          ))}
        </Box>

        {gridWidth > 0 && (
          <Grid
            cellComponent={FlightCell}
            cellProps={{ rows }}
            columnCount={COLUMNS.length}
            columnWidth={(index) => COLUMNS[index].width}
            rowCount={rows.length}
            rowHeight={rowHeight}
            overscanCount={3}
            style={{ width: gridWidth, height: gridHeight }}
          />
        )}
      </Box>
    </Box>
  );
}
