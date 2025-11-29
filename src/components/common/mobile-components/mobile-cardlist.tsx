import React, { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Divider,
  Chip,
  Button,
  Box,
  useTheme,
  Grid,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";

interface ColumnConfig<T> {
  title: string;
  value: keyof T;
  render?: (item: T) => React.ReactNode;
}

interface HeaderConfig<T> {
  titleKey: { name: string; value: keyof T };
  datakey?: { name: string; value: keyof T }[];
  statusKey?: keyof T;
  renderStatus?: (status: any, item: T) => React.ReactNode;
}

interface ActionConfig<T> {
  label: string;
  color?: "primary" | "secondary" | "error" | "success" | "warning";
  variant?: "outlined" | "contained" | "text";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onClick: (item: T) => void;
  disabled?: boolean | ((item: T) => boolean);
}

interface MobileCardListProps<T> {
  data: T[];
  headers?: HeaderConfig<T>[];
  columns: ColumnConfig<T>[];
  actions?: ActionConfig<T>[];
  search?: {
    enable: boolean;
    placeholder?: string;
    basedOn: (keyof T)[];
  };

  enableRowSelection?: boolean;
  getRowId?: (row: T, index: number) => string;
  rowSelection?: Record<string, boolean>;
  onRowSelectionChange?: (newSelection: Record<string, boolean>) => void;
  enableSelectAll: boolean;
  isRowSelectable?: (row: T) => boolean;
}

function MobileCardList<T extends Record<string, any>>({
  data,
  headers = [],
  columns,
  search,
  actions = [],
  enableRowSelection = false,
  getRowId,
  rowSelection = {},
  onRowSelectionChange,
  enableSelectAll = false,
  isRowSelectable,
}: MobileCardListProps<T>) {
  const theme = useTheme();
  const [searchValue, setSearchValue] = useState("");

  const filteredData = useMemo(() => {
    if (!search?.enable || !searchValue.trim()) return data;

    return data.filter((item) =>
      search.basedOn.some((field) =>
        item[field]
          ?.toString()
          .toLowerCase()
          .includes(searchValue.toLowerCase()),
      ),
    );
  }, [data, searchValue, search]);
  const selectableRows = useMemo(
    () =>
      filteredData.filter((item) =>
        isRowSelectable ? isRowSelectable(item) : true,
      ),
    [filteredData, isRowSelectable],
  );

  return (
    <Stack
      spacing={1.5}
      p={1}
      bgcolor={theme.palette.background.paper}
      borderRadius={1.5}
    >
      {/* Select All */}
      {enableRowSelection && enableSelectAll && filteredData.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            mb: 1,
            pr: 1,
          }}
        >
          <input
            type="checkbox"
            checked={
              selectableRows.length > 0 &&
              selectableRows.every((item, idx) => {
                const id = getRowId ? getRowId(item, idx) : idx.toString();
                return rowSelection[id];
              })
            }
            onChange={(e) => {
              const newState: Record<string, boolean> = {};
              if (e.target.checked) {
                selectableRows.forEach((item, idx) => {
                  const id = getRowId ? getRowId(item, idx) : idx.toString();
                  newState[id] = true;
                });
              }
              onRowSelectionChange?.(newState);
            }}
            style={{ transform: "scale(1.2)", cursor: "pointer" }}
          />
          <Typography fontSize={14} ml={0.8}>
            Select All
          </Typography>
        </Box>
      )}

      {search?.enable && (
        <Box sx={{ mb: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder={search.placeholder ?? "Search..."}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </Box>
      )}

      {filteredData.length === 0 ? (
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          sx={{ mt: 2 }}
        >
          No records found.
        </Typography>
      ) : (
        filteredData.map((item, idx) => {
          const id = getRowId ? getRowId(item, idx) : idx.toString();
          const isSelected = rowSelection[id] ?? false;
          const selectable = isRowSelectable ? isRowSelectable(item) : true;

          return (
            <Card
              key={idx}
              sx={{
                borderRadius: 1.5,
                border: isSelected
                  ? `2px solid ${theme.palette.primary.main}`
                  : "1px solid #d0d0d0",
                backgroundColor: isSelected
                  ? theme.palette.action.selected
                  : theme.palette.background.paper,
                cursor: enableRowSelection ? "pointer" : "default",
                p: 0.5,
              }}
            >
              <Accordion
                disableGutters
                sx={{
                  boxShadow: "none",
                  "&:before": { display: "none" },
                  borderRadius: 1.5,
                }}
              >
                <AccordionSummary
                  sx={{
                    flexDirection: "row-reverse",
                    px: 0.5,
                    py: 0.3,
                    minHeight: "34px !important",
                    "& .MuiAccordionSummary-content": {
                      m: 0,
                      alignItems: "center",
                    },
                  }}
                >
                  <Stack spacing={0.5} sx={{ width: "100%" }}>
                    {headers.map((header, i) => (
                      <Box key={i}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Box>
                            <Typography
                              sx={{
                                fontWeight: 300,
                                fontSize: "10px",
                                color: theme.palette.text.secondary,
                              }}
                            >
                              {header.titleKey.name}
                            </Typography>

                            <Typography variant="subtitle1" fontWeight={500} fontSize={"12px"}>
                              {item[header.titleKey.value] ?? ""}
                            </Typography>
                          </Box>

                          {header.statusKey &&
                            (header.renderStatus ? (
                              header.renderStatus(item[header.statusKey], item)
                            ) : (
                              <Chip
                                label={item[header.statusKey]}
                                size="small"
                                sx={{
                                  backgroundColor: theme.palette.grey[600],
                                  color: "white",
                                  fontSize: "11px",
                                }}
                              />
                            ))}
                        </Stack>

                        {header.datakey?.map((d, index2) => (
                          <Grid container key={index2}>
                            <Grid item sx={{ mr: 1 }}>
                              <Typography
                                sx={{
                                  fontWeight: 300,
                                  fontSize: "10px",
                                  color: theme.palette.text.secondary,
                                }}
                              >
                                {d.name}:
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography
                                sx={{
                                  fontWeight: 300,
                                  fontSize: "10px",
                                  color: theme.palette.text.secondary,
                                }}
                              >
                                {item[d.value] ?? ""}
                              </Typography>
                            </Grid>
                          </Grid>
                        ))}
                      </Box>
                    ))}
                  </Stack>
                </AccordionSummary>
                <AccordionDetails
                  sx={{ px: 0.5, py: 0.5 }}
                  onClick={() => {
                    if (!enableRowSelection || !selectable) return;
                    onRowSelectionChange?.((prev: any) => {
                      const newState = { ...prev };
                      if (newState[id]) delete newState[id];
                      else newState[id] = true;
                      return newState;
                    });
                  }}
                >
                  <Divider sx={{ mb: 1, mx: -1 }} />
                  <Grid container spacing={0.5}>
                    {columns.map((col, i) => (
                      <Grid item xs={6} key={i}>
                        <Box textAlign="center">
                          <Typography
                            sx={{
                              fontSize: "9px",
                              fontWeight: 500,
                              color: theme.palette.text.secondary,
                            }}
                          >
                            {col.title}
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: "11px",
                              fontWeight: 600,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {col.render
                              ? col.render(item)
                              : (item[col.value] ?? "-")}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                  {actions.length > 0 && (
                    <>
                      <Divider sx={{ my: 1, mx: -1 }} />
                      <Stack
                        direction="row"
                        spacing={0.5}
                        justifyContent="flex-end"
                      >
                        {actions.map((action, index) => {
                          const isDisabled =
                            typeof action.disabled === "function"
                              ? action.disabled(item)
                              : (action.disabled ?? false);

                          return (
                            <Button
                              key={index}
                              variant={action.variant ?? "contained"}
                              color={action.color ?? "primary"}
                              size="small"
                              sx={{ fontSize: "10px", px: 1, minWidth: "50px" }}
                              onClick={() => action.onClick(item)}
                          startIcon={action.startIcon}
                          endIcon={action.endIcon}
                          disabled={isDisabled} 
                            >
                              {action.label}
                            </Button>
                          );
                        })}
                      </Stack>
                    </>
                  )}
                </AccordionDetails>
              </Accordion>
            </Card>
          );
        })
      )}
    </Stack>
  );
}

export default MobileCardList;
