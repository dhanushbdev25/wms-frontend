import React from "react";
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
import {
  Card,
  CardContent,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        usePointStyle: true,
        pointStyle: "circle",
      },
    },
    title: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context: any) => `${context.parsed.y}`,
      },
    },
  },
  scales: {
    x: {
      grid: {
        drawBorder: false,
      },
      ticks: {
        color: "#546E7A",
        maxRotation: 45,
        minRotation: 45,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        drawBorder: false,
      },
      ticks: {
        color: "#B0BEC5",
        stepSize: 50,
      },
    },
  },
};

type Props = {
  title: string;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
};

const Chart = ({ title, labels, datasets }: Props) => {
  const [duration, setDuration] = React.useState("7D");

  const handleDurationChange = (
    _event: React.MouseEvent<HTMLElement>,
    newDuration: string | null
  ) => {
    if (newDuration !== null) {
      setDuration(newDuration);
    }
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
          <ToggleButtonGroup
            value={duration}
            exclusive
            onChange={handleDurationChange}
            size="small"
          >
            <ToggleButton value="7D">7D</ToggleButton>
            <ToggleButton value="30D">30D</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box height="300px">
          <Bar
            data={{
              labels,
              datasets: datasets.map((dataset) => ({
                ...dataset,
                borderRadius: 8,
                barThickness: 40,
              })),
            }}
            options={options as any}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default Chart;
