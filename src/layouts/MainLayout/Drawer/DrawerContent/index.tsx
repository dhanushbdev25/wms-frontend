// project import
import Navigation from "./Navigation";
import SimpleBar from "../../../../components/third-party/SimpleBar";

// ==============================|| DRAWER CONTENT ||============================== //

const DrawerContent = () => (
  <SimpleBar
    sx={{
      background: "#FFFFFF", // SAP Fiori white
      "& .simplebar-content": {
        display: "flex",
        flexDirection: "column",
      },
      "& .simplebar-scrollbar::before": {
        backgroundColor: "#D9D9D9", // SAP Fiori scrollbar color
      },
    }}
  >
    <Navigation />
  </SimpleBar>
);

export default DrawerContent;
