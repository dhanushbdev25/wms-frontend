// ==============================|| OVERRIDES - PAPER (SAP Fiori) ||============================== //

export default function Paper() {
  return {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "8px", // SAP Fiori card radius
          background: "#FFFFFF", // SAP Fiori surface
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.12)", // SAP Fiori elevation 2
        },
        elevation1: {
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.08)", // SAP Fiori elevation 1
        },
        elevation2: {
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.12)", // SAP Fiori elevation 2
        },
        elevation3: {
          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.12)", // SAP Fiori elevation 3
        },
      },
    },
  };
}
