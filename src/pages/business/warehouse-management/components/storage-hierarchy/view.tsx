import React from "react";
import { Box, Typography, Card, CardContent, Divider } from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { StorageHierarchy } from "../../../../../types/storage-hierarchy";
import StorageHierarchyImages from "../../../../../assets/images/storage-hierarchy";

type ViewStorageHierarchyProps = {
  storage: StorageHierarchy[];
};

const ViewStorageHierarchy: React.FC<ViewStorageHierarchyProps> = ({
  storage,
}) => {
  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "flex-start",
          }}
        >
          {storage?.map((step, index) => {
            const img = step.levelName.toLowerCase().replace(/ /g, "-");
            const isLast = index === storage.length - 1;

            return (
              <React.Fragment key={index}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 56,
                      width: 56,
                      backgroundColor: "primary.main",
                      color: "white",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={
                        StorageHierarchyImages[
                          img as keyof typeof StorageHierarchyImages
                        ]
                      }
                      alt={step.levelName}
                      style={{
                        height: "40px",
                        width: "40px",
                        borderRadius: "4px",
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, color: "text.primary", mb: 0.5 }}
                    >
                      {step.levelName}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}
                    >
                      Level {step.levelOrder + 1}
                    </Typography>
                  </Box>
                </Box>
                {!isLast && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      py: 0.5,
                    }}
                  >
                    <ArrowDownwardIcon
                      sx={{
                        color: "primary.main",
                        fontSize: 24,
                      }}
                    />
                  </Box>
                )}
              </React.Fragment>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ViewStorageHierarchy;
