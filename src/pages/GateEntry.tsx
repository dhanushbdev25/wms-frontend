import {
  Autocomplete,
  Button,
  Grid,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import GateEntryImage from "./images/GateEntry.svg";
import { useState } from "react";

function GateEntry() {
  const [searchkey, setSearchKey] = useState("containerNo");
  const [gatePassValues, setGatePassValues] = useState({ searchNo: "", truckNo: "",});
  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <Select
          name="searchType"
          value={searchkey}
          onChange={(e) => setSearchKey(e.target.value)}
          size="small"
          fullWidth
        >
          {[
            { value: "Container No", key: "containerNo" },
            { value: "BL No", key: "blNo" },
          ].map((value: any, index: any) => {
            return <MenuItem value={value.key}>{value.value}</MenuItem>;
          })}
        </Select>
      </Grid>
      {searchkey == "containerNo" ? (
        <Grid item xs={9}>
          <Autocomplete
            disableClearable
            id="containerNo"
            value={"1231231"}
            options={["1231231"]}
            //   onChange={(event: any, newValue: any) => {
            //     setSearchValue((prevState) => ({
            //       ...prevState,
            //       vehicleNo: newValue,
            //     }));
            //   }}
            renderInput={(params) => (
              <TextField
                {...params}
                InputLabelProps={{ shrink: true }}
                size="small"
                label="Container No"
              />
            )}
          />
        </Grid>
      ) : (
        <Grid item xs={9}>
          <Autocomplete
            disableClearable
            id="blNo"
            value={"1231231"}
            options={["1231231"]}
            //   onChange={(event: any, newValue: any) => {
            //     setSearchValue((prevState) => ({
            //       ...prevState,
            //       vehicleNo: newValue,
            //     }));
            //   }}
            renderInput={(params) => (
              <TextField
                {...params}
                InputLabelProps={{ shrink: true }}
                size="small"
                label="BL No"
              />
            )}
          />
        </Grid>
      )}

      <Grid item xs={6}>
        <img src={GateEntryImage} style={{ height: "70vh" }} />
      </Grid>
      <Grid item xs={6} style={{ marginTop: "10vh" }}>
        <Paper elevation={0} square>
          <Grid
            container
            spacing={2}
            justifyContent={"center"}
            style={{ padding: "2%" }}
          >
            <Grid item xs={12}>
              <TextField
                id="truckNo"
                size="small"
                label="Truck No."
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="driverName"
                size="small"
                label="Driver Name"
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="driverNumber"
                size="small"
                label="Driver Number"
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={8} />
            <Grid item xs={4}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                style={{ background: "#e03832" }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default GateEntry;
