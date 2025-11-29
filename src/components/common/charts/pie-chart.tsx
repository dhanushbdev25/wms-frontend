import { Box, Card, CardContent, Typography } from "@mui/material";
import { pieArcLabelClasses, PieChart } from "@mui/x-charts";

type Props = {
  title: string;
  data: {
    label: string;
    value: number;
    color: string;
  }[];
};

const Chart = ({ title, data }: Props) => {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
      <CardContent>
        <Box
          height="60px"
          padding="0 12px"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            color="#626F86"
            fontSize="14px"
            fontStyle="normal"
            fontWeight="600"
            lineHeight="14px"
          >
            {title}
          </Typography>

          <Box display="flex" alignItems="center" gap={3}>
            {data.map((item) => (
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  width="14px"
                  height="14px"
                  borderRadius="50%"
                  bgcolor={item.color}
                />
                <Typography
                  color="#626F86"
                  fontSize="12px"
                  fontStyle="normal"
                  fontWeight="500"
                  lineHeight="12px"
                >
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
        <Box height={300} display="flex" alignItems="center">
          <PieChart
            series={[
              {
                innerRadius: 60,
                outerRadius: 100,
                data: data.filter((item) => item.value > 0),
                arcLabel: (item: { value: number }) => {
                  return `${item.value}%`;
                },
                valueFormatter: (item: { value: number }) => {
                  return `${item.value}%`;
                },
              },
            ]}
            slotProps={{
              legend: {
                direction: "horizontal",
                position: {
                  vertical: "top",
                  horizontal: "center",
                },
              },
            }}
            hideLegend={true}
            sx={{
              [`& .${pieArcLabelClasses.root}`]: {
                fill: "white",
                fontWeight: "bold", // optional: make the labels stand out
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default Chart;
