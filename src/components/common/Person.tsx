import React from "react";
import { Avatar, Box, Typography } from "@mui/material";

type PersonProps = {
  name: string;
};

export const Person: React.FC<PersonProps> = ({ name }) => {
  const initials = name
    ? name
        .toString()
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "";

  return (
    <Box display="flex" alignItems="center" gap={1} py={1}>
      <Avatar
        sx={{
          bgcolor: "white",
          color: "#F57C00",
          fontWeight: 600,
          border: "1px solid #ccc",
        }}
      >
        {initials}
      </Avatar>
      <Typography variant="body2" color="text.primary">
        {name}
      </Typography>
    </Box>
  );
};
