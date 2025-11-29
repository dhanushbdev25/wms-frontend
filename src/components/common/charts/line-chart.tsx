import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend
);

type Props = {
  title: string;
  //   label: string;
  data: {
    label: string;
    value: number;
  }[];
};

const Chart = ({ title }: Props) => {
  const [range, setRange] = useState<"7D" | "30D">("7D");

  const handleRangeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newRange: "7D" | "30D" | null
  ): void => {
    if (newRange) {
      setRange(newRange);
    }
  };

  const labels: string[] = [
    "21-07",
    "22-07",
    "23-07",
    "24-07",
    "25-07",
    "26-07",
    "27-07",
  ];
  const values: number[] = [1000, 1500, 1000, 2000, 1500, 2000, 2000];

  const data: ChartData<"line"> = {
    labels,
    datasets: [
      {
        label: "Occupancy",
        data: values,
        fill: true,
        borderColor: "#2979ff",
        tension: 0.4,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(41,121,255,0.2)");
          gradient.addColorStop(1, "rgba(41,121,255,0)");
          return gradient;
        },
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        min: 0,
        max: 2500,
        beginAtZero: true,
        ticks: { stepSize: 500 },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <Box
      border="1px solid #e0e0e0"
      borderRadius={2}
      p={2}
      boxShadow="0 1px 3px rgba(0,0,0,0.05)"
      bgcolor="#fff"
    >
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
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
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body2" color="textSecondary">
            Last
          </Typography>
          <ToggleButtonGroup
            value={range}
            exclusive
            onChange={handleRangeChange}
            size="small"
          >
            <ToggleButton value="7D">7D</ToggleButton>
            <ToggleButton value="30D">30D</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* Chart */}
      <Line data={data} options={options} height={300} />
    </Box>
  );
};

export default Chart;
