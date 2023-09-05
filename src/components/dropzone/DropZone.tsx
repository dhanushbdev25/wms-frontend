import React, { useCallback, useEffect, useState } from "react";
import { Grid, Paper, SwipeableDrawer } from "@mui/material";
import { useDropzone } from "react-dropzone";
import addFile from "./images/add-file.svg";
import fileAdded from "./images/file-added.svg";
import DeleteIcon from "@mui/icons-material/Delete";

function DropZone({ file, fileName, setWaybillData }: any) {
  // const [fileData, setFileData] = useState<any>();
  const [downloadUrl, setDownloadUrl] = useState("");
  const [open, setOpen] = useState<any>(false);
  useEffect(() => {
    if (file) {
      const blob = new Blob([file], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    }
  }, [file]);

  const onDrop = useCallback((acceptedFile: any) => {
    // setFileData(acceptedFile);
    setWaybillData((prevState: any) => ({
      ...prevState,
      document: acceptedFile[0],
      documentName: acceptedFile[0]?.name,
    }));
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  return (
    <Paper
      elevation={2}
      square
      style={{ textAlign: "center", background: "#ebeced", cursor: "pointer" }}
    >
      <div
        {...getRootProps()}
        style={{
          border: "1px dotted grey",
          height: "330px",
        }}
      >
        {!file?._length ? (
          <Grid container>
            <input {...getInputProps()} />
            <Grid item xs={12}>
              <img src={addFile} style={{ scale: "80%" }} />
            </Grid>
            <Grid item xs={12}>
              <p style={{ color: "grey", padding: "2%" }}>
                Drag 'n' drop some files here, or click to select files.
              </p>
            </Grid>
          </Grid>
        ) : (
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            style={{ textAlign: "center" }}
          >
            <Grid
              item
              xs={12}
              onClick={(event) => {
                event?.stopPropagation();
                setOpen(true);
              }}
            >
              <img
                src={fileAdded}
                style={{ scale: "65%", marginTop: "-10%" }}
              />
            </Grid>
            <Grid item xs={10}>
              <p
                style={{
                  color: "#1f4bb0",
                  marginTop: "-5%",
                  wordWrap: "break-word",
                }}
              >
                {fileName}
              </p>
            </Grid>
            <Grid item xs={2} style={{ marginTop: "-7.5%" }}>
              <DeleteIcon
                style={{
                  color: "#1f4bb0",
                  fontSize: "medium",
                  cursor: "pointer",
                }}
                onClick={(event) => {
                  event?.stopPropagation();
                  // setFileData(null);
                  setWaybillData((prevState: any) => ({
                    ...prevState,
                    document: null,
                    documentName: null,
                  }));
                }}
              />
            </Grid>
          </Grid>
        )}
      </div>
      <SwipeableDrawer
        anchor="right"
        // open={true}
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        onOpen={() => {
          setOpen(false);
        }}
      >
        <iframe
          src={downloadUrl}
          width="100%"
          height="600px"
          title="PDF Viewer"
        />
        {/* <MoreDetails clickedValues={viewMore.sideDrawData} /> */}
      </SwipeableDrawer>
    </Paper>
  );
}

export default DropZone;
