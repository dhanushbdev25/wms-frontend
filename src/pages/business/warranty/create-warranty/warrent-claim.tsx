import { Divider, Grid, MenuItem, TextField, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {
  Controller,
  Control,
  FieldErrors,
  UseFormSetValue,
} from "react-hook-form";
import { FormDataType } from "../../../../store/api/warranty/warranty.validator";
import { useGetDealerCodeQuery } from "../../../../store/api/warranty/warranty-api";

interface WarrantyClaimProps {
  control: Control<FormDataType>;
  errors: FieldErrors<FormDataType>;
  formData: FormDataType;
  setValue: UseFormSetValue<FormDataType>;
}

const WarrantyClaim = ({
  control,
  errors,
  formData,
  setValue,
}: WarrantyClaimProps) => {
  const claimtype = ["Good Will", "Normal"];
  const pdisold = ["Sold", "Unsold"];

  const {data : dealercode ,isLoading} = useGetDealerCodeQuery(null);  
  return (
    <>
      <Typography
        variant="h5"
        gutterBottom
        align="center"
        sx={{ fontWeight: 600 }}
      >
        Warranty Claim - Vehicle Details
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {/* Row 1 */}
      <Grid container spacing={1} sx={{ mb: 1 }}>
        <Grid item xs={4}>
          <Controller
            name="engineNumber"
            control={control}
            render={({ field }) => (
              <TextField {...field} fullWidth label="Engine Number" disabled />
            )}
          />
        </Grid>
        <Grid item xs={4}>
          <Controller
            name="claimtype"
            control={control}
            rules={{ required: "Claim Type is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                select
                label="Claim Type *"
                error={!!errors.claimtype}
                helperText={errors.claimtype?.message}
              >
                {claimtype.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
        <Grid item xs={4}>
          <Controller
            name="pdisold"
            control={control}
            // rules={{ required: "PDI/Sold status is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                select
                label="PDI/Sold "
                // error={!!errors.pdisold}
                // helperText={errors.pdisold?.message}
              >
                {pdisold.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
      </Grid>

      {/* Row 2 */}
      <Grid container spacing={1} sx={{ mb: 1 }}>
        <Grid item xs={4}>
          <Controller
            name="registrationno"
            control={control}
            // rules={{ required: "Registration Number is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Registration No"
                disabled
                // error={!!errors.registrationno}
                // helperText={errors.registrationno?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={4}>
          <Controller
            name="jobcarddate"
            control={control}
            rules={{ required: "Job Card Date is required" }}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Job Card Date *"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(newValue) =>
                    field.onChange(
                      newValue ? newValue.format("YYYY-MM-DD") : "",
                    )
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.jobcarddate,
                      helperText: errors.jobcarddate?.message,
                    },
                  }}
                />
              </LocalizationProvider>
            )}
          />
        </Grid>

        <Grid item xs={4}>
          <Controller
            name="dealercode"
            control={control}
            rules={{ required: "Dealer Code is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                label="Dealer Code *"
                error={!!errors.dealercode}
                helperText={errors.dealercode?.message}
              >
                {dealercode?.data?.dropdownList?.map((item: any) => (
                  <MenuItem key={item.ID} value={item.CODE}>
                    {item.CODE}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
      </Grid>

      {/* Row 3 */}
      <Grid container spacing={1} sx={{ mb: 1 }}>
        <Grid item xs={4}>
          <Controller
            name="jobCardNumber"
            control={control}
            render={({ field }) => (
              <TextField {...field} fullWidth label="Job Card" disabled />
            )}
          />
        </Grid>
        <Grid item xs={4}>
          <Controller
            name="claimdate"
            control={control}
            // rules={{ required: "Claim Date is required" }}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Claim Date"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(newValue) =>
                    field.onChange(
                      newValue ? newValue.format("YYYY-MM-DD") : "",
                    )
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      // error: !!errors.claimdate,
                      // helperText: errors.claimdate?.message,
                    },
                  }}
                />
              </LocalizationProvider>
            )}
          />
        </Grid>
        <Grid item xs={4}>
          <Controller
            name="maldate"
            control={control}
            rules={{ required: "Malfunction Date is required" }}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Malfunction Date *"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(newValue) =>
                    field.onChange(
                      newValue ? newValue.format("YYYY-MM-DD") : "",
                    )
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.maldate,
                      helperText: errors.maldate?.message,
                    },
                  }}
                />
              </LocalizationProvider>
            )}
          />
        </Grid>
      </Grid>

      {/* Row 4 */}
      <Grid container spacing={1} sx={{ mb: 1 }}>
        <Grid item xs={4}>
          <Controller
            name="repairdate"
            control={control}
            rules={{ required: "Repair Date is required" }}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Repair date*"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(newValue) =>
                    field.onChange(
                      newValue ? newValue.format("YYYY-MM-DD") : "",
                    )
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.repairdate,
                      helperText: errors.repairdate?.message,
                    },
                  }}
                />
              </LocalizationProvider>
            )}
          />
        </Grid>
        <Grid item xs={4}>
          <Controller
            name="malfunctionkm"
            control={control}
            rules={{ required: "Malfunction KMs is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Malfunction KMs *"
                error={!!errors.malfunctionkm}
                helperText={errors.malfunctionkm?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={4}>
          <Controller
            name="repairkm"
            control={control}
            rules={{ required: "Repair KMs is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Repair KMs *"
                error={!!errors.repairkm}
                helperText={errors.repairkm?.message}
              />
            )}
          />
        </Grid>
      </Grid>

      {/* Row 5 */}
      <Grid container spacing={1} sx={{ mb: 1 }}>
        <Grid item xs={4}>
          <Controller
            name="symptoms"
            control={control}
            rules={{ required: "Symptoms is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Symptoms *"
                error={!!errors.symptoms}
                helperText={errors.symptoms?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={4}>
          <Controller
            name="cushis"
            control={control}
            rules={{ required: "Customer Complaint History is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Customer Complaint History *"
                error={!!errors.cushis}
                helperText={errors.cushis?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={4}>
          <Controller
            name="genuineoil"
            control={control}
            rules={{
              validate: (value) =>
                value === true || value === false || "Please select Yes or No",
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                select
                label="Genuine Oil *"
                value={field.value === null ? "" : field.value ? "Yes" : "No"}
                onChange={
                  (e) => field.onChange(e.target.value === "Yes") // stores boolean
                }
                error={!!errors.genuineoil}
                helperText={errors.genuineoil?.message}
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </TextField>
            )}
          />
        </Grid>
      </Grid>

      {/* Row 6 */}
      <Grid container spacing={1}>
        <Grid item xs={4}>
          <Controller
            name="oilgrade"
            control={control}
            rules={{ required: "Engine Oil Grade is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Engine Oil Grade *"
                error={!!errors.oilgrade}
                helperText={errors.oilgrade?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={4}>
          <Controller
            name="oilmake"
            control={control}
            rules={{ required: "Engine Oil Make is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Engine Oil Make *"
                error={!!errors.oilmake}
                helperText={errors.oilmake?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={4}>
          <Controller
            name="bathis"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Battery Service History "
                // error={!!errors.bathis}
                // helperText={errors.bathis?.message}
              />
            )}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default WarrantyClaim;
