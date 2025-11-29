import { Card, CardContent, Typography, Box } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type Props = {
  title: string;
  label: string;
  data: {
    label: string;
    value: number;
  }[];
};

const Chart = ({ title, label, data }: Props) => {
  const labels = data.map((item) => item.label);
  const values = data.map((item) => item.value);

  // Auto max value with 10% buffer
  const maxY = Math.ceil((Math.max(...values) * 1.1) / 50) * 50;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // No legend like in the screenshot
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#546E7A",
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          display: false,
        },
      },
      y: {
        min: 0,
        max: maxY,
        ticks: {
          color: "#B0BEC5",
          stepSize: 50,
        },
        grid: {
          color: "#ECEFF1",
        },
      },
    },
  };

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
        </Box>
        <Box height="300px">
          <Bar
            data={{
              labels,
              datasets: [
                {
                  label,
                  data: values,
                  backgroundColor: "#388BFF",
                  borderRadius: 10, // Rounded bars
                },
              ],
            }}
            options={options}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default Chart;
