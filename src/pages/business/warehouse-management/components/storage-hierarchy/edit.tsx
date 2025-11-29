import React from "react";
import { Box, Typography, Card, CardContent, IconButton, Tooltip } from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import EditIcon from "@mui/icons-material/Edit";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import EditStorageAddModel from "./model";
import { StorageHierarchy } from "../../../../../types/storage-hierarchy";
import StorageHierarchyImages from "../../../../../assets/images/storage-hierarchy";

type ShowStorageHierarchyProps = {
  storage: StorageHierarchy[];
  setStorage: React.Dispatch<React.SetStateAction<StorageHierarchy[]>>;
};

const EditStorageHierarchy: React.FC<ShowStorageHierarchyProps> = ({
  storage,
  setStorage,
}) => {
  //  Avoid direct mutation
  const remove = (index: number) => {
    const newArr = [...storage];
    newArr.splice(index, 1);
    setStorage(newArr);
  };

  const stepMoveDown = (index: number) => {
    if (index < 0 || index >= storage.length - 1) return;
    const newArr = [...storage];
    [newArr[index], newArr[index + 1]] = [newArr[index + 1], newArr[index]];
    setStorage(newArr);
  };

  const stepMoveUp = (index: number) => {
    if (index <= 0 || index > storage.length - 1) return;
    const newArr = [...storage];
    [newArr[index], newArr[index - 1]] = [newArr[index - 1], newArr[index]];
    setStorage(newArr);
  };

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
          {storage?.map((step, index: number) => {
            const img = step.levelName.toLowerCase().replace(/ /g, "-");
            const isLast = index === storage.length - 1;
            const isWarehouse = step.levelName.toUpperCase() === "WAREHOUSE";

            return (
              <React.Fragment key={index}>
                <Card
                  elevation={0}
                  sx={{
                    width: "100%",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          flex: 1,
                        }}
                      >
                        {!isWarehouse && (
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 0.5,
                            }}
                          >
                            <Tooltip title="Move Up">
                              <IconButton
                                size="small"
                                onClick={() => stepMoveUp(index)}
                                disabled={index === 1}
                                sx={{
                                  border: "1px solid",
                                  borderColor: "divider",
                                  borderRadius: 1,
                                }}
                              >
                                <KeyboardArrowUpOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Move Down">
                              <IconButton
                                size="small"
                                onClick={() => stepMoveDown(index)}
                                disabled={index === storage.length - 1}
                                sx={{
                                  border: "1px solid",
                                  borderColor: "divider",
                                  borderRadius: 1,
                                }}
                              >
                                <KeyboardArrowDownOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        )}
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
                            sx={{
                              fontWeight: 600,
                              color: "text.primary",
                              mb: 0.5,
                            }}
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
                      {!isWarehouse && (
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            alignItems: "center",
                          }}
                        >
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              sx={{
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 1,
                              }}
                            >
                              <EditStorageAddModel
                                index={index}
                                storage={storage}
                                setStorage={setStorage}
                              />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => remove(index)}
                              sx={{
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 1,
                                color: "error.main",
                                "&:hover": {
                                  backgroundColor: "error.light",
                                  color: "error.dark",
                                },
                              }}
                            >
                              <DeleteOutlineOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
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

export default EditStorageHierarchy;
