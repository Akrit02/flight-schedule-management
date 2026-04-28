export const DIALOG_TYPES = {
  DELETE_ROW: "delete-row",
  TOGGLE_STATUS: "toggle-status",
  DELETE_SELECTED: "delete-selected",
};

export function getUniqueSortedValues(flights, key) {
  return Array.from(new Set(flights.map((flight) => flight[key]))).sort();
}

export function getActiveFilterCount(filters) {
  return [
    Boolean(filters.searchTerm),
    Boolean(filters.dateFrom || filters.dateTo),
    filters.selectedDays.length > 0,
    Boolean(filters.selectedStatus),
    Boolean(filters.selectedAoc),
    Boolean(filters.selectedBodyType),
  ].filter(Boolean).length;
}

export function checkHasActiveFilters(filters, initialFilters) {
  return Object.entries(filters).some(([key, value]) => {
    if (Array.isArray(value)) return value.length > 0;
    return value !== initialFilters[key];
  });
}

export function getSelectionState(visibleRows, selectedIds) {
  const visibleIds = visibleRows.map((row) => row.id);
  const selectedVisibleCount = visibleIds.filter((id) =>
    selectedIds.includes(id),
  ).length;

  return {
    visibleIds,
    selectedVisibleCount,
    allVisibleSelected:
      visibleIds.length > 0 && selectedVisibleCount === visibleIds.length,
    someVisibleSelected:
      selectedVisibleCount > 0 && selectedVisibleCount < visibleIds.length,
  };
}

export function getDialogMeta(dialogState) {
  if (dialogState.type === DIALOG_TYPES.TOGGLE_STATUS) {
    return {
      title: "Confirm Status Change",
      message: `Set this flight to ${dialogState.payload?.nextStatus}?`,
      confirmLabel: "Yes, Change",
      tone: "warning",
    };
  }

  if (dialogState.type === DIALOG_TYPES.DELETE_SELECTED) {
    const count = dialogState.payload?.count || 0;
    return {
      title: "Delete Selected Flights",
      message: `You are about to delete ${count} selected flight${count > 1 ? "s" : ""}. This action cannot be undone.`,
      confirmLabel: "Yes, Delete",
      tone: "error",
    };
  }

  return {
    title: "Delete Flight",
    message:
      "Are you sure you want to delete this flight? This action cannot be undone.",
    confirmLabel: "Yes, Delete",
    tone: "error",
  };
}
