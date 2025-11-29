import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Chip,
  Checkbox,
  IconButton,
  MenuItem,
  Select,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  SxProps,
  Theme,
} from "@mui/material";
import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  ReactNode,
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";

import { Person } from "../Person";

type RowData = Record<string, unknown>;

// New cell context type (replaces MRT_Cell)
export type CellContext<T extends RowData> = {
  row: {
    original: T;
    index: number;
  };
  value: unknown;
  getValue: () => unknown;
};

// Column definition type
type ColumnDef<T extends RowData> = {
  id: string;
  header: string;
  accessorKey?: keyof T & string;
  accessorFn?: (row: T) => unknown;
  cell?: (context: CellContext<T>) => ReactNode;
  enableSorting?: boolean;
  enableHiding?: boolean;
  pinned?: "left" | "right";
  filterFn?: (row: T, columnId: string, filterValue: string) => boolean;
};

type CellProps<T extends RowData> = {
  type: "text" | "status" | "custom" | "person" | "boolean";
  title: string;
  value?: keyof T & string;
  colors?: Record<string, string>;
  render?: (cell: CellContext<T>) => ReactNode;
  enableHiding?: boolean;
};

export const Cell = <T extends RowData>(_: CellProps<T>) => null;

type ActionCellProps = {
  children: ReactNode;
  pinned?: "left" | "right";
};

export const ActionCell = (_: ActionCellProps) => null;
ActionCell.displayName = "ActionCell";

type ActionProps<T extends RowData = RowData> = {
  type: "view" | "edit" | "delete";
  onClick: (cell: CellContext<T>) => void;
  icon?: JSX.Element;
  id: string;
};

export const Action = <T extends RowData = RowData>({
  type,
  onClick,
  id,
  icon = undefined,
}: ActionProps<T>) => {
  const icons: Record<ActionProps["type"], JSX.Element> = {
    view: <ArrowForwardIcon fontSize="small" />,
    edit: <EditIcon fontSize="small" />,
    delete: <DeleteIcon fontSize="small" />,
  };

  // This component is just a marker - the actual rendering is handled by ActionCell
  // But we need to provide a way for it to work standalone if needed
  return (
    <Tooltip title={type} arrow>
      <IconButton
        id={id}
        size="small"
        onClick={(event) => {
          event.stopPropagation();
          // If onClick is called directly (not through ActionCell), create minimal context
          // This should rarely happen as ActionCell handles the onClick
          onClick({
            row: { original: {} as T, index: 0 },
            value: undefined,
            getValue: () => undefined,
          });
        }}
        sx={{
          color: "#32363A",
          "&:hover": {
            backgroundColor: "#E6F2FF",
            color: "#0070F2",
          },
        }}
      >
        {icon ? icon : icons[type]}
      </IconButton>
    </Tooltip>
  );
};

type TableProps<T extends RowData> = {
  children?: ReactNode;
  data: T[];
  globalFilter?: boolean;
  filters?: {
    type: "text" | "select";
    title: string;
    value: string;
    placeholder?: string;
  }[];
  enableRowSelection?: boolean | ((row: T) => boolean);
  getRowId?: (row: T, index?: number) => string;
  state?: {
    rowSelection?: Record<string, boolean>;
    pagination?: { pageIndex: number; pageSize: number };
  };
  onRowSelectionChange?: (
    updaterOrValue:
      | Record<string, boolean>
      | ((prev: Record<string, boolean>) => Record<string, boolean>),
  ) => void;
  initialState?: {
    columnPinning?: {
      left?: string[];
      right?: string[];
    };
    pagination?: {
      pageIndex?: number;
      pageSize?: number;
    };
  };
  sx?: SxProps<Theme>;
};

export const Table = <T extends RowData>({
  children,
  data = [],
  globalFilter = false,
  filters = [],
  enableRowSelection = false,
  getRowId,
  state,
  onRowSelectionChange,
  initialState,
  sx,
}: TableProps<T>) => {
  // Ensure data is always an array
  const dataArray = Array.isArray(data) ? data : [];
  
  // Determine if row selection is enabled and get the function
  const isRowSelectionEnabled =
    typeof enableRowSelection === "boolean"
      ? enableRowSelection
      : enableRowSelection !== undefined;
  const enableRowSelectionFn =
    typeof enableRowSelection === "function" ? enableRowSelection : undefined;
  const [sortConfig, setSortConfig] = useState<{
    column: string | null;
    direction: "asc" | "desc";
  }>({ column: null, direction: "asc" });

  const [page, setPage] = useState(
    initialState?.pagination?.pageIndex ?? state?.pagination?.pageIndex ?? 0,
  );
  const [rowsPerPage, setRowsPerPage] = useState(
    initialState?.pagination?.pageSize ?? state?.pagination?.pageSize ?? 10,
  );

  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [columnFilters, setColumnFilters] = useState<
    Record<string, string>
  >({});

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>(
    state?.rowSelection ?? {},
  );

  // Sync row selection when state prop changes
  useEffect(() => {
    if (state?.rowSelection) {
      setRowSelection(state.rowSelection);
    }
  }, [state?.rowSelection]);

  const [hiddenColumns] = useState<Set<string>>(new Set());

  // Build columns from children
  const columns = useMemo(() => {
    const cols: ColumnDef<T>[] = [];
    const pinnedLeft: string[] = initialState?.columnPinning?.left ?? [];
    const pinnedRight: string[] = initialState?.columnPinning?.right ?? [];

    const universalSelectFilter = (row: T, columnId: string, filterValue: string) => {
      if (!filterValue) return true;
      const rowValue = String(
        (row[columnId as keyof T] ?? "") as string,
      ).toLowerCase();
      const value = filterValue.toLowerCase();
      return rowValue === value;
    };

    Children.forEach(children, (child) => {
      if (!isValidElement(child)) return;
      const element = child as React.ReactElement;

      if (element.type === Cell) {
        const { type, title, value, colors, render, enableHiding } =
          element.props as CellProps<T>;

        if (!value) return;

        const columnId = value;

        // TEXT COLUMN
        if (type === "text") {
          cols.push({
            id: columnId,
            header: title,
            accessorKey: value,
            enableHiding: enableHiding ?? true,
            enableSorting: true,
            pinned: pinnedLeft.includes(columnId)
              ? "left"
              : pinnedRight.includes(columnId)
                ? "right"
                : undefined,
          });
        }
        // STATUS COLUMN
        else if (type === "status") {
          cols.push({
            id: columnId,
            header: title,
            accessorKey: value,
            enableHiding: enableHiding ?? true,
            enableSorting: true,
            filterFn: universalSelectFilter,
            pinned: pinnedLeft.includes(columnId)
              ? "left"
              : pinnedRight.includes(columnId)
                ? "right"
                : undefined,
            cell: (context) => {
              const cellValue = context.getValue() as string;
              const bgColor =
                colors?.[cellValue?.toLowerCase()] || "#6A6D70";
              return (
                <Chip
                  label={cellValue}
                  size="small"
                  sx={{
                    backgroundColor: bgColor,
                    color: "#FFFFFF",
                    fontSize: "0.75rem",
                    height: 24,
                    fontWeight: 500,
                    borderRadius: "4px",
                    border: "none",
                  }}
                />
              );
            },
          });
        }
        // PERSON COLUMN
        else if (type === "person") {
          cols.push({
            id: columnId,
            header: title,
            accessorKey: value,
            enableHiding: enableHiding ?? true,
            enableSorting: true,
            pinned: pinnedLeft.includes(columnId)
              ? "left"
              : pinnedRight.includes(columnId)
                ? "right"
                : undefined,
            cell: (context) => (
              <Person name={context.getValue() as string} />
            ),
          });
        }
        // BOOLEAN COLUMN
        else if (type === "boolean") {
          cols.push({
            id: columnId,
            header: title,
            accessorKey: value,
            enableHiding: enableHiding ?? true,
            enableSorting: true,
            filterFn: universalSelectFilter,
            pinned: pinnedLeft.includes(columnId)
              ? "left"
              : pinnedRight.includes(columnId)
                ? "right"
                : undefined,
            cell: (context) => {
              const boolValue = context.getValue() as boolean;
              return (
                <Chip
                  label={boolValue ? "Yes" : "No"}
                  size="small"
                  sx={{
                    backgroundColor: boolValue ? "#107E3E" : "#E9730C",
                    color: "#FFFFFF",
                    fontSize: "0.75rem",
                    height: 24,
                    fontWeight: 500,
                    borderRadius: "4px",
                    border: "none",
                  }}
                />
              );
            },
          });
        }
        // CUSTOM COLUMN
        else if (type === "custom" && render) {
          cols.push({
            id: columnId || `custom-${cols.length}`,
            header: title,
            accessorFn: value ? (row: T) => row[value as keyof T] : undefined,
            enableHiding: enableHiding ?? true,
            enableSorting: true,
            filterFn: universalSelectFilter,
            pinned: value && pinnedLeft.includes(columnId)
              ? "left"
              : value && pinnedRight.includes(columnId)
                ? "right"
                : undefined,
            cell: (context) => <Box>{render(context)}</Box>,
          });
        }
      }
      // ACTION CELL
      else if (element.type === ActionCell) {
        const { children: actionChildren, pinned } =
          element.props as ActionCellProps;

        const actionColumnId = "actions";
        cols.push({
          id: actionColumnId,
          header: "Actions",
          accessorKey: "actions" as keyof T & string,
          enableSorting: false,
          pinned: pinned || (pinnedRight.includes(actionColumnId) ? "right" : undefined),
          cell: (context) => (
            <Box display="flex" gap={1}>
              {typeof actionChildren === "function"
                ? (actionChildren as (context: CellContext<T>) => ReactNode)(context)
                : Children.map(actionChildren, (actionChild, index) => {
                    if (!isValidElement(actionChild)) return null;
                    
                    const originalOnClick = (actionChild as any).props?.onClick;
                    if (!originalOnClick) {
                      return <Fragment key={index}>{actionChild}</Fragment>;
                    }

                    return (
                      <Fragment key={index}>
                        {cloneElement(actionChild as any, {
                          onClick: (event?: any) => {
                            if (event) {
                              event.stopPropagation?.();
                            }
                            originalOnClick(context);
                          },
                        })}
                      </Fragment>
                    );
                  })}
            </Box>
          ),
        });
      }
    });

    return cols;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children, initialState?.columnPinning]);

  // Get cell value helper
  const getCellValue = useCallback(
    (row: T, column: ColumnDef<T>): unknown => {
      if (column.accessorFn) {
        return column.accessorFn(row);
      }
      if (column.accessorKey) {
        return row[column.accessorKey];
      }
      return undefined;
    },
    [],
  );

  // Filter data
  const filteredData = useMemo(() => {
    let result = [...dataArray];

    // Global filter
    if (globalFilterValue) {
      const searchLower = globalFilterValue.toLowerCase();
      result = result.filter((row) => {
        return columns.some((col) => {
          const value = getCellValue(row, col);
          return String(value ?? "").toLowerCase().includes(searchLower);
        });
      });
    }

    // Column filters
    Object.entries(columnFilters).forEach(([columnId, filterValue]) => {
      if (!filterValue) return;
      const column = columns.find((col) => col.id === columnId);
      if (column?.filterFn) {
        result = result.filter((row) =>
          column.filterFn!(row, columnId, filterValue),
        );
      } else if (column) {
        const searchLower = filterValue.toLowerCase();
        result = result.filter((row) => {
          const value = getCellValue(row, column);
          return String(value ?? "").toLowerCase().includes(searchLower);
        });
      }
    });

    return result;
  }, [dataArray, globalFilterValue, columnFilters, columns, getCellValue]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.column) return filteredData;

    const column = columns.find((col) => col.id === sortConfig.column);
    if (!column || !column.enableSorting) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = getCellValue(a, column);
      const bValue = getCellValue(b, column);

      if (aValue === bValue) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      const comparison =
        String(aValue).toLowerCase() > String(bValue).toLowerCase() ? 1 : -1;
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [filteredData, sortConfig, columns, getCellValue]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  // Handle sort
  const handleSort = (columnId: string) => {
    setSortConfig((prev) => {
      if (prev.column === columnId) {
        return {
          column: columnId,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { column: columnId, direction: "asc" };
    });
  };

  // Handle row selection
  const handleRowSelection = useCallback(
    (rowId: string, checked: boolean) => {
      const newSelection = { ...rowSelection, [rowId]: checked };
      if (!checked) {
        delete newSelection[rowId];
      }
      setRowSelection(newSelection);
      onRowSelectionChange?.(newSelection);
    },
    [rowSelection, onRowSelectionChange],
  );

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      const newSelection: Record<string, boolean> = {};
      if (checked) {
        paginatedData.forEach((row, index) => {
          const rowId = String((row as any).id ?? index);
          if (!enableRowSelectionFn || enableRowSelectionFn(row)) {
            newSelection[rowId] = true;
          }
        });
      }
      setRowSelection(newSelection);
      onRowSelectionChange?.(newSelection);
    },
    [paginatedData, enableRowSelectionFn, onRowSelectionChange],
  );

  // Get row ID
  const getRowIdInternal = useCallback(
    (row: T, index: number): string => {
      if (getRowId) {
        return getRowId(row, index);
      }
      return String((row as any).id ?? (row as any).ID ?? index);
    },
    [getRowId],
  );

  // Visible columns
  const visibleColumns = useMemo(() => {
    return columns.filter((col) => !hiddenColumns.has(col.id));
  }, [columns, hiddenColumns]);

  // Early return if no columns
  if (columns.length === 0) {
    return (
      <Box sx={{ ...sx }}>
        <Box
          sx={{
            backgroundColor: "#FFFFFF",
            borderRadius: "8px",
            border: "1px solid #D9D9D9",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.08)",
            padding: "40px",
            textAlign: "center",
            color: "#6A6D70",
          }}
        >
          No columns defined
        </Box>
      </Box>
    );
  }

  // Refs for measuring column widths
  const columnWidthsRef = useRef<Record<string, number>>({});
  const headerRefs = useRef<Record<string, HTMLTableCellElement | null>>({});

  // Calculate sticky positions for pinned columns
  const getStickyPosition = useCallback(
    (column: ColumnDef<T>, index: number): number | undefined => {
      if (!column.pinned) return undefined;

      let position = 0;
      for (let i = 0; i < index; i++) {
        const prevCol = visibleColumns[i];
        if (prevCol.pinned === column.pinned) {
          // Use measured width or fallback to estimate
          const width = columnWidthsRef.current[prevCol.id] || 150;
          position += width;
        }
      }

      if (column.pinned === "left" && isRowSelectionEnabled) {
        position += 50; // Checkbox column width
      }

      return position;
    },
    [visibleColumns, isRowSelectionEnabled],
  );

  // Measure column widths after render
  useEffect(() => {
    Object.entries(headerRefs.current).forEach(([id, element]) => {
      if (element) {
        columnWidthsRef.current[id] = element.offsetWidth;
      }
    });
  }, [visibleColumns, paginatedData.length]);

  return (
    <Box sx={{ ...sx }}>
      {/* Filters */}
      {(globalFilter || filters.length > 0) && (
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            mb: 2,
            padding: 2,
            backgroundColor: "#FFFFFF",
            borderRadius: "8px",
            border: "1px solid #D9D9D9",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.08)",
          }}
        >
          {/* GLOBAL SEARCH */}
          {globalFilter && (
            <TextField
              placeholder="Search all columns..."
              size="small"
              variant="outlined"
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: "#6A6D70" }} />,
                endAdornment: globalFilterValue ? (
                  <IconButton
                    size="small"
                    onClick={() => setGlobalFilterValue("")}
                    sx={{
                      color: "#6A6D70",
                      "&:hover": {
                        backgroundColor: "#E6F2FF",
                        color: "#0070F2",
                      },
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                ) : null,
              }}
              value={globalFilterValue}
              onChange={(e) => setGlobalFilterValue(e.target.value)}
              sx={{
                flex: 1,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#FFFFFF",
                  borderRadius: "4px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#D9D9D9",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#0070F2",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#0070F2",
                    borderWidth: "2px",
                  },
                },
              }}
            />
          )}

          {/* SELECT / TEXT FILTERS */}
          {filters.map((filter, index) => {
            const { type, title, value, placeholder } = filter;

            // TEXT FILTER
            if (type === "text") {
              return (
                <TextField
                  key={index}
                  placeholder={placeholder || ""}
                  size="small"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <SearchIcon sx={{ mr: 1, color: "#6A6D70" }} />
                    ),
                  }}
                  value={columnFilters[value] ?? ""}
                  onChange={(e) =>
                    setColumnFilters((prev) => ({
                      ...prev,
                      [value]: e.target.value,
                    }))
                  }
                  sx={{
                    flex: 1,
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#FFFFFF",
                      borderRadius: "4px",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#D9D9D9",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#0070F2",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#0070F2",
                        borderWidth: "2px",
                      },
                    },
                  }}
                />
              );
            }
            if (type === "select") {
              const options = Array.from(
                new Set(
                  dataArray.map((row) =>
                    String(row[value as keyof T] ?? "").trim(),
                  ),
                ),
              ).filter(Boolean);

              return (
                <Select
                  key={index}
                  size="small"
                  value={columnFilters[value] || "all"}
                  onChange={(e) =>
                    setColumnFilters((prev) => ({
                      ...prev,
                      [value]:
                        e.target.value !== "all"
                          ? e.target.value.toString()
                          : "",
                    }))
                  }
                  sx={{
                    minWidth: 160,
                    borderRadius: "4px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#D9D9D9",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#0070F2",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#0070F2",
                    },
                    "& .MuiSelect-select": {
                      fontSize: "0.875rem",
                      color: "#32363A",
                      padding: "8px 14px",
                    },
                  }}
                >
                  <MenuItem
                    value="all"
                    sx={{
                      fontSize: "0.875rem",
                      "&:hover": {
                        backgroundColor: "#F5F6FA",
                      },
                    }}
                  >
                    {title}
                  </MenuItem>
                  {options.map((o, i) => (
                    <MenuItem
                      key={i}
                      value={o}
                      sx={{
                        fontSize: "0.875rem",
                        "&:hover": {
                          backgroundColor: "#F5F6FA",
                        },
                      }}
                    >
                      {o}
                    </MenuItem>
                  ))}
                </Select>
              );
            }
            return null;
          })}
        </Box>
      )}

      {/* Table */}
      <Box
        sx={{
          backgroundColor: "#FFFFFF",
          borderRadius: "8px",
          border: "1px solid #D9D9D9",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.08)",
          overflow: "hidden",
        }}
      >
        <TableContainer
          sx={{
            maxHeight: "calc(100vh - 490px)",
            "&::-webkit-scrollbar": {
              width: "8px",
              height: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#D9D9D9",
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: "#BFBFBF",
              },
            },
          }}
        >
          <MuiTable
            stickyHeader
            sx={{
              borderCollapse: "separate",
              borderSpacing: 0,
            }}
          >
            <TableHead>
              <TableRow>
                {isRowSelectionEnabled && (
                  <TableCell
                    sx={{
                      backgroundColor: "#F5F6FA",
                      borderBottom: "1px solid #D9D9D9",
                      padding: "12px 16px",
                      position: "sticky",
                      left: 0,
                      zIndex: 3,
                      minWidth: 50,
                      width: 50,
                    }}
                  >
                    <Checkbox
                      indeterminate={
                        Object.keys(rowSelection).length > 0 &&
                        Object.keys(rowSelection).length <
                          paginatedData.filter(
                            (row) =>
                              !enableRowSelectionFn || enableRowSelectionFn(row),
                          ).length
                      }
                      checked={
                        paginatedData.length > 0 &&
                        paginatedData
                          .filter(
                            (row) =>
                              !enableRowSelectionFn || enableRowSelectionFn(row),
                          )
                          .every((row, idx) => {
                            const actualIndex = page * rowsPerPage + idx;
                            const rowId = getRowIdInternal(row, actualIndex);
                            return rowSelection[rowId];
                          })
                      }
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      sx={{
                        color: "#32363A",
                        "&.Mui-checked": {
                          color: "#0070F2",
                        },
                      }}
                    />
                  </TableCell>
                )}
                {visibleColumns.map((column, index) => {
                  const stickyPos = getStickyPosition(column, index);
                  return (
                    <TableCell
                      key={column.id}
                      ref={(el: HTMLTableCellElement | null) => {
                        headerRefs.current[column.id] = el;
                      }}
                      sx={{
                        backgroundColor: "#F5F6FA",
                        borderBottom: "1px solid #D9D9D9",
                        padding: "12px 16px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#32363A",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        ...(column.pinned && stickyPos !== undefined
                          ? {
                              position: "sticky",
                              [column.pinned]: stickyPos,
                              zIndex: 2,
                              backgroundColor: "#F5F6FA",
                              borderRight:
                                column.pinned === "left"
                                  ? "1px solid #D9D9D9"
                                  : undefined,
                              borderLeft:
                                column.pinned === "right"
                                  ? "1px solid #D9D9D9"
                                  : undefined,
                            }
                          : {}),
                      }}
                    >
                      {column.enableSorting ? (
                        <TableSortLabel
                          active={sortConfig.column === column.id}
                          direction={
                            sortConfig.column === column.id
                              ? sortConfig.direction
                              : "asc"
                          }
                          onClick={() => handleSort(column.id)}
                          sx={{
                            color: "#32363A",
                            "&:hover": {
                              color: "#0070F2",
                              backgroundColor: "transparent",
                            },
                            "&.Mui-active": {
                              color: "#0070F2",
                              "& .MuiTableSortLabel-icon": {
                                color: "#0070F2",
                              },
                            },
                          }}
                        >
                          {column.header}
                        </TableSortLabel>
                      ) : (
                        column.header
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={
                      visibleColumns.length + (isRowSelectionEnabled ? 1 : 0)
                    }
                    sx={{
                      textAlign: "center",
                      padding: "40px",
                      color: "#6A6D70",
                    }}
                  >
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row, rowIndex) => {
                  const actualIndex = page * rowsPerPage + rowIndex;
                  const rowId = getRowIdInternal(row, actualIndex);
                  const isSelected = rowSelection[rowId] ?? false;
                  const isSelectable =
                    !enableRowSelectionFn || enableRowSelectionFn(row);

                  return (
                    <TableRow
                      key={rowId}
                      hover
                      selected={isSelected}
                      sx={{
                        "&:hover": {
                          backgroundColor: "#F5F6FA",
                        },
                        "&:last-child td": {
                          borderBottom: "none",
                        },
                        ...(isSelected
                          ? {
                              backgroundColor: "#E6F2FF",
                              "&:hover": {
                                backgroundColor: "#D1E7FF",
                              },
                            }
                          : {}),
                      }}
                    >
                      {isRowSelectionEnabled && (
                        <TableCell
                          sx={{
                            padding: "12px 16px",
                            position: "sticky",
                            left: 0,
                            zIndex: 1,
                            backgroundColor: isSelected ? "#E6F2FF" : "#FFFFFF",
                            minWidth: 50,
                            width: 50,
                          }}
                        >
                          <Checkbox
                            checked={isSelected && isSelectable}
                            disabled={!isSelectable}
                            onChange={(e) =>
                              handleRowSelection(rowId, e.target.checked)
                            }
                            sx={{
                              color: "#32363A",
                              "&.Mui-checked": {
                                color: "#0070F2",
                              },
                            }}
                          />
                        </TableCell>
                      )}
                      {visibleColumns.map((column, colIndex) => {
                        const cellValue = getCellValue(row, column);
                        const context: CellContext<T> = {
                          row: {
                            original: row,
                            index: rowIndex,
                          },
                          value: cellValue,
                          getValue: () => cellValue,
                        };

                        const stickyPos = getStickyPosition(column, colIndex);

                        return (
                          <TableCell
                            key={column.id}
                            sx={{
                              padding: "12px 16px",
                              fontSize: "0.875rem",
                              color: "#32363A",
                              borderBottom: "1px solid #F5F6FA",
                              ...(column.pinned && stickyPos !== undefined
                                ? {
                                    position: "sticky",
                                    [column.pinned]: stickyPos,
                                    zIndex: 1,
                                    backgroundColor: isSelected
                                      ? "#E6F2FF"
                                      : "#FFFFFF",
                                    borderRight:
                                      column.pinned === "left"
                                        ? "1px solid #F5F6FA"
                                        : undefined,
                                    borderLeft:
                                      column.pinned === "right"
                                        ? "1px solid #F5F6FA"
                                        : undefined,
                                  }
                                : {}),
                            }}
                          >
                            {column.cell
                              ? column.cell(context)
                              : String(cellValue ?? "")}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </MuiTable>
        </TableContainer>
        <TablePagination
          component="div"
          count={sortedData.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          sx={{
            "& .MuiTablePagination-toolbar": {
              padding: "12px 16px",
              borderTop: "1px solid #D9D9D9",
              backgroundColor: "#FFFFFF",
            },
            "& .MuiTablePagination-selectLabel": {
              fontSize: "0.875rem",
              color: "#32363A",
            },
            "& .MuiTablePagination-displayedRows": {
              fontSize: "0.875rem",
              color: "#32363A",
            },
            "& .MuiIconButton-root": {
              color: "#32363A",
              "&:hover": {
                backgroundColor: "#E6F2FF",
                color: "#0070F2",
              },
              "&.Mui-disabled": {
                color: "#D9D9D9",
              },
            },
            "& .MuiSelect-root": {
              fontSize: "0.875rem",
              color: "#32363A",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#D9D9D9",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#0070F2",
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};
