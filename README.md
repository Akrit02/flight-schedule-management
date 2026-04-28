## Overview

This is an internal operations-style flight schedule table built with React.  
All data is loaded from local JSON and managed fully client-side (no backend/API).

## Tech Stack

- React
- Vite
- Material UI
- react-window (virtualized rendering)

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm

### Install

```bash
npm install
```

### Run (Development)

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## Features Implemented

### 1) Virtualized Table

- Large dataset is rendered using `react-window` (`Grid`) for smooth scrolling/performance.

### 2) Search

- Search by:
  - flight number
  - origin
  - destination

### 3) Filters (AND Logic)

- Date range overlap (`startDate` / `endDate` vs selected from/to)
- Days of operation (multi-select, at least one selected day must match)
- Status
- AOC
- Body type
- `Clear All` resets all active filters

### 4) Row Actions

- Inline status toggle (`Active` / `Inactive`) with confirmation
- Single row delete with confirmation
- Multi-select rows and bulk delete with confirmation

### 5) Inline Editing

- Edit mode per row
- Editable fields:
  - STD
  - STA
  - Start Date
  - End Date
  - Status
- Save/Cancel actions
- Async save simulation with row-level loading
- Simulated failure path with row-level error feedback and rollback behavior

## Project Structure

```text
src/
  components/
    FlightFilters.jsx
    FlightTable.jsx
  data/
    flights.json
  pages/
    FlightSchedulePage.jsx
  utils/
    filterFlights.js
    flightUiHelpers.js
```

## Notes / Assumptions

- All operations are intentionally local state only, per assessment constraints.
- Search is immediate (no debounce) since dataset size is small and in-memory.
- UI is optimized for operations usability with emphasis on table interaction.