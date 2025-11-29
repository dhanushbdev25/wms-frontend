import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Card,
  Divider,
  Grid,
  TextField,
  Typography,
  useTheme,
  Stack,
  Autocomplete,
} from "@mui/material";

import Button from "../../../../components/common/button/Button";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import FileUpload from "./file-uploade";
import WarrantyClaim from "./warrent-claim";

import { FormDataType, UploadedFile } from "../../../../store/api/warranty/warranty.validator";
import {
  useGetSkuListQuery,
  usePostCreateNewWarrantyMutation,
} from "../../../../store/api/warranty/warranty-api";


import Header from "../../../../components/common/header";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import BackdropLoader from "../../../../components/third-party/BackdropLoader";
import { useUploadAttachmentMutation } from "../../../../store/api/blob-attachements/attachements.api";

const CreateWarranty = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);

  const [postCreateNewWarranty, { isLoading }] =
    usePostCreateNewWarrantyMutation();

  const { data: skulistData } = useGetSkuListQuery(null, {
    refetchOnMountOrArgChange: true,
  });

  const [uploadAttachment,{isLoading : uploadingInProgress}] = useUploadAttachmentMutation();

  const skuList = skulistData?.data?.data || [];

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
    trigger,
  } = useForm<FormDataType>({
    defaultValues: {
      engineNumber: "",
      jobCardNumber: "",
      vinNumber: "",
      invoiceNumber: "",
      invoicedate: "",
      invoicefile: null,
      defectfile: null,
      physicaldefect: "",
      claimtype: "",
      pdisold: "",
      registrationno: "",
      jobcarddate: "",
      dealercode: "",
      maldate: "",
      claimdate: "",
      repairdate: "",
      malfunctionkm: "",
      repairkm: "",
      symptoms: "",
      cushis: "",
      genuineoil: null,
      oilgrade: "",
      oilmake: "",
      bathis: "",
    },
    mode: "onChange",
  });

  const formData = watch();

  // ---------------------------
  //  FILE UPLOAD HANDLER
  // ---------------------------
  const handleFileUpload = async (
    file: File,
    type: "invoicefile" | "defectfile"
  ) => {
    try {
      const jobCardNumber = getValues("jobCardNumber");

      if (!jobCardNumber) {
        Swal.fire("Missing Job Card", "Select job card first", "error");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("refId", jobCardNumber);
      formData.append("fieldName", type);
      formData.append("directory", "warranty");
      formData.append(
        "pageSection",
        type === "invoicefile" ? "invoice" : "defect"
      );

      const res = await uploadAttachment(formData).unwrap();

      const uploaded = {
        file,
        storageName: res.data.FILENAME,
        blobUrl: res.data.BLOBURL,
      };

      setValue(type, uploaded as UploadedFile, { shouldValidate: true });

      Swal.fire("Uploaded!", `${file.name} uploaded`, "success");
    } catch (err) {
      console.error("Upload error:", err);
      Swal.fire("Upload failed", "Try again", "error");
    }
  };

  // ---------------------------
  // PAGE NAVIGATION
  // ---------------------------

  const handleNext = async () => {
    let fieldsToValidate: any = getFieldsForPage(page);

    const optionalFields = [
      "pdisold",
      "registrationno",
      "bathis",
      "claimdate",
    ];

    fieldsToValidate = fieldsToValidate.filter(
      (field: any) => !optionalFields.includes(field)
    );

    const isValid = await trigger(fieldsToValidate);

    if (isValid && page < 4) {
      setPage(page + 1);
    }
  };

  const handleBack = () => {
    if (page > 1) setPage(page - 1);
  };

  const getFieldsForPage = (pageNum: number) => {
    switch (pageNum) {
      case 1:
        return ["engineNumber", "jobCardNumber", "vinNumber"] as const;
      case 2:
        return ["invoiceNumber", "invoicedate", "invoicefile"] as const;
      case 3:
        return ["physicaldefect", "defectfile"] as const;
      case 4:
        return [
          "claimtype",
          "jobcarddate",
          "dealercode",
          "jobCardNumber",
          "maldate",
          "repairdate",
          "malfunctionkm",
          "repairkm",
          "symptoms",
          "cushis",
          "genuineoil",
          "oilgrade",
          "oilmake",
        ] as const;
      default:
        return [];
    }
  };

  const jobCardsForSelectedEngine =
    skuList.map((item: any) => item.JOBCARDNUMBER) || [];

  // ---------------------------
  // FINAL SUBMIT WARRANTY
  // ---------------------------
  const onSubmit = async (data: FormDataType) => {
    try {
      const payload = {
        JOBCARDNUMBER: data.jobCardNumber,
        CLAIMTYPE: data.claimtype,
        SOLDSTATUS: data.pdisold || "",
        REGISTRATIONNO: data.registrationno || "",
        INVOICENO: data.invoiceNumber,
        INVOICEDATE: data.invoicedate,
        DEALERCODE: data.dealercode || "",
        DEALERCLAIMDATE: data.claimdate || "",
        MALFUNCTIONDATE: data.maldate,
        MALFUNCTIONKMS: data.malfunctionkm,
        REPAIRDATE: data.repairdate,
        REPAIRKMS: data.repairkm,
        REPLACEMENTDESC: data.physicaldefect,
        GENUINEOIL: data.genuineoil,
        OILMAKE: data.oilmake,
        OILGRADE: data.oilgrade,
        BATTERYSERVICEHISTORY: data.bathis || "",
        COMPLAINT: data.cushis,

        INVOICEPHOTOS: data.invoicefile
          ? [(data.invoicefile as any).storageName]
          : [],

        DAMAGEPHOTOS: data.defectfile
          ? [(data.defectfile as any).storageName]
          : [],

        COMMENTS: "No comments",
      };

      const res = await postCreateNewWarranty(payload).unwrap();
      if(res.data.success){
      await Swal.fire({
        text: "Warranty created",
        icon: "success",
        title: "New warranty created",
      });
      navigate(-1);
      }
    } catch (err) {
      console.error("API Error:", err);
      Swal.fire("Error", "Failed to create warranty", "error");
    }
  };

  // ---------------------------
  // RENDER PAGE UI
  // ---------------------------

  const renderPage = () => {
    switch (page) {
      case 1:
        return (
          <>
            <Typography
              variant="h5"
              gutterBottom
              align="center"
              sx={{ fontWeight: 600 }}
            >
              Engine & VIN Validation
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Job Card Number *
                </Typography>

                <Controller
                  name="jobCardNumber"
                  control={control}
                  rules={{ required: "Job Card Number is required" }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      value={field.value || null}
                      onChange={(_, newValue) => {
                        field.onChange(newValue);
                        const selectedItem = skuList.find(
                          (item: any) => item.JOBCARDNUMBER === newValue,
                        );
                        setValue(
                          "registrationno",
                          selectedItem?.REGISTRATIONNO || "",
                        );
                        setValue("vinNumber", selectedItem?.VIN || "");
                        setValue("engineNumber", selectedItem?.ENGINENO || "");
                      }}
                      options={jobCardsForSelectedEngine || []}
                      getOptionLabel={(option) => option || ""}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          // label="Job Card Number"
                          fullWidth
                          error={!!errors.jobCardNumber}
                          helperText={errors.jobCardNumber?.message}
                        />
                      )}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Engine Number *
                </Typography>
                <Controller
                  name="engineNumber"
                  control={control}
                  rules={{ required: "Engine number is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      placeholder="Enter ENGINE Number"
                      value={field.value || ""}
                      error={!!errors.engineNumber}
                      helperText={errors.engineNumber?.message}
                      disabled={true}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Enter VIN Number *
                </Typography>
                <Controller
                  name="vinNumber"
                  control={control}
                  rules={{ required: "VIN Number is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      placeholder="Enter VIN Number"
                      value={field.value || ""}
                      error={!!errors.vinNumber}
                      helperText={errors.vinNumber?.message}
                      disabled={true}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </>
        );

      case 2:
        return (
          <>
            <Typography variant="h5" align="center" sx={{ fontWeight: 600 }}>
              Invoice Validation
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography>Enter Invoice number *</Typography>
                <Controller
                  name="invoiceNumber"
                  control={control}
                  rules={{ required: "Invoice Number is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      placeholder="Invoice number"
                      error={!!errors.invoiceNumber}
                      helperText={errors.invoiceNumber?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <Typography>Invoice date *</Typography>
                <Controller
                  name="invoicedate"
                  control={control}
                  rules={{ required: "Invoice date is required" }}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(newValue) =>
                          field.onChange(
                            newValue ? newValue.format("YYYY-MM-DD") : ""
                          )
                        }
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.invoicedate,
                            helperText: errors.invoicedate?.message,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography>Upload Invoice *</Typography>

                <Controller
                  name="invoicefile"
                  control={control}
                  rules={{ required: "Invoice File is required" }}
                  render={({ field: { value } }) => (
                    <Box>
                      <FileUpload
                        onFileSelect={(file) =>
                          handleFileUpload(file, "invoicefile")
                        }
                      />

                      {value && typeof value === "object" && "file" in value && (
                        <Typography sx={{ mt: 1, color: "success.main" }}>
                          Uploaded: {(value as any).file.name}
                        </Typography>
                      )}
                      {errors.invoicefile && (
                        <Typography
                          color="error"
                          variant="caption"
                          sx={{ display: "block", mt: 0.5 }}
                        >
                          {errors.invoicefile.message}
                        </Typography>
                      )}
                    </Box>
                  )}
                />
              </Grid>
            </Grid>
          </>
        );

      case 3:
        return (
          <>
            <Typography variant="h5" align="center" sx={{ fontWeight: 600 }}>
              Check for physical defects
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography>Enter the physical defects *</Typography>
                <Controller
                  name="physicaldefect"
                  control={control}
                  rules={{ required: "physical defect is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      placeholder="Physical defects"
                      error={!!errors.physicaldefect}
                      helperText={errors.physicaldefect?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography>Upload Defect Files *</Typography>
                <Controller
                  name="defectfile"
                  control={control}
                  rules={{ required: "Defect File is required" }}
                  render={({ field: { value } }) => (
                    <Box>
                      <FileUpload
                        onFileSelect={(file) =>
                          handleFileUpload(file, "defectfile")
                        }
                      />

                      {value && typeof value === "object" && "file" in value && (
                        <Typography sx={{ mt: 1, color: "success.main" }}>
                          Uploaded: {(value as any).file.name}
                        </Typography>
                      )}
                      {errors.defectfile && (
                        <Typography
                          color="error"
                          variant="caption"
                          sx={{ display: "block", mt: 0.5 }}
                        >
                          {errors.defectfile.message}
                        </Typography>
                      )}
                    </Box>
                  )}
                />
              </Grid>
            </Grid>
          </>
        );

      case 4:
        return (
          <WarrantyClaim
            control={control}
            errors={errors}
            formData={formData}
            setValue={setValue}
          />
        );
    }
  };

  return (
    <>
    <BackdropLoader openStates={uploadingInProgress || isLoading}/>
      <Header
        title="Create Warranty"
        onBack={() => navigate(-1)}
        buttons={[]}
      />
      <Box sx={{ p: 3, backgroundColor: theme.palette.background.default }}>
        <Card sx={{ p: 3, maxWidth: "90%", mx: "auto" }} key={page}>
          {renderPage()}

          <Divider sx={{ my: 3 }} />

          <Stack direction="row" justifyContent="space-between">
            <Button
              label="Back"
              variant="outlined"
              onClick={handleBack}
              disabled={page === 1}
              startIcon={<KeyboardArrowLeftIcon />}
            />

            <Typography>{page}/4</Typography>

            <Button
              label={page === 4 ? "Submit" : "Next"}
              variant="contained"
              onClick={page === 4 ? handleSubmit(onSubmit) : handleNext}
              endIcon={page === 4 ? "" : <KeyboardArrowRightIcon />}
              disabled={isLoading}
            />
          </Stack>
        </Card>
      </Box>
    </>
  );
};

export default CreateWarranty;
