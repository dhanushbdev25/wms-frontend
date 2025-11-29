import { zodResolver } from "@hookform/resolvers/zod";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import {
  Typography,
  Stack,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Grid,
  useTheme,
  Button as MUIButton,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";

import Button from "../../../../components/common/button/Button";
import PassFailToggle from "../../../../components/common/button/PassFailToggle";
import CommentBox from "../../../../components/textfeild/CommentBox";
import {
  ContainerQualityInspectionArray,
  InspectionForm,
  inspectionFormSchema,
  PackageApiResponse,
} from "../../../../store/api/inbound-validators/inbound.validator";
import BackdropLoader from "../../../../components/third-party/BackdropLoader";
import useIsMobile from "../../../../themes/useIsMobile";

export type ContainerInspectionProps = {
  containerData: PackageApiResponse["data"]["CONTAINER_QUALITY_INSPECTION"];
  postContainerQualityInspection: (args: {
    id: number;
    body: ContainerQualityInspectionArray;
  }) => Promise<any>;
  responsedata?: PackageApiResponse;
  postloading: boolean;
};

const ContainerInspection = ({
  containerData,
  postContainerQualityInspection,
  responsedata,
  postloading,
}: ContainerInspectionProps) => {
  const [previews, setPreviews] = useState<Record<number, string[]>>({});
  const [expanded, setExpanded] = useState<boolean>(false);
  const theme = useTheme();

  const methods = useForm<InspectionForm>({
    resolver: zodResolver(inspectionFormSchema),
    defaultValues: {
      items: containerData?.data.map((item) => ({
        questionId: item.QUESTION_ID,
        status:
          item?.ANSWER === true
            ? "pass"
            : item?.ANSWER === false
              ? "fail"
              : undefined,
        comment: item.COMMENT || "",
        files: [],
      })),
    },
  });

  const { control, setValue, reset } = methods;

  const handleStatusChange = (index: number, status: "pass" | "fail") => {
    setValue(`items.${index}.status`, status);
  };

  useEffect(() => {
    return () => {
      Object.values(previews).forEach((urls) => {
        urls.forEach((url) => URL.revokeObjectURL(url));
      });
    };
  }, [previews]);

  const handleFileChange = (index: number, files: File[]) => {
    const file = files[0];
    if (!file) return;
    previews[index]?.forEach((url) => URL.revokeObjectURL(url));
    const url = URL.createObjectURL(file);
    setValue(`items.${index}.files`, [file]);
    setPreviews((prev) => ({ ...prev, [index]: [url] }));
  };

  const handleRemove = (index: number) => {
    previews[index]?.forEach((url) => URL.revokeObjectURL(url));
    setValue(`items.${index}.files`, []);
    setPreviews((prev) => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
  };

  const handleDiscard = () => {
    reset({
      items:
        containerData?.data.map((item) => ({
          questionId: item.ID,
          status: undefined,
          comment: "",
          files: [],
        })) ?? [],
    });
    setPreviews({});
  };

  const packageId = containerData?.data[0]?.PACKING_LIST_ID;
  const onSubmit = async (values: InspectionForm) => {
    const payload = values.items.map((item, index) => {
      const questionData = containerData.data[index];
      return {
        QUESTION_ID: questionData.QualityInspectionQuestion.ID,
        ANSWER: item.status
          ? item.status.toLowerCase() === "pass"
            ? "Pass"
            : "Fail"
          : "",
        COMMENT: item.comment || "",
        ATTACHMENT: item.files?.length
          ? item.files.map((f) => f.name).join(",")
          : "",
      };
    });

    await postContainerQualityInspection({
      id: packageId,
      body: payload,
    });
  };
  const isMobile = useIsMobile();

  return (
    <>
      <BackdropLoader openStates={postloading} />
      <FormProvider {...methods}>
        {isMobile ? (
          <Accordion
            expanded={expanded}
            onChange={() => setExpanded((prev) => !prev)}
            sx={{ boxShadow: "none", borderRadius: 2,
              backgroundColor: "#FFF",
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary
              sx={{ px: 1, py: 0.5, minHeight: "40px !important",
                "&.Mui-expanded": { minHeight: "40px !important", },
                "& .MuiAccordionSummary-content": { margin: 0, padding: 0, alignItems: "center", },
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <LocalShippingOutlinedIcon sx={{ fontSize: "18px" }} />

                <Box>
                  <Typography fontSize="14px" fontWeight={600}>
                    Container Quality Inspection
                  </Typography>
                  <Typography fontSize="11px" color="text.secondary">
                    Check container condition
                  </Typography>
                </Box>
              </Box>

              <Box ml="auto" textAlign="right">
                <Chip
                  label={
                    responsedata?.data.CONTAINER_QUALITY_INSPECTION
                      ?.INSPECTION ?? containerData.INSPECTION
                  }
                  size="small"
                  sx={{
                    backgroundColor:
                      (responsedata?.data?.CONTAINER_QUALITY_INSPECTION
                        ?.INSPECTION ?? containerData.INSPECTION) ===
                      "Completed" ? theme.palette.success.light : theme.palette.error.light,
                    color: "#fff",
                    fontSize: "11px",
                    height: "22px",
                  }}
                />
              </Box>
            </AccordionSummary>

            <Divider sx={{ my: 1 }} />

            <AccordionDetails sx={{ px: 1, py: 0.5 }}>
              <Stack spacing={1.5} mt={2}>
                {containerData.data?.map((q, index) => (
                  <Box
                    key={q.ID}
                    sx={{
                      p: 1.5,
                      backgroundColor: theme.palette.background.paper,
                      borderRadius: 1.5,
                    }}
                  >
                    <Typography fontSize="13px" fontWeight={600} mb={1}>
                      {index + 1}. {q.QualityInspectionQuestion.QUESTION}
                    </Typography>

                    <Grid container spacing={1} alignItems="center">
                      <Grid item>
                        <Controller
                          name={`items.${index}.status`}
                          control={control}
                          render={({ field }) => (
                            <PassFailToggle
                              id={`toggle-${q.ID}`}
                              value={field.value}
                              onChange={(val) => {
                                field.onChange(val);
                                handleStatusChange(index, val);
                              }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs>
                        <Controller
                          name={`items.${index}.comment`}
                          control={control}
                          render={({ field }) => (
                            <CommentBox {...field} id={`comment-${q.ID}`} />
                          )}
                        />
                      </Grid>
                      <Grid item>
                        <Controller
                          name={`items.${index}.files`}
                          control={control}
                          render={() => (
                            <MUIButton variant="outlined" component="label"
                              sx={{ width: 80, height: "28px", textTransform: "none", fontSize: "11px", }}
                            >
                              Upload
                              <input type="file" hidden multiple
                                onChange={(e) => {
                                  const files = Array.from( e.target.files || [], );
                                  handleFileChange(index, files);
                                }}
                              />
                            </MUIButton>
                          )}
                        />
                      </Grid>
                    </Grid>
                    {previews[index]?.length > 0 && (
                      <Stack direction="row" mt={1} spacing={1}>
                        <Box
                          component="img"
                          src={previews[index][0]}
                          sx={{ width: 90, height: 70, objectFit: "cover", borderRadius: 1, }}
                        />
                        <Button label="remove" variant="outlined" color="error"
                          size="small"
                          onClick={() => handleRemove(index)}
                        />
                      </Stack>
                    )}
                  </Box>
                ))}
              </Stack>

              <Stack direction="row" justifyContent="flex-end" spacing={1} mt={3} >
                <Button label="Discard" variant="outlined" size="small"
                  color="inherit"
                  onClick={handleDiscard}
                />

                <Button label="Submit" variant="contained" size="small"
                  onClick={methods.handleSubmit(onSubmit)}
                />
              </Stack>
            </AccordionDetails>
          </Accordion>
        ) : (
          <Accordion
            expanded={expanded}
            onChange={() => setExpanded((prev) => !prev)}
            sx={{
              boxShadow: "none",
              padding: 0,
              width: "100%",
              maxWidth: "100vw",
            }}
            id="container-inspection-accordion"
            data-testid="container-inspection-accordion"
          >
            <AccordionSummary sx={{ flexDirection: "row-reverse" }}>
              <Grid
                container
                spacing={2}
                alignItems="center"
                sx={{ marginLeft: "12px" }}
              >
                <Grid item xs={1} md={1}>
                  <LocalShippingOutlinedIcon />
                </Grid>
                <Grid item xs={7} md={7}>
                  <Typography variant="h5">
                    Container Quality Inspection
                  </Typography>
                  <Typography variant="body2">
                    Check overall container condition and packaging integrity
                  </Typography>
                </Grid>
                <Grid item xs={2} md={2}>
                  <Box textAlign="center">
                    <Typography>Inspection</Typography>
                    <Chip
                      label={
                        responsedata?.data.CONTAINER_QUALITY_INSPECTION
                          ?.INSPECTION ?? containerData.INSPECTION
                      }
                      sx={{
                        backgroundColor: theme.palette.background.paper,
                        color:
                          (responsedata?.data?.CONTAINER_QUALITY_INSPECTION
                            ?.INSPECTION ?? containerData.INSPECTION) ===
                          "Completed"
                            ? theme.palette.success.light
                            : theme.palette.error.light,
                        opacity: 0.9,
                        fontWeight: 500,
                      }}
                    />
                  </Box>
                </Grid>
                {/* commented out for future use */}
                {/* <Grid item xs={2} md={2}>
                <Box textAlign="center">
                  <Typography>Result</Typography>
                  <Chip
                    label={
                      responsedata?.data.CONTAINER_QUALITY_INSPECTION.STATUS ??
                      containerData.STATUS
                    }
                    sx={{
                      backgroundColor: "#E8F5E9",
                      color: "#2E7D32",
                      opacity: 0.9,
                      fontWeight: 500,
                    }}
                  />
                </Box>
              </Grid> */}
              </Grid>
            </AccordionSummary>

            <AccordionDetails>
              <Stack spacing={1.5} justifyContent="flex-start" ml={15} mr={5}>
                {containerData.data?.map((q, index) => (
                  <Box
                    key={q.ID}
                    sx={{
                      p: 2,
                      backgroundColor: theme.palette.background.paper,
                      borderRadius: 2,
                    }}
                  >
                    <Typography fontWeight={600} mb={2}>
                      {index + 1}. {q.QualityInspectionQuestion.QUESTION}
                    </Typography>

                    <Grid container spacing={2} alignItems="center">
                      {/* Pass/Fail */}
                      <Grid item>
                        <Controller
                          name={`items.${index}.status`}
                          control={control}
                          render={({ field }) => (
                            <PassFailToggle
                              id={`passfail-toggle-${q.ID}`}
                              value={field.value || null}
                              onChange={(val) => {
                                field.onChange(val); // update form state
                                handleStatusChange(index, val); // optional extra
                              }}
                            />
                          )}
                        />
                      </Grid>

                      {/* Comment */}
                      <Grid item xs>
                        <Controller
                          name={`items.${index}.comment`}
                          control={control}
                          render={({ field }) => (
                            <CommentBox
                              {...field}
                              label=""
                              id={`comment-${q.ID}`}
                            />
                          )}
                        />
                      </Grid>

                      {/* Upload */}
                      <Grid item>
                        <Controller
                          name={`items.${index}.files`}
                          control={control}
                          render={() => (
                            <MUIButton
                              variant="outlined"
                              component="label"
                              id={`upload-btn-${q.ID}`}
                              sx={{
                                width: 100,
                                height: "32px",
                                textTransform: "none",
                                borderColor: "#D1D5DB",
                                color: "#374151",
                                px: 2,
                                py: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              Upload
                              <input
                                type="file"
                                hidden
                                multiple
                                onChange={(e) => {
                                  const files = Array.from(
                                    e.target.files || [],
                                  );
                                  handleFileChange(index, files);
                                }}
                              />
                            </MUIButton>
                          )}
                        />
                      </Grid>
                    </Grid>

                    {/* Image Previews */}
                    {previews[index]?.length > 0 && (
                      <Stack
                        direction="row"
                        spacing={1}
                        mt={2}
                        alignItems="center"
                      >
                        <Box
                          component="img"
                          src={previews[index][0]}
                          alt={`preview-${index}`}
                          sx={{
                            width: 140,
                            height: 100,
                            objectFit: "cover",
                            borderRadius: 1,
                            boxShadow: "0 0 3px rgba(0,0,0,0.2)",
                          }}
                        />
                        <Button
                          label="remove"
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleRemove(index)}
                        />
                      </Stack>
                    )}
                  </Box>
                ))}
              </Stack>

              {/* Action Buttons */}
              <Stack
                direction="row"
                justifyContent="flex-end"
                spacing={2}
                mt={4}
              >
                <Button
                  label="Discard"
                  data-testid="discard-btn"
                  variant="outlined"
                  startIcon={<CloseIcon />}
                  color="inherit"
                  sx={{
                    borderColor: "#9CA3AF",
                    color: "#4B5563",
                  }}
                  onClick={handleDiscard}
                  disabled={
                    containerData?.INSPECTION?.toLowerCase() === "completed" ||
                    responsedata?.data?.CONTAINER_QUALITY_INSPECTION?.INSPECTION?.toLowerCase() ===
                      "completed"
                  }
                  id="discard-btn"
                />
                <Button
                  label="Submit"
                  startIcon={<DoneIcon />}
                  variant="contained"
                  disabled={
                    containerData?.INSPECTION?.toLowerCase() === "completed" ||
                    responsedata?.data?.CONTAINER_QUALITY_INSPECTION?.INSPECTION?.toLowerCase() ===
                      "completed"
                  }
                  onClick={methods.handleSubmit((data) => {
                    onSubmit(data);
                    setExpanded(false);
                  })}
                  id="submit-btn"
                />
              </Stack>
            </AccordionDetails>
          </Accordion>
        )}
      </FormProvider>
    </>
  );
};

export default ContainerInspection;
