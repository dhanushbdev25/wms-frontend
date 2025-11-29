import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";
import { SystemStyleObject } from "@mui/system";
import { deepmerge } from "@mui/utils";
import React from "react";

interface PassFailToggleProps {
  value?: "pass" | "fail" | null; // allow null for clearing
  onChange: (value: "pass" | "fail" | null) => void;
  sx?: SxProps<Theme>;
  disabled?: boolean;
  id?: string;
}

const PassFailToggle: React.FC<PassFailToggleProps> = ({
  value = null,
  onChange,
  sx,
  disabled = false,
  id,
}) => {
  // INTERNAL STATE for immediate UI feedback
  const [internalValue, setInternalValue] = React.useState<"pass" | "fail" | null>(value);

  React.useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleToggle = (_: any, val: "pass" | "fail" | null) => {
    setInternalValue(val);
    onChange(val);
  };

  return (
    <ToggleButtonGroup
      exclusive
      value={internalValue}
      onChange={handleToggle}
      disabled={disabled}
      id={id}
      sx={(theme): SystemStyleObject<Theme> => {
        const base: SystemStyleObject<Theme> = {
          width: 120,
          gap: 0.5,
          "& .MuiToggleButton-root": {
            textTransform: "none",
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            fontSize: "13px",
            width: "50%",
            minHeight: "32px",
            backgroundColor: theme.palette.grey[100],
            border: `1px solid ${theme.palette.divider}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.3,
            "& svg": { fontSize: "16px", transition: "all 0.2s ease" },
            color: theme.palette.text.primary,
            "&.Mui-selected[value='pass']": {
              backgroundColor: theme.palette.success.main,
              color: theme.palette.common.white,
            },
            "&.Mui-selected[value='fail']": {
              backgroundColor: theme.palette.error.main,
              color: theme.palette.common.white,
            },
          },
        };

        const evaluatedConsumerSx =
          typeof sx === "function" ? sx(theme) : (sx ?? {});
        return deepmerge(base, evaluatedConsumerSx) as SystemStyleObject<Theme>;
      }}
    >
      <ToggleButton value="pass">
        <CheckIcon fontSize="small" />
        Pass
      </ToggleButton>
      <ToggleButton value="fail">
        <CloseIcon fontSize="small" />
        Fail
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default PassFailToggle;
