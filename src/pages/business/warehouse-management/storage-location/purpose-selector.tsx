import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Card,
  CardContent,
  Typography,
  Radio,
  Grid,
  Box,
  Alert,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";

import {
  SplitPurposeIcon,
  StorePurposeIcon,
} from "../../../../assets/images/warehouse-management";
import ErrorMessage from "../../../../components/common/form/error-message";
import { Label } from "../../../../components/common/form/style";

type Props = {
  label: string;
  name: string;
  required?: boolean;
  onChange?: (value: string) => void;
};

const purposeOptions = [
  {
    value: "Store",
    title: "Store Purpose",
    description: "Items will be directly stored here.",
    icon: StorePurposeIcon,
  },
];

const PurposeSelector: React.FC<Props> = ({
  label,
  name,
  required,
  onChange,
}) => {
  const [selected, setSelected] = useState("Store");
  const {
    control,
    setValue,
    formState: { errors, touchedFields },
  } = useFormContext();

  useEffect(() => {
    setValue(name, selected);
  }, [selected, name, setValue]);

  return (
    <Grid item xs={12} container alignItems="center">
      <Grid item xs={3}>
        <Label>
          {label}
          {required && <span style={{ color: "red" }}> *</span>}
        </Label>
      </Grid>
      <Grid item xs={9}>
        <Grid container spacing={2}>
          <Controller
            name={name}
            control={control}
            defaultValue={selected}
            render={({ field }) => (
              <>
                {purposeOptions.map((opt) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    key={opt.value}
                    sx={{ display: "flex" }}
                  >
                    <Card
                      variant="outlined"
                      sx={{
                        borderRadius: 2,
                        cursor: "pointer",
                        borderColor:
                          selected === opt.value ? "primary.main" : "grey.300",
                        borderWidth: 2,
                        boxShadow:
                          selected === opt.value
                            ? "0 0 8px rgba(25, 118, 210, 0.4)"
                            : "",
                        transition: "all 0.2s ease-in-out",
                        flex: 1,
                        display: "flex",
                      }}
                      onClick={() => {
                        setSelected(opt.value);
                        field.onChange(opt.value);
                        if (onChange) onChange(opt.value);
                      }}
                    >
                      <CardContent
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <Radio
                          {...field}
                          checked={selected === opt.value}
                          value={opt.value}
                          onChange={() => {
                            setSelected(opt.value);
                            field.onChange(opt.value);
                          }}
                          color="primary"
                        />
                        <Box sx={{ ml: 2 }}>
                          <Box sx={{ mb: 1 }}>
                            <img
                              src={opt.icon}
                              alt={opt.title}
                              style={{ width: "40px", height: "34px" }}
                            />
                          </Box>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              color: "#172B4D",
                              fontSize: "16px",
                              fontWeight: 500,
                              // lineHeight: "16px",
                            }}
                          >
                            {opt.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#626F86",
                              fontSize: "12px",
                              fontWeight: 400,
                              // lineHeight: "12px",
                              letterSpacing: "0.048px",
                              marginTop: "5px",
                            }}
                          >
                            {opt.description}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </>
            )}
          />

          {/* {selected === "Split" && (
            <Grid item xs={12}>
              <Alert
                icon={<InfoOutlinedIcon fontSize="small" />}
                severity="info"
                sx={{
                  backgroundColor: "#EDF4FF",
                  color: "text.primary",
                  borderRadius: 2,
                  py: 1.5,
                }}
              >
                <Typography variant="body2">
                  Since this storage type is set to <strong>Split</strong>,
                  capacity details cannot be defined here. <br />
                  The system will automatically calculate capacity based on the
                  sum of the child locations’ maximum and full capacities.
                </Typography>
              </Alert>
            </Grid>
          )} */}

          {touchedFields[name] && errors[name] && (
            <Grid item xs={12}>
              <ErrorMessage message={errors[name]?.message as string} />
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PurposeSelector;
