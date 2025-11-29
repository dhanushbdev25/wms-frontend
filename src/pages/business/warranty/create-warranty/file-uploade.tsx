import React, { useState } from "react";
import { Box, Typography, Stack, Chip } from "@mui/material";

const FileUpload = ({ onFileSelect, }: { 
  onFileSelect: (file: File) => void; }) => {
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  return (
    <Box
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      sx={{
        border: "2px dashed",
        borderColor: dragOver ? "primary.main" : "grey.400",
        borderRadius: 2,
        p: 3,
        textAlign: "center",
        bgcolor: dragOver ? "grey.50" : "background.paper",
        transition: "all 0.3s ease",
      }}
    >
      <Stack alignItems="center" spacing={1}>
        <Typography variant="body2" color="text.secondary">
          Drag & drop your file here
        </Typography>
        <Typography variant="body2" color="text.secondary">
          OR
        </Typography>

        <input
          type="file"
          id="fileInput"
          hidden
          accept="image/*,application/pdf"
          onChange={handleFileChange}
        />

        <label htmlFor="fileInput" style={{ cursor: "pointer" }}>
          <Chip label="Browse" size="small" clickable color="primary" />
        </label>

        {fileName && (
          <Typography
            variant="body2"
            color="success.main"
            sx={{ mt: 1, wordBreak: "break-word" }}
          >
            {fileName}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default FileUpload;
