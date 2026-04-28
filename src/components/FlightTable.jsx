import React, { useEffect, useMemo, useRef, useState } from "react";
import { Grid } from "react-window";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

const COLUMNS = [
  { key: "select", label: "", width: 54 },
  { key: "id", label: "ID", width: 90 },
  { key: "aoc", label: "AOC", width: 72 },
  { key: "flightNumber", label: "Flight No", width: 98 },
  { key: "origin", label: "Origin", width: 92 },
  { key: "destination", label: "Destination", width: 98 },
  { key: "std", label: "STD", width: 80 },
  { key: "sta", label: "STA", width: 80 },
  { key: "days", label: "Days", width: 210 },
  { key: "bodyType", label: "Body Type", width: 118 },
  { key: "startDate", label: "Start Date", width: 116 },
  { key: "endDate", label: "End Date", width: 116 },
  { key: "status", label: "Status", width: 160 },
  { key: "actions", label: "Actions", width: 180 },
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

function FlightCell({
  columnIndex,
  rowIndex,
  style,
  rows,
  onRequestToggleStatus,
  onRequestDelete,
  onToggleSelect,
  isRowSelected,
  editingRowId,
  editDraft,
  onStartEdit,
  onChangeEdit,
  onCancelEdit,
  onSaveEdit,
  isSavingRow,
  getRowError,
}) {
  const column = COLUMNS[columnIndex];
  const flight = rows[rowIndex];
  const value = formatCellValue(flight, column.key);
  const isEditing = editingRowId === flight.id;
  const rowError = getRowError(flight.id);

  return (
    <Box
      style={style}
      sx={{
        px: 1.25,
        py: 0.75,
        borderBottom: "1px solid",
        borderColor: "divider",
        backgroundColor: rowIndex % 2 === 0 ? "#fff" : "#fcfdff",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {column.key === "select" && (
        <Checkbox
          size="small"
          checked={isRowSelected(flight.id)}
          onChange={(event) => onToggleSelect(flight.id, event.target.checked)}
        />
      )}

      {column.key === "status" && (
        <>
          {isEditing ? (
            <FormControl size="small" fullWidth>
              <Select
                value={editDraft.status}
                onChange={(event) => onChangeEdit("status", event.target.value)}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          ) : (
            <Stack direction="row" spacing={1} alignItems="center">
              <Switch
                size="small"
                checked={flight.status === "Active"}
                onChange={(event) =>
                  onRequestToggleStatus(
                    flight.id,
                    event.target.checked ? "Active" : "Inactive",
                  )
                }
              />
              <Chip
                label={flight.status}
                size="small"
                color={flight.status === "Active" ? "success" : "default"}
                variant={flight.status === "Active" ? "filled" : "outlined"}
                sx={{ fontWeight: 600 }}
              />
            </Stack>
          )}
        </>
      )}

      {column.key === "actions" && (
        <Stack spacing={0.5} sx={{ width: "100%" }}>
          {isEditing ? (
            <Stack direction="row" spacing={0.75}>
              <Button
                variant="contained"
                size="small"
                onClick={() => onSaveEdit(flight.id)}
                disabled={isSavingRow(flight.id)}
                sx={{ minWidth: 64 }}
              >
                {isSavingRow(flight.id) ? (
                  <CircularProgress size={14} color="inherit" />
                ) : (
                  "Save"
                )}
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={onCancelEdit}
                disabled={isSavingRow(flight.id)}
                sx={{ minWidth: 64 }}
              >
                Cancel
              </Button>
            </Stack>
          ) : (
            <Stack direction="row" spacing={0.75}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => onStartEdit(flight.id)}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => onRequestDelete(flight.id)}
              >
                Delete
              </Button>
            </Stack>
          )}
          {rowError && !isEditing && (
            <Typography variant="caption" sx={{ color: "error.main" }}>
              {rowError}
            </Typography>
          )}
        </Stack>
      )}

      {!["select", "status", "actions"].includes(column.key) &&
        isEditing &&
        ["std", "sta", "startDate", "endDate"].includes(column.key) && (
          <TextField
            size="small"
            type={
              column.key === "std" || column.key === "sta" ? "time" : "date"
            }
            value={editDraft[column.key]}
            onChange={(event) => onChangeEdit(column.key, event.target.value)}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
        )}

      {!["select", "status", "actions"].includes(column.key) &&
        !(
          isEditing &&
          ["std", "sta", "startDate", "endDate"].includes(column.key)
        ) && (
          <Typography variant="body2" noWrap sx={{ fontSize: 13 }}>
            {value}
          </Typography>
        )}
    </Box>
  );
}

export default function FlightTable({
  rows,
  onRequestToggleStatus,
  onRequestDelete,
  onToggleSelect,
  onToggleSelectAll,
  isRowSelected,
  allVisibleSelected,
  someVisibleSelected,
  editingRowId,
  editDraft,
  onStartEdit,
  onChangeEdit,
  onCancelEdit,
  onSaveEdit,
  isSavingRow,
  getRowError,
  height = 520,
  rowHeight = 56,
}) {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const tableMinWidth = useMemo(
    () => COLUMNS.reduce((sum, column) => sum + column.width, 0),
    [],
  );

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
            <Box key={column.key} sx={{ px: 1.25, py: 0.75 }}>
              {column.key === "select" ? (
                <Checkbox
                  size="small"
                  checked={allVisibleSelected}
                  indeterminate={someVisibleSelected}
                  onChange={(event) => onToggleSelectAll(event.target.checked)}
                />
              ) : (
                <Typography
                  variant="caption"
                  sx={{ fontSize: 12, fontWeight: 700, color: "#334155" }}
                >
                  {column.label}
                </Typography>
              )}
            </Box>
          ))}
        </Box>

        {gridWidth > 0 && (
          <Grid
            cellComponent={FlightCell}
            cellProps={{
              rows,
              onRequestToggleStatus,
              onRequestDelete,
              onToggleSelect,
              isRowSelected,
              editingRowId,
              editDraft,
              onStartEdit,
              onChangeEdit,
              onCancelEdit,
              onSaveEdit,
              isSavingRow,
              getRowError,
            }}
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
