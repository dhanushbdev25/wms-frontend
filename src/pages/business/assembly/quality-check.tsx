import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useTheme,
  Grid,
  Stack,
  Box,
  Typography,
  Button as MUIButton,
} from "@mui/material";
import { Controller, FormProvider, useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";

import Header from "../../../components/common/header";
import BackdropLoader from "../../../components/third-party/BackdropLoader";
import PassFailToggle from "../../../components/common/button/PassFailToggle";
import CommentBox from "../../../components/textfeild/CommentBox";
import Button from "../../../components/common/button/Button";

import {
  useGetQualityInspectionQuery,
  usePostQualityInspectionMutation,
} from "../../../store/api/assembly/assembly-api";
import {
  InspectionForm,
  inspectionFormSchema,
} from "../../../store/api/inbound-validators/inbound.validator";
import Swal from "sweetalert2";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";

const ContainerInspection = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  // const { id } = useParams();
  const id = location.state?.id;
  const itemId = location.state?.stockid;

  const { data: apiData, isLoading: isFetching } =
    useGetQualityInspectionQuery(id);
  const [postQualityInspection, { isLoading: isSubmitting }] =
    usePostQualityInspectionMutation();

  const [previews, setPreviews] = useState<
    Record<number, { file: File; url: string; name: string; type: string }[]>
  >({});

  const methods = useForm<InspectionForm>({
    // resolver: zodResolver(inspectionFormSchema),
    defaultValues: {
      items: [],
    },
  });

  const { control, setValue, reset } = methods;
  const [previewDialog, setPreviewDialog] = useState<{
    open: boolean;
    url: string;
    name: string;
  } | null>(null);

  // Map API response to form values
  useEffect(() => {
    if (apiData?.data) {
      const mapped = apiData.data.map((q: any) => ({
        questionId: q.ID,
        status: undefined,
        comment: "",
        files: [],
      }));
      reset({ items: mapped });
      setPreviews({});
    }
  }, [apiData, reset]);

  const handleStatusChange = (index: number, status: "pass" | "fail") => {
    setValue(`items.${index}.status`, status);
  };

  const handleFileChange = (index: number, files: File[]) => {
    if (!files.length) return;

    const existingFiles: File[] =
      methods.getValues(`items.${index}.files`) || [];

    const combinedFiles = [...existingFiles, ...files];

    setValue(`items.${index}.files`, combinedFiles);

    const existingPreviews = previews[index] || [];

    const newPreviews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      type: file.type,
    }));

    setPreviews((prev) => ({
      ...prev,
      [index]: [...existingPreviews, ...newPreviews],
    }));
  };

  const handleRemove = (qIndex: number, fileIndex: number) => {
    const currentFiles: File[] =
      methods.getValues(`items.${qIndex}.files`) || [];
    const currentPreviews = previews[qIndex] || [];

    if (currentPreviews[fileIndex]) {
      URL.revokeObjectURL(currentPreviews[fileIndex].url);
    }

    const updatedFiles = currentFiles.filter(
      (_: any, i: number) => i !== fileIndex,
    );
    const updatedPreviews = currentPreviews.filter(
      (_: any, i: number) => i !== fileIndex,
    );

    setValue(`items.${qIndex}.files`, updatedFiles);
    setPreviews((prev) => ({
      ...prev,
      [qIndex]: updatedPreviews,
    }));
  };

  const handleDiscard = () => {
    if (!apiData?.data) return;
    const resetItems = apiData.data.map((q: any) => ({
      questionId: q.ID,
      status: undefined,
      comment: "",
      files: [],
    }));
    reset({ items: resetItems });

    Object.values(previews).forEach((arr) =>
      arr.forEach((p) => URL.revokeObjectURL(p.url)),
    );
    setPreviews({});
    navigate(-1);
  };

  const onSubmit = async (values: InspectionForm) => {
    if (!apiData?.data) return;

    const unanswered = values.items.some((item) => !item.status);
    if (unanswered) {
      Swal.fire({
        icon: "error",
        title: "Incomplete Submission",
        text: "Please answer all the questions.",
      });
      return;
    }

    const missingComments: number[] = [];
    values.items.forEach((item, i) => {
      if (item.status === "fail" && !item.comment.trim()) {
        missingComments.push(i + 1);
      }
    });

    if (missingComments.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Comment Required",
        html: `Please add comment for the following failed questions:<br><br>
           <b>${missingComments.join(", ")}</b>`,
      });
      return;
    }
    let missingQuestions: number[] = [];
    for (let i = 0; i < values.items.length; i++) {
      const item = values.items[i];

      if (item.status === "fail" && (!item.files || item.files.length === 0)) {
        missingQuestions.push(i + 1);
      }
    }

    if (missingQuestions.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Attachments Required",
        html: `Please upload at least one file for the following failed questions:<br><br>
             <b>${missingQuestions.join(", ")}</b>`,
      });
      return;
    }
    const payload = apiData.data.map((question: any, index: number) => {
      const item = values.items[index];

      return {
        QUESTION_ID: question.ID,
        ANSWER: item.status === "pass" ? "Pass" : "Fail",
        COMMENT: item.comment || "",
        ATTACHMENT:
          item.files && item.files.length > 0
            ? item.files.map((f) => f.name).join(",")
            : "",
      };
    });

    try {
      await postQualityInspection({
        id,
        itemId,
        body: payload,
      }).unwrap();

      Object.values(previews).forEach((arr) =>
        arr.forEach((p) => URL.revokeObjectURL(p.url)),
      );
      setPreviews({});

      navigate(-1);
    } catch (err) {
      console.error("Error submitting:", err);
    }
  };

  const openInSystemViewer = (file: File) => {
  const fileURL = URL.createObjectURL(file);

  // Create a hidden link
  const link = document.createElement("a");
  link.href = fileURL;
  link.download = file.name;   // forces download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Attempt to open using system viewer (depends on browser/user settings)
  setTimeout(() => {
    window.open(fileURL, "_blank");
  }, 500);
};


  if (isFetching) return <BackdropLoader openStates />;

  return (
    <>
      <BackdropLoader openStates={isSubmitting} />
      <Header
        title="Quality Check"
        onBack={() => navigate(-1)}
        buttons={[
          {
            label: "Discard",
            variant: "outlined",
            icon: <CloseIcon />,
            onClick: handleDiscard,
          },
          {
            label: "Submit",
            variant: "outlined",
            icon: <DoneIcon />,
            onClick: methods.handleSubmit(onSubmit),
          },
        ]}
      />

      <FormProvider {...methods}>
        <Stack spacing={2}>
          {apiData?.data?.map((q: any, index: number) => (
            <Box
              key={q.ID}
              sx={{
                p: 2,
                backgroundColor: theme.palette.background.paper,
                borderRadius: 2,
              }}
            >
              <Typography fontWeight={600} mb={2}>
                {index + 1}. {q.QUESTION}
              </Typography>

              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Controller
                    name={`items.${index}.status`}
                    control={control}
                    render={({ field }) => (
                      <PassFailToggle
                        id={`passfail-toggle-${q.ID}`}
                        value={field.value || null}
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
                      <CommentBox {...field} label="" id={`comment-${q.ID}`} />
                    )}
                  />
                </Grid>

                <Grid item>
                  <Controller
                    name={`items.${index}.files`}
                    control={control}
                    render={() => (
                      <MUIButton
                        variant="outlined"
                        component="label"
                        id={`upload-btn-${q.ID}`}
                      >
                        Upload
                        <input
                          type="file"
                          hidden
                          multiple
                          onChange={(e) =>
                            handleFileChange(
                              index,
                              Array.from(e.target.files || []),
                            )
                          }
                        />
                      </MUIButton>
                    )}
                  />
                </Grid>
              </Grid>

              {previews[index]?.length > 0 && (
                <Stack direction="row" spacing={2} mt={2} flexWrap="wrap">
                  {previews[index].map((p, pIdx) => {
                    const isImage = p.type.startsWith("image/");
                    const isPdf = p.type === "application/pdf";

                    return (
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        key={pIdx}
                      >
                        {isImage ? (
                          <Box
                            component="img"
                            src={p.url}
                            alt={p.name}
                            sx={{
                              width: 140,
                              height: 100,
                              objectFit: "cover",
                              borderRadius: 1,
                              boxShadow: "0 0 3px rgba(0,0,0,0.2)",
                            }}
                            onClick={() => setPreviewDialog({ open: true, url: p.url, name: p.name, }) }
                          />
                        ) : isPdf ? (
                          <Box
                           onClick={() => openInSystemViewer(p.file)}
                            sx={{
                              width: 140,
                              height: 100,
                              borderRadius: 1,
                              boxShadow: "0 0 3px rgba(0,0,0,0.2)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexDirection: "column",
                              backgroundColor: "#f5f5f5",
                              p: 1,
                              textAlign: "center",
                            }}
                          >
                            <Typography fontSize={14} fontWeight={600}>
                              PDF File
                            </Typography>
                            <Typography
                              fontSize={12}
                              noWrap
                              sx={{
                                maxWidth: 100,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {p.name}
                            </Typography>
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              width: 140,
                              height: 100,
                              borderRadius: 1,
                              boxShadow: "0 0 3px rgba(0,0,0,0.2)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexDirection: "column",
                              backgroundColor: "#f5f5f5",
                              p: 1,
                              textAlign: "center",
                            }}
                          >
                            <Typography fontSize={14} fontWeight={600}>
                              File
                            </Typography>
                            <Typography
                              fontSize={12}
                              noWrap
                              sx={{
                                maxWidth: 100,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {p.name}
                            </Typography>
                          </Box>
                        )}

                        <Box sx={{ width: "80px" }}>
                          <Button
                            label="remove"
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleRemove(index, pIdx)}
                          />
                        </Box>
                      </Stack>
                    );
                  })}
                </Stack>
              )}
            </Box>
          ))}
        </Stack>
      </FormProvider>
      {previewDialog?.open && (
        <Dialog open onClose={() => setPreviewDialog(null)} maxWidth="md">
          <DialogTitle>
            {previewDialog.name}
            <IconButton
              onClick={() => setPreviewDialog(null)}
              sx={{ position: "absolute", right: 10, top: 10 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ display: "flex", justifyContent: "center" }}>
            {previewDialog.url.endsWith(".pdf") ? (
              <iframe
                src={previewDialog.url}
                style={{ width: "100%", height: "80vh" }}
              />
            ) : (
              <img
                src={previewDialog.url}
                alt={previewDialog.name}
                style={{ maxWidth: "100%", height: "auto" }}
              />
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ContainerInspection;
