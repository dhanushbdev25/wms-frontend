// ==============================|| OVERRIDES - LINEAR PROGRESS (SAP Fiori) ||============================== //

export default function LinearProgress() {
  return {
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 4,
          borderRadius: 2,
          backgroundColor: "#FFF3E0", // Professional light yellow/orange background
        },
        bar: {
          borderRadius: 2,
          backgroundColor: "#F57C00", // Professional Yellow/Orange primary
        },
      },
    },
  };
}
