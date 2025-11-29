import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Collapse,
  Divider,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import InventoryIcon from "@mui/icons-material/Inventory";

import { Table, Cell } from "../../../../components/common/table";
import { SkuItem } from "../../../../store/api/outbound-validators/outbound.validator";
import MobileCardList from "../../../../components/common/mobile-components/mobile-cardlist";
import useIsMobile from "../../../../themes/useIsMobile";

interface OutboundStorageCardProps {
  storage: {
    storageName: string;
    skuList: SkuItem[];
  };
  serialized: boolean;
  statusColors: Record<string, string>;
  index: number;
}

const OutboundStorageCard: React.FC<OutboundStorageCardProps> = ({
  storage,
  serialized,
  statusColors,
  index,
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(true);
  const skuList = Array.isArray(storage?.skuList) ? storage.skuList : [];
  const isMobile = useIsMobile();

  const availableCount = skuList.filter(
    (item) => (item.storage ?? "").toString().toLowerCase() === "yet to pickup",
  ).length;

  const pickedCount = skuList.filter(
    (item) => (item.storage ?? "").toString().toLowerCase().includes("picked"),
  ).length;

  return (
    <Box sx={{ width: "100%", mb: 2 }}>
      <Card
        sx={{
          borderRadius: 2,
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)",
          border: "1px solid rgba(0, 0, 0, 0.08)",
          transition: "all 0.3s ease-in-out",
          overflow: "hidden",
          "&:hover": {
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.12)",
            borderColor: "rgba(0, 112, 242, 0.2)",
          },
        }}
      >
        {/* Card Header */}
        <Box
          sx={{
            p: 2.5,
            backgroundColor: "rgba(0, 112, 242, 0.02)",
            borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 48,
                borderRadius: 1.5,
                backgroundColor: "rgba(0, 112, 242, 0.1)",
                color: "primary.main",
              }}
            >
              <InventoryIcon />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: "1.125rem",
                  color: "text.primary",
                  mb: 0.5,
                }}
              >
                {storage.storageName}
              </Typography>
              <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                <Chip
                  label={`${skuList.length} Items`}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(0, 112, 242, 0.08)",
                    color: "primary.main",
                    fontWeight: 500,
                    fontSize: "0.75rem",
                    height: 24,
                  }}
                />
                {availableCount > 0 && (
                  <Chip
                    label={`${availableCount} Available`}
                    size="small"
                    sx={{
                      backgroundColor: theme.palette.error.light + "20",
                      color: theme.palette.error.dark,
                      fontWeight: 500,
                      fontSize: "0.75rem",
                      height: 24,
                    }}
                  />
                )}
                {pickedCount > 0 && (
                  <Chip
                    label={`${pickedCount} Picked`}
                    size="small"
                    sx={{
                      backgroundColor: theme.palette.success.light + "20",
                      color: theme.palette.success.dark,
                      fontWeight: 500,
                      fontSize: "0.75rem",
                      height: 24,
                    }}
                  />
                )}
              </Box>
            </Box>
          </Box>

          <IconButton
            onClick={() => setExpanded(!expanded)}
            sx={{
              color: "text.secondary",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        {/* Card Content */}
        <Collapse in={expanded} timeout="auto">
          <Divider />
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 2 }}>
              {isMobile ? (
                <MobileCardList<SkuItem>
                  data={skuList}
                  headers={[
                    {
                      titleKey: { name: "SKU Name", value: "skuName" },
                    },
                  ]}
                  columns={[
                    { title: "SKU Code", value: "sku" },
                    {
                      title: "Status",
                      value: "storage",
                      render: (item) => {
                        const status = (item.storage ?? "")
                          .toString()
                          .toLowerCase();
                        const color = statusColors?.[status] ?? "#999";

                        return (
                          <Chip
                            label={item.storage}
                            size="small"
                            sx={{
                              backgroundColor: color,
                              color: "#fff",
                              height: 22,
                              fontSize: "10px",
                              padding: "0 3px",
                            }}
                          />
                        );
                      },
                    },
                    ...(serialized ? [{ title: "VIN", value: "vin_number" }] : []),
                  ]}
                  actions={[]}
                />
              ) : (
                <Table data={skuList}>
                  <Cell
                    type="custom"
                    title="SKU"
                    render={(cell) => {
                      const row = cell.row.original as SkuItem;
                      return (
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {row.skuName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {row.sku}
                          </Typography>
                        </Box>
                      );
                    }}
                  />
                  {serialized && (
                    <Cell type="text" title="Vin Number" value="vin_number" />
                  )}
                  <Cell
                    type="status"
                    title="Status"
                    value="storage"
                    colors={statusColors}
                  />
                </Table>
              )}
            </Box>
          </CardContent>
        </Collapse>
      </Card>
    </Box>
  );
};

export default OutboundStorageCard;

