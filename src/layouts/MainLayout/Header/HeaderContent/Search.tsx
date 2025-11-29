// material-ui
import { Box, FormControl, Grid } from "@mui/material";
import Button from "../../../../components/common/button/Button";

// ==============================|| HEADER CONTENT - SEARCH ||============================== //

const Search = ({ submitButton = false }: { submitButton?: boolean }) => {
  return (
    <Box sx={{ width: "100%", ml: { xs: 0, md: 0 } }}>
      <FormControl>
        <Grid container display={"flex"} flexDirection={"row"}>
          <Grid item></Grid>
          <Grid item>
            {submitButton && (
              <Button
                label="Search"
                sx={{ marginLeft: 5, height: 35 }}
                variant="outlined"
              />
            )}
          </Grid>
        </Grid>
      </FormControl>
    </Box>
  );
};

export default Search;
