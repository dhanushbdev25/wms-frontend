import { TextField, TextFieldProps } from "@mui/material";
import { Theme } from "@mui/material/styles";
import React from "react";

const CommentBox: React.FC<TextFieldProps> = (props) => {
  return (
    <TextField
      multiline
      rows={1}
      maxRows={3}
      variant="outlined"
      placeholder="Comment"
      sx={(theme: Theme) => ({
        width: "100%", // width
        backgroundColor: theme.palette.background.default,
        borderRadius: 1,
        "& .MuiOutlinedInput-root": {
          height: 32,
          padding: "0 10px",
          display: "flex",
          alignItems: "center",
          fontSize: "13px",
        },
        "& .MuiInputBase-inputMultiline": {
          padding: 0,
          lineHeight: "20px",
        },
        ...(props.sx as object),
      })}
      {...props}
    />
  );
};

export default CommentBox;
