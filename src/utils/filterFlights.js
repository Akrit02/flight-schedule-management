export function overlapsWithRange(
  flightStart,
  flightEnd,
  filterFrom,
  filterTo,
) {
  if (!filterFrom && !filterTo) return true;
  if (filterFrom && flightEnd < filterFrom) return false;
  if (filterTo && flightStart > filterTo) return false;
  return true;
}

export function filterFlights(flights, filters) {
  const {
    searchTerm,
    dateFrom,
    dateTo,
    selectedDays,
    selectedStatus,
    selectedAoc,
    selectedBodyType,
  } = filters;

  const normalizedSearch = searchTerm.trim().toLowerCase();

  return flights.filter((flight) => {
    const matchesSearch =
      !normalizedSearch ||
      flight.flightNumber.toLowerCase().includes(normalizedSearch) ||
      flight.origin.toLowerCase().includes(normalizedSearch) ||
      flight.destination.toLowerCase().includes(normalizedSearch);

    const matchesDateRange = overlapsWithRange(
      flight.startDate,
      flight.endDate,
      dateFrom,
      dateTo,
    );

    const matchesDays =
      selectedDays.length === 0 ||
      selectedDays.some((day) => flight.daysOfOperation.includes(day));

    const matchesStatus = !selectedStatus || flight.status === selectedStatus;
    const matchesAoc = !selectedAoc || flight.aoc === selectedAoc;
    const matchesBodyType =
      !selectedBodyType || flight.bodyType === selectedBodyType;

    return (
      matchesSearch &&
      matchesDateRange &&
      matchesDays &&
      matchesStatus &&
      matchesAoc &&
      matchesBodyType
    );
  });
}
