import React, { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import FlightFilters from "../components/FlightFilters";
import FlightTable from "../components/FlightTable";
import flightsData from "../data/flights.json";
import { filterFlights } from "../utils/filterFlights";
import {
  checkHasActiveFilters,
  DIALOG_TYPES,
  getActiveFilterCount,
  getDialogMeta,
  getSelectionState,
  getUniqueSortedValues,
} from "../utils/flightUiHelpers";

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
  const [flights, setFlights] = useState(() => flightsData.flights ?? []);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [selectedIds, setSelectedIds] = useState([]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editDraft, setEditDraft] = useState({
    std: "",
    sta: "",
    startDate: "",
    endDate: "",
    status: "Active",
  });
  const [savingIds, setSavingIds] = useState([]);
  const [rowErrors, setRowErrors] = useState({});
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: null,
    payload: null,
  });

  const aocOptions = useMemo(
    () => getUniqueSortedValues(flights, "aoc"),
    [flights],
  );

  const bodyTypeOptions = useMemo(
    () => getUniqueSortedValues(flights, "bodyType"),
    [flights],
  );

  const filteredFlights = useMemo(
    () => filterFlights(flights, filters),
    [flights, filters],
  );

  const hasActiveFilters = checkHasActiveFilters(filters, INITIAL_FILTERS);
  const activeFilterCount = getActiveFilterCount(filters);

  const handleUpdateFilter = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearAll = () => {
    setFilters(INITIAL_FILTERS);
  };

  const handleToggleStatus = (id, nextStatus) => {
    setFlights((prev) =>
      prev.map((flight) =>
        flight.id === id ? { ...flight, status: nextStatus } : flight,
      ),
    );
    setRowErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleDeleteRow = (id) => {
    setFlights((prev) => prev.filter((flight) => flight.id !== id));
    setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    setRowErrors((prev) => ({ ...prev, [id]: "" }));
    if (editingRowId === id) {
      setEditingRowId(null);
    }
  };

  const handleToggleSelect = (id, isChecked) => {
    setSelectedIds((prev) => {
      if (isChecked) return prev.includes(id) ? prev : [...prev, id];
      return prev.filter((selectedId) => selectedId !== id);
    });
  };

  const handleToggleSelectAll = (isChecked) => {
    const visibleIds = filteredFlights.map((flight) => flight.id);
    setSelectedIds((prev) => {
      if (isChecked) {
        return Array.from(new Set([...prev, ...visibleIds]));
      }
      return prev.filter((id) => !visibleIds.includes(id));
    });
  };

  const handleDeleteSelected = () => {
    if (!selectedIds.length) return;
    setFlights((prev) =>
      prev.filter((flight) => !selectedIds.includes(flight.id)),
    );
    setRowErrors((prev) => {
      const next = { ...prev };
      selectedIds.forEach((id) => {
        next[id] = "";
      });
      return next;
    });
    setSelectedIds([]);
  };

  const handleStartEdit = (id) => {
    const target = flights.find((flight) => flight.id === id);
    if (!target) return;

    setEditingRowId(id);
    setEditDraft({
      std: target.std,
      sta: target.sta,
      startDate: target.startDate,
      endDate: target.endDate,
      status: target.status,
    });
    setRowErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleChangeEdit = (field, value) => {
    setEditDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancelEdit = () => {
    setEditingRowId(null);
  };

  const handleSaveEdit = async (id) => {
    if (!editingRowId || editingRowId !== id) return;

    setSavingIds((prev) => [...prev, id]);
    setRowErrors((prev) => ({ ...prev, [id]: "" }));

    await new Promise((resolve) => setTimeout(resolve, 900));

    const shouldFail = Math.random() < 0.2;

    if (shouldFail) {
      setSavingIds((prev) => prev.filter((savingId) => savingId !== id));
      setRowErrors((prev) => ({
        ...prev,
        [id]: "Save failed. Reverted to previous values.",
      }));
      setEditingRowId(null);
      return;
    }

    setFlights((prev) =>
      prev.map((flight) =>
        flight.id === id
          ? {
              ...flight,
              std: editDraft.std,
              sta: editDraft.sta,
              startDate: editDraft.startDate,
              endDate: editDraft.endDate,
              status: editDraft.status,
            }
          : flight,
      ),
    );

    setSavingIds((prev) => prev.filter((savingId) => savingId !== id));
    setEditingRowId(null);
  };

  const openConfirmDialog = (type, payload) => {
    setConfirmDialog({ open: true, type, payload });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({ open: false, type: null, payload: null });
  };

  const confirmPendingAction = () => {
    if (!confirmDialog.open) return;

    if (confirmDialog.type === DIALOG_TYPES.DELETE_ROW) {
      handleDeleteRow(confirmDialog.payload.id);
    }

    if (confirmDialog.type === DIALOG_TYPES.TOGGLE_STATUS) {
      handleToggleStatus(
        confirmDialog.payload.id,
        confirmDialog.payload.nextStatus,
      );
    }

    if (confirmDialog.type === DIALOG_TYPES.DELETE_SELECTED) {
      handleDeleteSelected();
    }

    closeConfirmDialog();
  };

  const { allVisibleSelected, someVisibleSelected } = getSelectionState(
    filteredFlights,
    selectedIds,
  );
  const dialogMeta = getDialogMeta(confirmDialog);

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

          {selectedIds.length > 0 && (
            <>
              <Box
                sx={{
                  px: { xs: 2.5, md: 3.5 },
                  py: 1.5,
                  backgroundColor: "#fff7ed",
                  borderBottom: "1px solid #fed7aa",
                }}
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  alignItems="center"
                  justifyContent="center"
                  spacing={2}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "#9a3412" }}
                  >
                    {selectedIds.length} flight
                    {selectedIds.length > 1 ? "s" : ""} selected
                  </Typography>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() =>
                      openConfirmDialog(DIALOG_TYPES.DELETE_SELECTED, {
                        count: selectedIds.length,
                      })
                    }
                  >
                    Delete Selected
                  </Button>
                </Stack>
              </Box>
              <Divider />
            </>
          )}

          <FlightTable
            rows={filteredFlights}
            onRequestToggleStatus={(id, nextStatus) =>
              openConfirmDialog(DIALOG_TYPES.TOGGLE_STATUS, { id, nextStatus })
            }
            onRequestDelete={(id) =>
              openConfirmDialog(DIALOG_TYPES.DELETE_ROW, { id })
            }
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
            isRowSelected={(id) => selectedIds.includes(id)}
            allVisibleSelected={allVisibleSelected}
            someVisibleSelected={someVisibleSelected}
            editingRowId={editingRowId}
            editDraft={editDraft}
            onStartEdit={handleStartEdit}
            onChangeEdit={handleChangeEdit}
            onCancelEdit={handleCancelEdit}
            onSaveEdit={handleSaveEdit}
            isSavingRow={(id) => savingIds.includes(id)}
            getRowError={(id) => rowErrors[id]}
          />
        </Paper>
      </Container>

      <Dialog
        open={confirmDialog.open}
        onClose={closeConfirmDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2.5,
            border: "1px solid #e2e8f0",
            boxShadow: "0 18px 40px rgba(15,23,42,0.2)",
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" spacing={1.2} alignItems="center">
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor:
                  dialogMeta.tone === "error" ? "#fee2e2" : "#fef3c7",
                color: dialogMeta.tone === "error" ? "#b91c1c" : "#b45309",
              }}
            >
              <Typography sx={{ fontWeight: 800, fontSize: 18 }}>!</Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {dialogMeta.title}
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ pt: 0.5 }}>
          <DialogContentText
            sx={{ color: "#475569", fontSize: 15, lineHeight: 1.5 }}
          >
            {dialogMeta.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1 }}>
          <Button onClick={closeConfirmDialog} color="inherit">
            Keep
          </Button>
          <Button
            onClick={confirmPendingAction}
            color={dialogMeta.tone === "error" ? "error" : "warning"}
            variant="contained"
            sx={{ minWidth: 120, fontWeight: 600 }}
          >
            {dialogMeta.confirmLabel}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FlightSchedulePage;
