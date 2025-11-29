import { Card, CardContent, Typography, Grid, Box } from "@mui/material";
import StorageHierarchyImages from "../../../../../assets/images/storage-hierarchy";

type Props = {
  data: Record<string, number>;
};

const SubStorageLocationTypes = ({ data }: Props) => (
  <Card variant="outlined" sx={{ borderRadius: 2 }}>
    <CardContent>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
        Sub Storage Location Types
      </Typography>

      <Grid container spacing={2}>
        {Object.entries(data).map(([key, value]) => {
          const img = key.toLowerCase().replace(/ /g, "-");

          return (
            <Grid item key={key}>
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "grey.300",
                  backgroundColor: "grey.50",
                  cursor: "pointer",
                  "&:hover": {
                    borderColor: "primary.main",
                    boxShadow: "0 0 6px rgba(25,118,210,0.2)",
                  },
                }}
              >
                <Box sx={{ mb: 1 }}>
                  <img
                    src={
                      StorageHierarchyImages[
                        img as keyof typeof StorageHierarchyImages
                      ]
                    }
                    alt={key}
                  />
                </Box>
                <Typography variant="body1" fontWeight={500}>
                  {key}
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {value}
                </Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </CardContent>
  </Card>
);

export default SubStorageLocationTypes;
