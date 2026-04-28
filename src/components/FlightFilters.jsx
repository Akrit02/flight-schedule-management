import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

const DAY_OPTIONS = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
  { value: 7, label: "Sunday" },
];

function FlightFilters({
  filters,
  aocOptions,
  bodyTypeOptions,
  hasActiveFilters,
  activeFilterCount,
  onUpdateFilter,
  onClearAll,
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2, md: 2.5 },
        borderRadius: 2.5,
        borderColor: "#dbe3ef",
        backgroundColor: "#ffffff",
        boxShadow: "0 3px 8px rgba(15,23,42,0.03)",
      }}
    >
      <Stack spacing={2.25}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1.5}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Search & Filters
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            {hasActiveFilters && (
              <Chip
                size="small"
                color="info"
                variant="outlined"
                label={`${activeFilterCount} active`}
              />
            )}
            <Button
              variant="outlined"
              size="small"
              onClick={onClearAll}
              disabled={!hasActiveFilters}
              sx={{ fontWeight: 600 }}
            >
              Clear All
            </Button>
          </Stack>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", md: "2fr 1fr 1fr" },
          }}
        >
          <TextField
            label="Search"
            placeholder="Flight no, origin, destination"
            value={filters.searchTerm}
            onChange={(event) =>
              onUpdateFilter("searchTerm", event.target.value)
            }
            size="small"
            fullWidth
          />
          <TextField
            label="From Date"
            type="date"
            value={filters.dateFrom}
            onChange={(event) => onUpdateFilter("dateFrom", event.target.value)}
            size="small"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            label="To Date"
            type="date"
            value={filters.dateTo}
            onChange={(event) => onUpdateFilter("dateTo", event.target.value)}
            size="small"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            },
          }}
        >
          <FormControl size="small" fullWidth>
            <InputLabel id="days-filter-label">Days of Operation</InputLabel>
            <Select
              labelId="days-filter-label"
              multiple
              value={filters.selectedDays}
              onChange={(event) => {
                const value = event.target.value;
                onUpdateFilter(
                  "selectedDays",
                  typeof value === "string"
                    ? value.split(",").map(Number)
                    : value,
                );
              }}
              input={<OutlinedInput label="Days of Operation" />}
              renderValue={(selected) =>
                DAY_OPTIONS.filter((option) => selected.includes(option.value))
                  .map((option) => option.label)
                  .join(", ")
              }
            >
              {DAY_OPTIONS.map((day) => (
                <MenuItem key={day.value} value={day.value}>
                  {day.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              value={filters.selectedStatus}
              label="Status"
              onChange={(event) =>
                onUpdateFilter("selectedStatus", event.target.value)
              }
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel id="aoc-filter-label">AOC</InputLabel>
            <Select
              labelId="aoc-filter-label"
              value={filters.selectedAoc}
              label="AOC"
              onChange={(event) =>
                onUpdateFilter("selectedAoc", event.target.value)
              }
            >
              <MenuItem value="">All</MenuItem>
              {aocOptions.map((aoc) => (
                <MenuItem key={aoc} value={aoc}>
                  {aoc}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel id="body-type-filter-label">Body Type</InputLabel>
            <Select
              labelId="body-type-filter-label"
              value={filters.selectedBodyType}
              label="Body Type"
              onChange={(event) =>
                onUpdateFilter("selectedBodyType", event.target.value)
              }
            >
              <MenuItem value="">All</MenuItem>
              {bodyTypeOptions.map((bodyType) => (
                <MenuItem key={bodyType} value={bodyType}>
                  {bodyType}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Stack>
    </Paper>
  );
}

export default FlightFilters;
