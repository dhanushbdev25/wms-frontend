import { Box, Paper, Typography } from "@mui/material";
import ActivityCard from "./activity-card";
import { ActivityDetail } from "../../../types";

type Props = {
  data: ActivityDetail[];
};

const RecentActivities = ({ data }: Props) => (
  <Paper
    sx={{
      borderRadius: "12px",
      background: "rgba(9, 30, 66, 0.06)",
    }}
  >
    <Typography
      color="#172B4D"
      fontSize="16px"
      fontStyle="normal"
      fontWeight="500"
      lineHeight="16px"
      padding="20px 12px"
    >
      Recent Activities
    </Typography>
    <Box
      display="flex"
      padding="0 12px"
      flexDirection="column"
      justifyContent="center"
      alignItems="flex-start"
      gap={0}
      alignSelf="stretch"
    >
      {data.map((activity, index) => {
        return <ActivityCard key={index + 1} activity={activity} />;
      })}
    </Box>
  </Paper>
);

export default RecentActivities;
